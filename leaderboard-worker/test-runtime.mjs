import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';

test('Cloudflare runtime: D1 atomic replay, real rate bindings and additive schema', async () => {
  const mf = new Miniflare(convertV4MiniflareOptions({
    modules: true, scriptPath: fileURLToPath(new URL('./worker.js', import.meta.url)),
    compatibilityDate: '2025-01-15', d1Databases: ['DB'],
    ratelimits: {
      WRITE_LIMITER: { namespace_id: '1846100201', simple: { limit: 120, period: 60 } },
      CLIENT_LIMITER: { namespace_id: '1846100202', simple: { limit: 30, period: 60 } }
    },
    outboundService: () => new Response('Offline test: external requests disabled', { status: 503 })
  }));
  try {
    const db = await mf.getD1Database('DB');
    for (const file of ['schema.sql', 'security-schema.sql']) {
      const sql = readFileSync(new URL(file, import.meta.url), 'utf8').replace(/^--.*$/gm, '');
      for (const statement of sql.split(';').filter(item => item.trim())) await db.prepare(statement).run();
    }
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
  } finally {
    await mf.dispose();
  }
});
