/* Run with Playwright available: node scripts/check_site_browser.cjs [base URL] [evidence directory]. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const base = process.argv[2] || 'http://127.0.0.1:5180';
const output = process.argv[3];
const channel = process.env.PLAYWRIGHT_CHANNEL;
const profiles = [
  '/team/thomas-bernhardt/', '/team/franziska-maria-lichtenauer/',
  '/team/betsy-hart/', '/team/james-warner/',
  '/alumni/monica-markovski/', '/alumni/alison-forchoh/',
];

async function main() {
  const browser = await chromium.launch({ headless: true, ...(channel ? { channel } : {}) });
  const errors = [];
  const results = [];
  try {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => {
      if (response.url().startsWith(base) && response.status() >= 400) {
        errors.push(`${response.status()} ${response.url()}`);
      }
    });
    // Tests must never submit a leaderboard score or other remote mutation.
    await context.route('**/*', route => {
      if (!['GET', 'HEAD'].includes(route.request().method())) return route.abort();
      return route.continue();
    });
    const visit = async route => {
      const response = await page.goto(base + route, { waitUntil: 'domcontentloaded' });
      assert.equal(response.status(), 200, route);
      await page.evaluate(() => document.fonts.ready);
    };
    const screenshot = async name => {
      if (!output) return;
      fs.mkdirSync(output, { recursive: true });
      await page.screenshot({ path: path.join(output, name + '.png'), fullPage: true });
    };
    const checkLayout = async label => {
      const overflow = await page.evaluate(() => [...document.querySelectorAll('main h1, main h2, main h3, main p, main a, main button, main select, .site-header')]
        .filter(el => {
          const rect = el.getBoundingClientRect();
          return rect.width && rect.height && (rect.right > innerWidth + 2 || rect.left < -2 || el.scrollWidth > el.clientWidth + 3);
        }).map(el => ({ text: el.textContent.trim().slice(0, 75), class: el.className })));
      assert.deepEqual(overflow, [], `${label}: overflow`);
    };

    await page.setViewportSize({ width: 1280, height: 900 });
    await visit('/alumni/');
    await page.locator('#alumni-filters button').first().waitFor();
    assert.equal(await page.locator('.alumni-card:visible').count(), 60);
    await page.locator('#alumni-search').fill('Mary');
    assert.equal(await page.locator('.alumni-card:visible').count(), 1);
    assert.match(await page.locator('.alumni-card:visible').innerText(), /Mary-Jane Tsang/);
    assert.equal(await page.locator('.alumni-card[hidden] a:visible').count(), 0);
    await screenshot('alumni-search-desktop');
    for (const query of ['NoSuchPersonExample', 'NoSuchPersonExample2']) {
      await page.locator('#alumni-search').fill(query);
      assert.equal(await page.locator('.alumni-card:visible').count(), 0);
      assert.equal(await page.locator('.alumni-empty:visible').count(), 1);
    }
    await page.locator('#alumni-search').fill('');
    const graduate = page.locator('#alumni-filters button[data-bucket="Graduate Alumni"]');
    await graduate.focus();
    await page.keyboard.press('Enter');
    assert.equal(await graduate.evaluate(el => el === document.activeElement), true);
    assert.equal(await graduate.getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('.alumni-card:visible').count(), 15);
    for (const sort of ['lastName', 'recent']) {
      await page.locator('#alumni-sort').selectOption(sort);
      assert.equal(await page.locator('.alumni-card:visible').count(), 15);
    }
    await page.locator('#alumni-filters button[data-bucket="All"]').click();
    assert.equal(await page.locator('.alumni-card:visible').count(), 60);
    await screenshot('alumni-desktop');
    results.push('Alumni: actual visibility, empty states, sorts, and retained keyboard focus');

    for (const width of [320, 390, 768, 1280, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of ['/team/', '/alumni/', ...profiles]) {
        await visit(route);
        if (route.includes('/team/') && route !== '/team/') {
          assert.equal(await page.getByRole('heading', { name: 'Research Interest', exact: true }).count(), 0);
        }
        if (route === '/team/') {
          await page.locator('#role-filters button').first().waitFor({ state: 'attached' });
          assert.equal(await page.locator('.person-card:visible').count(), 20);
          await page.locator('#people-search').fill('Franziska');
          assert.equal(await page.locator('.person-card:visible').count(), 1);
          await page.locator('#people-search').fill('');
          if (width <= 760) {
            await page.locator('#team-role-filter').selectOption('Graduate Students');
            assert.ok(await page.locator('.person-card:visible').count() > 0);
            assert.equal(await page.locator('.person-card:visible:not([data-group="Graduate Students"])').count(), 0);
            await page.locator('#team-role-filter').selectOption('All');
          }
        }
        if (route === '/alumni/' && width <= 760) {
          await page.locator('#alumni-role-filter option[value="Graduate Alumni"]').waitFor({ state: 'attached' });
          await page.locator('#alumni-role-filter').selectOption('Graduate Alumni');
          assert.equal(await page.locator('.alumni-card:visible').count(), 15);
          await page.locator('#alumni-role-filter').selectOption('All');
        }
        if (await page.locator('.profile-photo').count()) {
          await page.locator('.profile-photo').scrollIntoViewIfNeeded();
          await page.waitForFunction(() => { const image = document.querySelector('.profile-photo'); return image.complete && image.naturalWidth > 0; });
          const aspect = await page.locator('.profile-photo').evaluate(el => ({ drawn: el.clientWidth / el.clientHeight, natural: el.naturalWidth / el.naturalHeight }));
          assert.ok(Math.abs(aspect.drawn / aspect.natural - 1) < 0.025, `Natural photo aspect: ${route} ${width}`);
        }
        if (width === 390) {
          await page.getByRole('button', { name: 'Menu', exact: true }).click();
          assert.equal(await page.locator('#site-nav').isVisible(), true);
          await page.keyboard.press('Escape');
          assert.equal(await page.locator('#site-nav').isVisible(), false);
        }
        await checkLayout(`${route} ${width}px`);
        if ([390, 1280].includes(width) && route !== '/team/') await screenshot(`${route.replaceAll('/', '_')}-${width}`);
      }
      results.push(`Directory/profile layout, images, and controls: ${width}px`);
    }

    for (const width of [390, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      await visit('/');
      assert.equal(await page.locator('#home-team-preview .person-card').count(), 8);
      const before = await page.locator('#gallery-grid').evaluate(el => el.getBoundingClientRect().height);
      await page.locator('#gallery-grid').scrollIntoViewIfNeeded();
      await page.locator('#gallery-active-image').waitFor();
      const after = await page.locator('#gallery-grid').evaluate(el => el.getBoundingClientRect().height);
      assert.ok(Math.abs(before - after) < 12, `Gallery reserved height ${width}: ${before} -> ${after}`);
      await page.locator('#gallery-active-image').focus();
      await page.keyboard.press('Enter');
      assert.equal(await page.locator('#lightbox').isVisible(), true);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#gallery-active-image').evaluate(el => el === document.activeElement), true);
      await screenshot(`gallery-${width}`);
      await page.locator('#alumni-stage .alumni-item').waitFor();
      await page.locator('#alumni-next').click();
      assert.match(await page.locator('#alumni-stage').innerText(), /View institutional directory/);
      await checkLayout(`Homepage ${width}px`);
      await page.locator('#envelope-trigger').click();
      await page.locator('#envelope-modal').waitFor({ state: 'visible' });
      assert.equal(await page.locator('#envelope-modal').isVisible(), true);
      await page.locator('#envelope-close').click();
      assert.equal(await page.locator('#envelope-modal').isVisible(), false);
    }
    results.push('Homepage: eight-person preview, source labels, reserved gallery, keyboard lightbox, V1 modal');

    await visit('/research/');
    const toggle = page.locator('#microscopy-toggle');
    await toggle.waitFor();
    assert.match(await page.locator('#microscopy-animation').getAttribute('src'), /poster\.png$/);
    await toggle.click();
    assert.match(await page.locator('#microscopy-animation').getAttribute('src'), /\.gif$/);
    await toggle.click();
    assert.match(await page.locator('#microscopy-animation').getAttribute('src'), /poster\.png$/);
    await checkLayout('Research library');
    results.push('Animation: initially still with reduced motion; explicit play and pause work');
    assert.deepEqual(errors, [], 'Relevant page errors or missing local assets');
    if (output) fs.writeFileSync(path.join(output, 'browser-checks.json'), JSON.stringify({ results, errors }, null, 2));
    console.log(results.join('\n'));
  } finally {
    await browser.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
