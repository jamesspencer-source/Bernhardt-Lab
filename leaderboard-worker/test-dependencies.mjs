import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { once } from 'node:events';
import { mkdtemp, rm } from 'node:fs/promises';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { gzipSync } from 'node:zlib';

const require = createRequire(import.meta.url);
const miniflareRequire = createRequire(require.resolve('miniflare'));
const undiciPath = miniflareRequire.resolve('undici');
const wranglerPath = require.resolve('wrangler');
const uncaughtMarker = 'DEPENDENCY_TEST_UNCAUGHT';
const monitor = `process.on('uncaughtExceptionMonitor', () => console.error('${uncaughtMarker}'));`;

async function fixture(t, mode) {
  const home = await mkdtemp(join(tmpdir(), 'bernhardt-dependency-test-'));
  const requests = [];
  const server = createServer((request, response) => {
    requests.push({ method: request.method, url: request.url });
    if (request.url === '/slow') return;
    if (mode.startsWith('excessive') && request.url !== '/healthy') {
      response.writeHead(200, {
        'Content-Encoding': mode === 'excessive-split'
          ? ['gzip, deflate, br', 'gzip, deflate, br']
          : Array(6).fill('gzip').join(', '),
        'Content-Length': '64'
      });
      response.flushHeaders();
      // Deliver headers, then truncate the body: GHSA-xjj6-f33q-929c.
      const socket = response.socket;
      setTimeout(() => socket.end(), 30);
      return;
    }
    const result = request.url.includes('/memberships') || request.url.includes('/accounts')
      ? [] : { id: 'fixture', status: 'active', email: 'fixture@example.invalid' };
    const body = Buffer.from(JSON.stringify({ success: true, result, result_info: { total_pages: 1 } }));
    response.setHeader('Content-Type', 'application/json');
    if (mode === 'gzip') {
      response.setHeader('Content-Encoding', 'gzip');
      response.end(gzipSync(body));
    } else {
      response.end(body);
    }
  });
  t.after(async () => {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
    await rm(home, { recursive: true, force: true });
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const url = `http://127.0.0.1:${server.address().port}`;
  return {
    url, requests,
    // Do not inherit credentials, proxies, NODE_OPTIONS or the user's Wrangler config.
    options: {
      cwd: home, timeout: 15000, maxBuffer: 1024 * 1024,
      env: {
        PATH: `${dirname(process.execPath)}:/usr/bin:/bin`,
        HOME: home, XDG_CONFIG_HOME: home, CI: 'true', NO_COLOR: '1',
        WRANGLER_SEND_METRICS: 'false', WRANGLER_LOG_PATH: join(home, 'wrangler.log'),
        CLOUDFLARE_API_TOKEN: 'local-test-only-not-a-real-api-token',
        CLOUDFLARE_API_BASE_URL: url
      }
    }
  };
}

function child(args, options) {
  return new Promise(resolve => {
    execFile(process.execPath, args, options, (error, stdout, stderr) => {
      resolve({ code: error?.code ?? 0, killed: error?.killed ?? false, stdout, stderr });
    });
  });
}

for (const mode of ['plain', 'gzip', 'excessive', 'excessive-split']) {
  test(`Miniflare HTTP dependency: ${mode}`, { timeout: 20000 }, async t => {
    const { url, requests, options } = await fixture(t, mode);
    const result = await child(['--input-type=module', '-e', `
      import assert from 'node:assert/strict';
      import { createRequire } from 'node:module';
      import { setTimeout } from 'node:timers/promises';
      const { fetch, getGlobalDispatcher } = createRequire(${JSON.stringify(undiciPath)})(${JSON.stringify(undiciPath)});
      ${monitor}
      try {
        if (${JSON.stringify(mode)}.startsWith('excessive')) {
          await assert.rejects(fetch(${JSON.stringify(url)}), /fetch failed/);
          await setTimeout(100);
        } else {
          assert.equal((await (await fetch(${JSON.stringify(url)})).json()).success, true);
          const controller = new AbortController();
          const pending = fetch(${JSON.stringify(url + '/slow')}, { signal: controller.signal });
          controller.abort();
          await assert.rejects(pending, { name: 'AbortError' });
        }
        assert.equal((await (await fetch(${JSON.stringify(url + '/healthy')})).json()).success, true);
        console.log('RECOVERED');
      } finally {
        await getGlobalDispatcher().close();
      }
    `], options);
    assert.equal(result.killed, false, result.stderr);
    assert.equal(result.code, 0, result.stderr);
    assert.doesNotMatch(result.stderr, new RegExp(uncaughtMarker));
    assert.match(result.stdout, /RECOVERED/);
    assert(requests.some(request => request.url === '/healthy'));
  });

  test(`Wrangler bundled HTTP dependency: ${mode}`, { timeout: 20000 }, async t => {
    const { requests, options } = await fixture(t, mode);
    const result = await child([
      `--import=data:text/javascript,${encodeURIComponent(monitor)}`,
      wranglerPath, 'whoami', '--json'
    ], options);
    assert.equal(result.killed, false, result.stderr);
    assert(requests.length > 0, 'the actual bundled HTTP client must reach the fixture');
    assert(requests.every(request => request.method === 'GET'));
    assert.doesNotMatch(result.stderr, new RegExp(uncaughtMarker));
    if (mode.startsWith('excessive')) {
      assert.equal(result.code, 1, result.stderr);
      assert.match(result.stderr + result.stdout, /fetch failed/i);
    } else {
      assert.equal(result.code, 0, result.stderr);
      const user = JSON.parse(result.stdout);
      assert.equal(user.loggedIn, true);
      assert.equal(user.email, 'fixture@example.invalid');
      assert.deepEqual(user.accounts, []);
    }
  });
}
