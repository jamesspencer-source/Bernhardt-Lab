const assert = require('node:assert/strict');
const crypto = require('node:crypto');

module.exports = async function checkLeaderboardBrowser(browser, base, endpoint) {
  const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1280, height: 900 } });
  const starts = [];
  const completions = [];
  const remoteEntries = [];
  const errors = [];
  let holdCompletion = false;
  let failCompletion = false;
  let releaseCompletion;
  let rejectStart = false;
  const epoch = Date.parse('2026-10-02T12:00:00Z');
  const serverTime = epoch + 600_000;
  try {
    // All leaderboard traffic is simulated; even a failed test cannot publish a score.
    await context.route('**/*', async route => {
      const request = route.request();
      const url = new URL(request.url());
      if (url.origin === new URL(base).origin) return route.continue();
      if (!request.url().startsWith(endpoint)) return route.abort();
      const reply = body => route.fulfill({ contentType: 'application/json', body: JSON.stringify(body) });
      if (request.method() === 'GET') return reply({ board: url.searchParams.get('board'), entries: remoteEntries, submissionProtocol: 2 });
      const body = request.postDataJSON();
      if (url.pathname.endsWith('/runs')) {
        starts.push(body);
        if (rejectStart) return route.fulfill({ status: 503, body: '{}' });
        return reply({ ...body, runId: crypto.randomUUID(), expiresAt: epoch + 7_200_000, submissionProtocol: 2 });
      }
      completions.push(body);
      const fails = failCompletion;
      const entry = { ...body, playedAt: serverTime };
      if (!fails) remoteEntries.push(entry);
      if (holdCompletion) await new Promise(resolve => { releaseCompletion = resolve; });
      if (fails) return route.fulfill({ status: 503, body: '{}' });
      return reply({ board: body.board, entry, entries: remoteEntries, rank: 1, totalEntries: remoteEntries.length });
    });
    await context.addInitScript(origin => {
      if (location.origin === origin) localStorage.setItem('bernhardt-envelope-escape-sound-v2', 'off');
    }, new URL(base).origin);
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.clock.install({ time: epoch });
    await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
    await page.locator('#envelope-trigger').click();
    await page.locator('#envelope-player-name').fill('Ada');
    await page.clock.pauseAt(epoch + 60_000);
    async function startRun(selector = '#envelope-start') {
      const response = page.waitForResponse(response => response.url().endsWith('/runs'));
      await page.locator(selector).click();
      await response;
    }
    await startRun();
    assert.deepEqual(Object.keys(starts[0]).sort(), ['board', 'species']);
    assert.equal(starts[0].board, 'classic');
    await page.locator('#envelope-pause').click();
    assert.equal(await page.locator('#envelope-model-select').isEnabled(), false);
    await page.locator('#envelope-model-select').evaluate(select => {
      select.value = 'saureus';
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });
    assert.equal(await page.locator('#envelope-model-select').inputValue(), starts[0].species);
    await page.locator('#envelope-start').click();
    assert.equal(starts.length, 1, 'Resume must reuse the current ticket');

    async function finishRun(count) {
      for (let step = 0; step < 360 && completions.length < count; step++) {
        await page.clock.runFor(1000);
      }
      assert.equal(completions.length, count, 'A normal stationary run should finish and submit once');
    }
    await finishRun(1);
    await page.locator('#envelope-rank-summary').filter({ hasText: /Classic board saved at 1st/ }).waitFor();
    assert.equal(completions[0].name, 'Ada');
    assert.equal('playedAt' in completions[0], false, 'Never send a client-selected timestamp');
    assert.match(completions[0].runId, /^[0-9a-f-]{36}$/);
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('bernhardt-envelope-escape-board-v2-classic')));
    assert.equal(saved[0].playedAt, serverTime, 'Use the server timestamp for the saved result');
    assert.match(await page.locator('#envelope-leaderboard-meta').innerText(), /unverified/i);

    holdCompletion = true;
    failCompletion = true;
    assert.equal(await page.locator('#envelope-model-select').isEnabled(), true);
    await page.locator('#envelope-model-select').selectOption('saureus');
    await startRun();
    assert.equal(starts[1].species, 'saureus');
    await finishRun(2);
    assert.notEqual(completions[0].runId, completions[1].runId);
    const staleResponse = page.waitForResponse(response => response.url() === endpoint && response.request().method() === 'POST');
    await startRun();
    releaseCompletion();
    await staleResponse;
    await page.clock.runFor(100);
    assert.doesNotMatch(await page.locator('#envelope-rank-summary').innerText(), /saved at 1st/);
    const fallback = await page.evaluate(() => JSON.parse(localStorage.getItem('bernhardt-envelope-escape-board-v2-classic')));
    assert.ok(fallback.some(entry => entry.name === 'Ada' && entry.score === completions[1].score), 'A late failed save must survive restart in the local board');
    assert.equal(starts.length, 3, 'Restart must get a new ticket');
    await page.locator('#envelope-close').click();
    await page.locator('#envelope-trigger').click();
    await page.locator('#envelope-start').click();
    assert.equal(starts.length, 3, 'Closing and resuming must not create a ticket');

    failCompletion = false;
    await finishRun(3);
    const lateSuccess = page.waitForResponse(response => response.url() === endpoint && response.request().method() === 'POST');
    await startRun();
    releaseCompletion();
    await lateSuccess;
    await page.clock.runFor(100);
    const afterSuccess = await page.evaluate(() => JSON.parse(localStorage.getItem('bernhardt-envelope-escape-board-v2-classic')));
    assert.equal(afterSuccess.filter(entry => entry.name === 'Ada' && entry.score === completions[2].score && entry.playedAt === serverTime).length, 1, 'A late success must not duplicate an entry already refreshed from the server');
    assert.doesNotMatch(await page.locator('#envelope-rank-summary').innerText(), /saved at 1st/);

    rejectStart = true;
    holdCompletion = false;
    await startRun('#envelope-restart');
    await page.clock.runFor(1000);
    assert.equal(await page.locator('#envelope-overlay').isVisible(), false, 'Ticket failure must not block gameplay');
    assert.equal(completions.length, 3);
    assert.deepEqual(errors, []);
  } finally {
    if (releaseCompletion) releaseCompletion();
    await context.close();
  }
};
