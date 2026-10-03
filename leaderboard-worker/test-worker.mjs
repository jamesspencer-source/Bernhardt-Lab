import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { test } from 'node:test';
import worker from './worker.js';

const now = Date.now();
function environment(legacy = false) {
  const sqlite = new DatabaseSync(':memory:');
  sqlite.exec(readFileSync(new URL('./schema.sql', import.meta.url), 'utf8'));
  if (!legacy) sqlite.exec(readFileSync(new URL('./security-schema.sql', import.meta.url), 'utf8'));
  const DB = {
    prepare(sql) {
      let values = [];
      return {
        bind(...args) { values = args; return this; },
        async all() { return { results: sqlite.prepare(sql).all(...values) }; },
        async first() { return sqlite.prepare(sql).get(...values) || null; },
        runSync() { const r = sqlite.prepare(sql).run(...values); return { meta: { changes: r.changes, last_row_id: r.lastInsertRowid } }; },
        async run() { return this.runSync(); }
      };
    },
    async batch(statements) {
      sqlite.exec('BEGIN');
      try { const result = statements.map(statement => statement.runSync()); sqlite.exec('COMMIT'); return result; }
      catch (error) { sqlite.exec('ROLLBACK'); throw error; }
    }
  };
  return { DB, sqlite, WRITE_LIMITER: { async limit() { return { success: true }; } },
    CLIENT_LIMITER: { async limit() { return { success: true }; } } };
}
async function call(env, path = '/leaderboard', body, headers = {}) {
  const response = await worker.fetch(new Request('https://game.test' + path, body === undefined ? {} : {
    method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body)
  }), env);
  return { status: response.status, body: await response.json() };
}
async function ticket(env, board = 'classic') {
  const result = await call(env, '/leaderboard/runs', { board, species: 'ecoli' });
  assert.equal(result.status, 201, JSON.stringify(result.body));
  env.sqlite.prepare('UPDATE leaderboard_runs SET started_at = started_at - 10000 WHERE id = ?').run(result.body.runId);
  return { board, species: 'ecoli', name: 'Test player', score: 200, runId: result.body.runId };
}

test('normal classic run, server time, sequential and concurrent idempotency', async () => {
  const env = environment();
  const entry = await ticket(env);
  const first = await call(env, '/leaderboard', entry);
  assert.equal(first.status, 201);
  assert(first.body.entry.playedAt >= now);
  const repeats = await Promise.all(['/leaderboard/', '/api/leaderboard/'].map(path => call(env, path, entry)));
  for (const reply of repeats) {
    assert.equal(reply.status, 201);
    assert.equal(reply.body.entry.playedAt, first.body.entry.playedAt);
  }
  assert.equal(env.sqlite.prepare('SELECT COUNT(*) AS n FROM leaderboard_runs WHERE score IS NOT NULL').get().n, 1);
  assert.equal((await call(env, '/leaderboard', { ...entry, score: 201 })).status, 409);
  assert.equal((await call(env)).body.ranking, 'casual-unverified');
});

test('invalid boards, payload types and client time never write', async () => {
  const env = environment();
  for (const board of ['daily-9999-99-99', 'daily-2026-02-29', 'daily-2999-01-01', 'daily-2000-01-01', '', 'CLASSIC', {}, null]) {
    assert.equal((await call(env, '/api/leaderboard/runs/', { board, species: 'ecoli' })).status, 400);
  }
  for (const body of [null, [], 5, 'classic', { board: 'classic', species: {} }]) {
    assert.equal((await call(env, '/leaderboard/runs', body)).status, 400);
  }
  assert.equal(env.sqlite.prepare('SELECT COUNT(*) AS n FROM leaderboard_runs').get().n, 0);
  const entry = await ticket(env);
  for (const score of [1.5, '200', true, -1, 2000000001, 1000000]) {
    assert([400, 422].includes((await call(env, '/leaderboard', { ...entry, score })).status));
  }
  assert.equal((await call(env, '/leaderboard', { ...entry, playedAt: 946684800000 })).status, 400);
  assert.equal((await call(env, '/leaderboard', { ...entry, runId: undefined })).status, 409);
  assert.equal((await call(env, '/leaderboard', { ...entry, species: 'saureus' })).status, 409);
  assert.equal((await call(env, '/leaderboard', { ...entry, name: { toString: 1 } })).status, 400);
});

test('daily dates use New York and issued runs survive midnight, not expiry', async () => {
  const original = Date.now;
  let clock = Date.parse('2026-11-01T03:59:50Z');
  Date.now = () => clock;
  try {
    const env = environment();
    assert.equal((await call(env, '/leaderboard/runs', { board: 'daily-2026-11-01', species: 'ecoli' })).status, 400);
    const entry = await ticket(env, 'daily-2026-10-31');
    clock += 30000;
    assert.equal((await call(env, '/leaderboard', entry)).status, 201);
    clock += 3 * 3600000;
    assert.equal((await call(env, '/leaderboard', entry)).status, 409);
    assert.equal((await call(env, '/leaderboard/runs', { board: 'daily-2026-11-01', species: 'ecoli' })).status, 201);
  } finally { Date.now = original; }
});

test('limiter rejects before database work and fails closed if missing', async () => {
  const env = environment();
  env.DB.prepare = () => { throw new Error('must not reach database'); };
  env.WRITE_LIMITER.limit = async () => ({ success: false });
  assert.equal((await call(env, '/leaderboard/runs', { species: 'ecoli' })).status, 429);
  delete env.WRITE_LIMITER;
  assert.equal((await call(env, '/leaderboard/runs', { species: 'ecoli' })).status, 503);
});

test('strict small JSON bodies include actual streamed-byte bounds', async () => {
  const env = environment();
  assert.equal((await call(env, '/leaderboard/runs', { species: 'ecoli' }, { 'Content-Type': 'text/plain' })).status, 415);
  assert.equal((await call(env, '/leaderboard/runs', { species: 'x'.repeat(2000) })).status, 413);
  const request = new Request('https://game.test/leaderboard/runs', { method: 'POST', headers: { 'Content-Type': 'application/json' },
    duplex: 'half', body: new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(1025)); controller.close(); } }) });
  assert.equal((await worker.fetch(request, env)).status, 413);
  assert.equal(env.sqlite.prepare('SELECT COUNT(*) AS n FROM leaderboard_runs').get().n, 0);
});

test('legacy schemas stay readable and cannot accept unsafe writes', async () => {
  for (let mask = 0; mask < 8; mask++) {
    const env = environment(true);
    env.sqlite.exec('DROP TABLE leaderboard_scores; CREATE TABLE leaderboard_scores(id INTEGER PRIMARY KEY, name TEXT, score INTEGER, created_at INTEGER)');
    for (const [bit, column] of [[1, 'species TEXT'], [2, 'played_at INTEGER'], [4, "board TEXT DEFAULT 'classic'"]]) {
      if (mask & bit) env.sqlite.exec('ALTER TABLE leaderboard_scores ADD COLUMN ' + column);
    }
    env.sqlite.exec("INSERT INTO leaderboard_scores (name,score,created_at) VALUES ('Existing',123,1700000000000)");
    assert.equal((await call(env)).body.entries[0].name, 'Existing');
    assert.equal((await call(env, '/leaderboard/runs', { species: 'ecoli' })).status, 503);
    assert.equal(env.sqlite.prepare('SELECT COUNT(*) AS n FROM leaderboard_scores').get().n, 1);
  }
});

test('retention is deterministic, aggregate-bounded, and never deletes historical scores', async () => {
  const env = environment();
  env.sqlite.exec("INSERT INTO leaderboard_scores (name,score,created_at) VALUES ('Historic',1,1)");
  const insert = env.sqlite.prepare('INSERT INTO leaderboard_runs VALUES (?,?,?,?,?,?,?,?)');
  env.sqlite.exec('BEGIN');
  for (let i = 0; i < 6000; i++) insert.run(crypto.randomUUID(), 'daily-' + i, 'ecoli', now - 10000, now + 10000, now, 'Test', i + 1);
  for (let i = 0; i < 505; i++) insert.run(crypto.randomUUID(), 'classic', 'ecoli', now - 10000, now + 10000, now, 'Test', i + 1);
  insert.run('old', 'classic', 'ecoli', 1, 2, 3, 'Old', 100);
  insert.run('expired', 'classic', 'ecoli', 1, 2, null, null, null);
  env.sqlite.exec('COMMIT');
  await worker.scheduled({}, env);
  assert(env.sqlite.prepare('SELECT COUNT(*) AS n FROM leaderboard_runs').get().n <= 5000);
  assert(env.sqlite.prepare("SELECT COUNT(*) AS n FROM leaderboard_runs WHERE board = 'classic'").get().n <= 500);
  assert.equal(env.sqlite.prepare("SELECT COUNT(*) AS n FROM leaderboard_runs WHERE id IN ('old','expired')").get().n, 0);
  assert.equal(env.sqlite.prepare('SELECT COUNT(*) AS n FROM leaderboard_scores').get().n, 1);
});

test('abandoned run budget is enforced atomically', async () => {
  const env = environment();
  const insert = env.sqlite.prepare('INSERT INTO leaderboard_runs (id,board,species,started_at,expires_at) VALUES (?,?,?,?,?)');
  for (let i = 0; i < 1000; i++) insert.run(crypto.randomUUID(), 'classic', 'ecoli', now, now + 3600000);
  assert.equal((await call(env, '/leaderboard/runs', { species: 'ecoli' })).status, 503);
  assert.equal(env.sqlite.prepare('SELECT COUNT(*) AS n FROM leaderboard_runs').get().n, 1000);
});
