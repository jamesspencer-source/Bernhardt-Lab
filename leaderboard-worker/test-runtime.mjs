import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';

async function migrate(db) {
  for (const file of ['schema.sql', 'security-schema.sql']) {
    const sql = readFileSync(new URL(file, import.meta.url), 'utf8').replace(/^--.*$/gm, '');
    // D1 exec accepts one complete script per line; keep trigger bodies intact.
    await db.exec(sql.replace(/\n/g, ' '));
  }
}

test('Cloudflare runtime: D1 atomic replay, real rate bindings and additive schema', async () => {
  const mf = new Miniflare(convertV4MiniflareOptions({
    modules: true, scriptPath: fileURLToPath(new URL('./worker.js', import.meta.url)),
    compatibilityDate: '2025-01-15', d1Databases: ['DB'],
    cf: false,
    bindings: { RUN_CLIENT_SECRET: 'local-test-only-reservation-key-32-bytes' },
    ratelimits: {
      WRITE_LIMITER: { namespace_id: '1846100201', simple: { limit: 120, period: 60 } },
      CLIENT_LIMITER: { namespace_id: '1846100202', simple: { limit: 30, period: 60 } }
    },
    outboundService: () => new Response('Offline test: external requests disabled', { status: 503 })
  }));
  try {
    const db = await mf.getD1Database('DB');
    await migrate(db);
    await db.prepare("INSERT INTO leaderboard_scores (name,score,created_at) VALUES ('Historic',100,1)").run();
    const post = (path, body) => mf.dispatchFetch('https://test.invalid' + path, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': '192.0.2.1' }, body: JSON.stringify(body)
    });
    const started = await post('/leaderboard/runs', { board: 'classic', species: 'ecoli' });
    assert.equal(started.status, 201);
    const { runId } = await started.json();
    await db.prepare('UPDATE leaderboard_runs SET started_at = started_at - 10000 WHERE id = ?').bind(runId).run();
    const entry = { runId, board: 'classic', species: 'ecoli', name: 'Local test', score: 200 };
    const replies = await Promise.all(['/leaderboard', '/api/leaderboard/'].map(path => post(path, entry)));
    for (const response of replies) assert.equal(response.status, 201, await response.text());
    assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM leaderboard_runs WHERE score IS NOT NULL').first()).n, 1);
    assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM leaderboard_scores').first()).n, 1);
    assert.equal((await post('/leaderboard', { ...entry, score: 201 })).status, 409);
    assert.equal((await post('/leaderboard/runs', { board: 'daily-9999-99-99', species: 'ecoli' })).status, 400);
    let throttled = false;
    for (let i = 0; i < 40; i++) {
      if ((await post('/leaderboard/runs', null)).status === 429) { throttled = true; break; }
    }
    assert(throttled, 'real limiter must reject excess requests');
    for (let i = 0; i < 125; i++) assert.equal((await post('/api/leaderboard/runs/', null)).status, 429);
    const other = await mf.dispatchFetch('https://test.invalid/leaderboard/runs', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': '192.0.2.2' },
      body: JSON.stringify({ species: 'ecoli' })
    });
    assert.equal(other.status, 201, 'a blocked client must not exhaust the shared allowance');
    for (let i = 1; i <= 31; i++) {
      const reply = await mf.dispatchFetch('https://test.invalid/leaderboard/runs', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': `2001:db8:abcd:12::${i.toString(16)}` },
        body: JSON.stringify({ species: 'ecoli' })
      });
      assert.equal(reply.status, i <= 30 ? 201 : 429, 'real rate binding must group IPv6 privacy addresses');
    }
  } finally {
    await mf.dispose();
  }
});

test('Cloudflare runtime: concurrent client allocation, release and private-state expiry', async () => {
  const mf = new Miniflare(convertV4MiniflareOptions({
    modules: true, scriptPath: fileURLToPath(new URL('./worker.js', import.meta.url)),
    compatibilityDate: '2025-01-15', d1Databases: ['DB'], cf: false,
    bindings: { RUN_CLIENT_SECRET: 'local-test-only-reservation-key-32-bytes' },
    // Isolate the durable allocation cap from the separate short-window limit.
    ratelimits: {
      WRITE_LIMITER: { namespace_id: '1846100201', simple: { limit: 120, period: 60 } },
      CLIENT_LIMITER: { namespace_id: '1846100202', simple: { limit: 1000, period: 60 } }
    },
    outboundService: () => new Response('Offline test: external requests disabled', { status: 503 })
  }));
  try {
    const db = await mf.getD1Database('DB');
    await migrate(db);
    await db.prepare("INSERT INTO leaderboard_scores (name,score,created_at) VALUES ('Historic',100,1)").run();
    await migrate(db);
    const post = (path, body, ip = '192.0.2.1') => mf.dispatchFetch('https://test.invalid' + path, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': ip }, body: JSON.stringify(body)
    });
    const replies = await Promise.all(Array.from({ length: 64 }, (_, i) =>
      post(i % 2 ? '/leaderboard/runs' : '/api/leaderboard/runs/', { species: 'ecoli' })));
    const started = replies.filter(reply => reply.status === 201);
    assert.equal(started.length, 32);
    assert.equal(replies.filter(reply => reply.status === 429).length, 32);
    assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM leaderboard_runs').first()).n, 32);
    assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM leaderboard_run_clients').first()).n, 32);
    for (let i = 0; i < 125; i++) assert.equal((await post('/leaderboard/runs', { species: 'ecoli' })).status, 429);
    const { runId } = await started[0].json();
    assert.equal((await post('/leaderboard/runs', { species: 'ecoli' }, '192.0.2.2')).status, 201);
    await db.prepare('UPDATE leaderboard_runs SET started_at = started_at - 10000 WHERE id = ?').bind(runId).run();
    const entry = { runId, species: 'ecoli', board: 'classic', name: 'Local test', score: 200 };
    assert.equal((await post('/leaderboard', entry, '192.0.2.2')).status, 201);
    assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM leaderboard_run_clients WHERE run_id = ?').bind(runId).first()).n, 0);
    assert.equal((await post('/api/leaderboard/runs', { species: 'ecoli' })).status, 201);
    assert.equal((await post('/api/leaderboard', entry)).status, 201);
    assert.equal((await post('/leaderboard/runs', { species: 'ecoli' })).status, 429);
    await db.prepare('UPDATE leaderboard_runs SET expires_at = 1 WHERE score IS NULL').run();
    assert.equal((await post('/leaderboard/runs', { species: 'ecoli' })).status, 201);
    assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM leaderboard_run_clients').first()).n, 1);
    assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM leaderboard_runs WHERE score IS NOT NULL').first()).n, 1);
    assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM leaderboard_scores').first()).n, 1);
  } finally {
    await mf.dispose();
  }
});
