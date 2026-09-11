/* Run with Playwright available: node scripts/check_site_browser.cjs [base URL] [evidence directory]. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { chromium } = require('playwright');

const base = process.argv[2] || 'http://127.0.0.1:5180';
const output = process.argv[3];
const channel = process.env.PLAYWRIGHT_CHANNEL;
const root = path.resolve(__dirname, '..');
const people = JSON.parse(fs.readFileSync(path.join(root, 'data/people.json'), 'utf8')).people;
const currentCount = people.filter(person => person.status === 'current').length;
const alumniCount = people.filter(person => person.status === 'alumni').length;
const recentPapers = JSON.parse(fs.readFileSync(path.join(root, 'assets/data/recent-publications.json'), 'utf8')).items;
const profiles = [
  '/team/thomas-bernhardt/', '/team/franziska-maria-lichtenauer/',
  '/team/betsy-hart/', '/team/james-warner/',
  '/team/julia-silberman/',
  '/team/liam-mcdonough/',
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
      const url = new URL(response.url());
      if (url.origin === new URL(base).origin && /\/assets\/js\/[^/]+\.js$/.test(url.pathname)) {
        const relative = 'assets/js/' + path.basename(url.pathname);
        const expected = crypto.createHash('sha256').update(fs.readFileSync(path.join(root, relative))).digest('hex').slice(0, 16);
        if (url.searchParams.get('v') !== expected) errors.push(`Stale shared module: ${url.href}`);
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
    const checkLayout = async (label, scope = 'main') => {
      const overflow = await page.evaluate(scope => [...document.querySelectorAll('main h1, main h2, main h3, main p, main a, main button, main select, .site-header')]
        .filter(el => el.closest(scope) || el.classList.contains('site-header'))
        .filter(el => {
          const rect = el.getBoundingClientRect();
          return rect.width && rect.height && (rect.right > innerWidth + 2 || rect.left < -2 || el.scrollWidth > el.clientWidth + 3);
        }).map(el => ({ text: el.textContent.trim().slice(0, 75), class: el.className })), scope);
      assert.deepEqual(overflow, [], `${label}: overflow`);
    };

    await page.setViewportSize({ width: 1280, height: 900 });
    await visit('/alumni/');
    await page.locator('#alumni-filters button').first().waitFor();
    assert.equal(await page.locator('.alumni-card:visible').count(), alumniCount);
    const graduateCount = await page.locator('.alumni-card[data-bucket="Graduate Alumni"]').count();
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
    assert.equal(await page.locator('.alumni-card:visible').count(), graduateCount);
    for (const sort of ['lastName', 'recent']) {
      await page.locator('#alumni-sort').selectOption(sort);
      assert.equal(await page.locator('.alumni-card:visible').count(), graduateCount);
    }
    await page.locator('#alumni-filters button[data-bucket="All"]').click();
    assert.equal(await page.locator('.alumni-card:visible').count(), alumniCount);
    await screenshot('alumni-desktop');
    results.push('Alumni: actual visibility, empty states, sorts, and retained keyboard focus');

    for (const width of [320, 390, 768, 1024, 1280, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of ['/team/', '/alumni/', ...profiles]) {
        await visit(route);
        if (route.includes('/team/') && route !== '/team/') {
          assert.equal(await page.getByRole('heading', { name: 'Research Interest', exact: true }).count(), 0);
        }
        if (route === '/team/') {
          await page.locator('#role-filters button').first().waitFor({ state: 'attached' });
          assert.equal(await page.locator('.person-card:visible').count(), currentCount);
          await page.locator('#people-search').fill('Franziska');
          assert.equal(await page.locator('.person-card:visible').count(), 1);
          await page.locator('#people-search').fill('');
          await page.locator('#people-search').fill('Liam McDonough');
          assert.equal(await page.locator('.person-card:visible').count(), 1);
          assert.equal(await page.locator('.person-card:visible').getAttribute('data-group'), 'Postdoctoral Fellows');
          await page.locator('.person-card:visible .person-photo').scrollIntoViewIfNeeded();
          await page.waitForFunction(() => {
            const photo = document.querySelector('.person-card[data-name="Liam McDonough"] .person-photo');
            return photo.complete && photo.naturalWidth > 0;
          });
          if (output && [390, 1280].includes(width)) {
            fs.mkdirSync(output, { recursive: true });
            await page.locator('.person-card:visible').screenshot({ path: path.join(output, `liam-card-${width}.png`) });
          }
          await page.locator('#people-search').fill('');
          for (const query of ['Julia Silberman', 'BBS Graduate Student']) {
            await page.locator('#people-search').fill(query);
            assert.equal(await page.locator('.person-card:visible[data-name="Julia Silberman"]').count(), 1);
          }
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
          assert.equal(await page.locator('.alumni-card:visible').count(), graduateCount);
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

    for (const width of [320, 390, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      await visit('/');
      assert.equal(await page.locator('#home-team-preview .person-card').count(), 8);
      assert.equal(await page.locator('.team-preview-count').count(), 0);
      const teamLinks = page.locator('.team-preview-heading a, .team-preview-footer a');
      assert.equal(await teamLinks.count(), 2);
      assert.deepEqual(await teamLinks.allTextContents(), Array(2).fill(`\nView all ${currentCount} lab members\n`));
      assert.deepEqual(await teamLinks.evaluateAll(links => links.map(link => new URL(link.href).pathname)), ['/team/', '/team/']);
      const teamAlignment = await page.evaluate(() => {
        const last = document.querySelector('#home-team-preview .person-card:last-child').getBoundingClientRect();
        const button = document.querySelector('.team-preview-footer a').getBoundingClientRect();
        return { left: Math.abs(last.left - button.left), width: Math.abs(last.width - button.width), gap: button.top - last.bottom };
      });
      assert.ok(teamAlignment.left < 1 && teamAlignment.width < 1 && teamAlignment.gap >= 20, JSON.stringify({ width, ...teamAlignment }));
      const general = new URL(await page.locator('[data-contact-route="general"]').getAttribute('href'));
      assert.equal(general.searchParams.get('cc'), 'james_spencer@hms.harvard.edu');
      assert.equal(general.searchParams.get('subject'), '[Bernhardt Lab website] General inquiry');
      const training = new URL(await page.locator('[data-contact-route="training"]').getAttribute('href'));
      assert.equal(training.searchParams.has('cc'), false);
      assert.match(training.searchParams.get('body'), /Proposed start date and availability/);
      assert.deepEqual(await page.locator('.publication-archive-title').evaluateAll(links => links.map(link => ({ title: link.textContent.trim().replace(/\s+/g, ' '), url: link.href }))), recentPapers.map(item => ({ title: item.title, url: item.articleUrl })));
      assert.deepEqual(await page.locator('#recent-publications time').evaluateAll(dates => dates.map(date => date.dateTime)), recentPapers.map(item => item.publishedAt));
      await page.locator('#publications').scrollIntoViewIfNeeded();
      await checkLayout(`Recent publications ${width}px`, '#publications');
      if (output) {
        fs.mkdirSync(output, { recursive: true });
        await page.locator('#publications').screenshot({
          path: path.join(output, `publications-${width}.png`),
          style: '.site-header, .site-header * { visibility: hidden !important; }',
        });
      }
      if (width === 320) continue;
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

    for (const width of [1672, 1920, 2200, 2560]) {
      await page.setViewportSize({ width, height: 941 });
      await visit('/');
      await checkLayout(`Fluid homepage ${width}px`);
      const layout = await page.evaluate(() => {
        const grid = document.querySelector('#home-team-preview');
        const last = grid.lastElementChild.getBoundingClientRect();
        const button = document.querySelector('.team-preview-footer a').getBoundingClientRect();
        return {
          contentRatio: grid.getBoundingClientRect().width / innerWidth,
          columns: getComputedStyle(grid).gridTemplateColumns.split(' ').length,
          aligned: Math.abs(last.left - button.left) < 1 && Math.abs(last.width - button.width) < 1,
          controls: [...document.querySelectorAll('.hero-control')].map(control => {
            const r = control.getBoundingClientRect();
            return r.width >= 44 && r.height >= 44;
          }),
        };
      });
      assert.ok(layout.contentRatio >= 0.9 && layout.contentRatio <= 0.95);
      assert.equal(layout.columns, width >= 2200 ? 8 : 4);
      assert.ok(layout.aligned && layout.controls.every(Boolean));
    }
    await page.locator('.team-preview-footer a').click();
    await page.waitForURL(base + '/team/');
    assert.equal(await page.locator('#people-grid .person-card').count(), currentCount);
    results.push('Fluid homepage: proportional gutters, responsive team columns, aligned directory button and touch targets');

    const motionContext = await browser.newContext({ reducedMotion: 'no-preference', viewport: { width: 1672, height: 941 } });
    try {
      const motionPage = await motionContext.newPage();
      motionPage.on('pageerror', error => errors.push(error.message));
      await motionPage.goto(base + '/', { waitUntil: 'domcontentloaded' });
      await motionPage.waitForFunction(() => document.querySelector('.hero-slide.is-active')?.dataset.image);
      await motionPage.locator('#hero-toggle').click();
      assert.equal(await motionPage.locator('#hero-toggle').getAttribute('aria-pressed'), 'true');
      assert.equal(await motionPage.locator('#hero-toggle').getAttribute('aria-label'), 'Resume background image rotation');
      const initialImage = await motionPage.locator('.hero-slide.is-active').getAttribute('data-image');
      await motionPage.locator('#hero-next').click();
      assert.notEqual(await motionPage.locator('.hero-slide.is-active').getAttribute('data-image'), initialImage);
      await motionPage.locator('#hero-prev').click();
      assert.equal(await motionPage.locator('.hero-slide.is-active').getAttribute('data-image'), initialImage);
    } finally {
      await motionContext.close();
    }
    results.push('Hero: normal-motion pause, accessible labels, next/previous images');

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

    await visit('/team/liam-mcdonough/');
    assert.equal(await page.getByRole('link', { name: 'Contact Liam', exact: true }).getAttribute('href'), 'mailto:liam_mcdonough@hms.harvard.edu');
    assert.match(await page.locator('main').innerText(), /Postdoctoral Research Fellow/);
    assert.match(await page.locator('main').innerText(), /Sep 2026/);
    assert.deepEqual(await page.locator('.profile-education li').allTextContents(), people.find(person => person.slug === 'liam-mcdonough').education);
    await visit('/team/julia-silberman/');
    assert.equal(await page.getByRole('link', { name: 'Contact Julia', exact: true }).getAttribute('href'), 'mailto:juliasilberman@g.harvard.edu');
    assert.match(await page.locator('main').innerText(), /BBS Graduate Student/);
    assert.match(await page.locator('main').innerText(), /Jul 2026/);
    await visit('/team/thomas-bernhardt/');
    assert.equal(await page.getByRole('link', { name: 'Contact Thomas', exact: true }).getAttribute('href'), 'mailto:thomas_bernhardt@hms.harvard.edu');
    for (const route of ['/github-flat/team.html', '/github-flat/alumni.html']) {
      await visit(route);
      if (route.includes('team.html')) {
        await page.locator('#role-filters button').first().waitFor({ state: 'attached' });
        await page.locator('#people-search').fill('Julia');
        assert.equal(await page.locator('.person-card:visible').count(), 1);
        await page.getByRole('link', { name: /View full profile/ }).filter({ visible: true }).click();
        assert.match(page.url(), /team-julia-silberman\.html$/);
      } else {
        await page.locator('#alumni-filters button').first().waitFor({ state: 'attached' });
        await page.locator('#alumni-search').fill('Mary');
        assert.equal(await page.locator('.alumni-card:visible').count(), 1);
      }
    }
    results.push('Contact routing, Julia profile, recent publication dates/links, generated module URLs, and flat-directory controls');

    for (const javaScriptEnabled of [false, true]) {
      const fallback = await browser.newContext({ javaScriptEnabled, reducedMotion: 'no-preference', viewport: { width: 390, height: 900 } });
      const fallbackPage = await fallback.newPage();
      fallbackPage.on('pageerror', error => errors.push(error.message));
      await fallbackPage.goto(base + '/', { waitUntil: 'domcontentloaded' });
      assert.equal(await fallbackPage.locator('.publication-archive-item').count(), 6);
      await fallbackPage.goto(base + '/research/', { waitUntil: 'domcontentloaded' });
      assert.match(await fallbackPage.locator('#microscopy-animation').getAttribute('src'), /poster\.png$/);
      await fallback.close();
    }
    results.push('Publications remain available without JavaScript; animation starts still under normal motion too');
    assert.deepEqual(errors, [], 'Relevant page errors or missing local assets');
    if (output) fs.writeFileSync(path.join(output, 'browser-checks.json'), JSON.stringify({ results, errors }, null, 2));
    console.log(results.join('\n'));
  } finally {
    await browser.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
