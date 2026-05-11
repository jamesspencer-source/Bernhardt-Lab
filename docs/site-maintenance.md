# Site Maintenance Workflow

`AGENTS.md` at the repo root is the zero-context entrypoint. This file is the deeper operator workflow.

## One rule

Edit canonical sources first, then rebuild.

For normal website work, the default expectation is: verify, commit, and push scoped changes to `main` unless the user opts out or a real blocker prevents a safe push.

Do not hand-edit `github-flat/`.

## Editorial guardrail

For visual or interface changes, treat `docs/editorial-style-guide.md` as the style source of truth before publishing.

Do not hand-repaint isolated modules in late CSS layers unless the exception is intentional and documented. Shared surface identity should live in the shared CSS source layers, with page-level files used mainly for layout and responsive composition.

## Tom feedback compliance

Tom's requested content rules are now enforced as a hard build gate. The normal build and publish commands run:

```bash
python3 scripts/validate_tom_compliance.py
```

This protects the curated homepage publication set, corrected Betsy/Lindsey links, Tom-removed alumni, required featured alumni, gallery removals/caption wording, omitted alumni placeholder text, and species-name formatting. If this gate fails, edit the canonical source in `data/` or the relevant template, then rebuild. Do not patch generated HTML to work around the failure.

## Canonical URL scheme

The public brand URL is `https://bernhardtlab.com`.

Use only these canonical routes for public links, canonical tags, and `sitemap.xml`:

- `/`
- `/team/`
- `/team/{person-slug}/`
- `/alumni/`
- `/alumni/{person-slug}/`
- `/research/`
- `/accessibility/`

Legacy routes are redirect-only compatibility outputs. Keep `/people/`, `/people.html`, root-level profile slugs, `/research-library/`, and `alumni-profiles/*.html` working as redirects, but do not link to them from canonical pages.

## Canonical sources

- People and alumni: `/Users/james/Documents/HMS Lab Ops/01 Bernhardt Lab/13 Lab Website/Bernhardt-Lab/data/people.json`
- Gallery: `/Users/james/Documents/HMS Lab Ops/01 Bernhardt Lab/13 Lab Website/Bernhardt-Lab/data/gallery.json`
- Featured alumni: `/Users/james/Documents/HMS Lab Ops/01 Bernhardt Lab/13 Lab Website/Bernhardt-Lab/data/featured-alumni.json`
- Curated publications fallback: `/Users/james/Documents/HMS Lab Ops/01 Bernhardt Lab/13 Lab Website/Bernhardt-Lab/data/curated-publications.json`
- Scientific media archive highlights: `/Users/james/Documents/HMS Lab Ops/01 Bernhardt Lab/13 Lab Website/Bernhardt-Lab/data/scientific-media.json`
- Shared homepage/site copy: `/Users/james/Documents/HMS Lab Ops/01 Bernhardt Lab/13 Lab Website/Bernhardt-Lab/data/site-copy.json`
- Runtime config such as the public leaderboard URL: `/Users/james/Documents/HMS Lab Ops/01 Bernhardt Lab/13 Lab Website/Bernhardt-Lab/data/runtime-config.json`

## Rebuild command

```bash
python3 scripts/build_site.py
```

This command now runs data validation, generated-page validation, favicon validation, and the Tom feedback compliance gate.

If Envelope Escape V2 source under `game-src/envelope-escape/` changes, run the game checks first:

```bash
npm install
npm run game:check
npm run game:build
python3 scripts/build_site.py
```

## Publish command

```bash
python3 scripts/publish_site.py
```

Use this for the normal website workflow. It will:

- verify you are on `main`
- fetch `origin/main` and stop if the remote is ahead or diverged
- remove transient local artifacts such as `.DS_Store` and Python cache folders
- run `npm run game:build` when the game build exists
- run `python3 scripts/build_site.py`
- stage only approved website paths
- commit only if a real website diff remains
- push to `origin main`

For homepage or visual styling updates, add a small visual QA pass before publish. At minimum, review:

- homepage first screen
- Featured Video / Research block
- Team page
- Alumni page
- one profile page

Confirm the changed surfaces still read as part of one editorial system before publishing.

This regenerates:

- homepage people/alumni slices
- people and alumni directory pages
- all current-member and alumni profile pages
- generated CSS bundle
- generated Envelope Escape V2 runtime bundle
- generated game runtime config
- generated `github-flat/` mirror

## Routine refreshes

These scripts refresh machine-generated feeds and then rebuild automatically:

```bash
python3 scripts/refresh_recent_publications.py
python3 scripts/refresh_youtube_video_stats.py
python3 scripts/refresh_research_in_motion.py
```

The YouTube view-count workflow runs monthly. Manual refreshes are still
available, but routine publishing should not create high-frequency view-count
commits.

## Common edits

### Move a current member to alumni

1. Update that record in `data/people.json`
2. Change `status` from `current` to `alumni`
3. Update `labDates`, `currentRole`, and any profile-specific text
4. Run `python3 scripts/build_site.py`

That single edit will propagate to:

- homepage team slice
- people directory
- alumni directory
- current/alumni profile pages
- generated flat mirror

### Schedule a future departure

Add a transition to `data/scheduled-updates.json` instead of editing
`data/people.json` immediately. Use `America/New_York` calendar dates.
Alumni transitions remove the lab email by default unless `keepEmail: true` is
set.

Preview without writing files:

```bash
python3 scripts/apply_scheduled_updates.py --dry-run
```

Preview a specific date:

```bash
python3 scripts/apply_scheduled_updates.py --today 2026-07-01 --dry-run
```

Manually run the automation from GitHub Actions by opening
`Apply scheduled website updates` and choosing `Run workflow`.

Featured alumni remains manually curated in `data/featured-alumni.json`; moving
someone to alumni does not automatically feature them on the homepage.

### Update homepage copy

Edit `data/site-copy.json`, then run `python3 scripts/publish_site.py`.

### Update gallery or featured alumni

Edit `data/gallery.json` or `data/featured-alumni.json`, then run `python3 scripts/publish_site.py`.

### Update scientific archive media

1. Import stills and poster frames into `assets/images/research/`
2. Import browser-safe local videos into `assets/media/research/`
3. Update `data/scientific-media.json`
4. Run `python3 scripts/publish_site.py`

## Leaderboard health check

Run:

```bash
python3 scripts/check_leaderboard_worker.py
```

This verifies the live Cloudflare Worker still responds correctly for:

- classic board
- current daily board

The scheduled GitHub Actions check validates the response shape needed by the
public site. A legacy worker that does not echo the requested `board` prints a
warning rather than failing, because the game can still use the shared classic
board and save daily challenge runs locally until the worker is redeployed.

To require board-aware worker behavior after a redeploy, run:

```bash
python3 scripts/check_leaderboard_worker.py --require-board-routing
```

If it fails, check:

- `data/runtime-config.json`
- Cloudflare Worker deployment state
- D1 binding / schema drift
- whether the live worker has been redeployed after repo-side leaderboard API changes

## Envelope Escape V2 beta

V1 remains the public footer game until V2 clears art, browser, and leaderboard gates. V2 loads only when the homepage URL includes:

```text
index.html?envelopeV2=1
```

Source and output:

- `game-src/envelope-escape/` is the Phaser + TypeScript source.
- `assets/game/envelope-escape/` contains game art and the generated runtime bundle.
- `docs/envelope-escape-game-upgrade.md` tracks the production migration.
- `docs/envelope-escape-art-direction.md` tracks the asset brief and QA checklist.

Do not edit `assets/game/envelope-escape/runtime/envelope-escape-v2.js` by hand. Rebuild it with `npm run game:build`.

## Generated assets

These are outputs, not canonical source:

- `assets/styles.css`
- `assets/envelope-escape-config.js`
- `assets/game/envelope-escape/runtime/envelope-escape-v2.js`
- `github-flat/`

`github-flat/` now keeps nested `assets/` and `data/` as the authoritative generated mirror. Root-level non-HTML files there are cleaned during the build and should not be restored manually.

Feature JS source now lives in:

- `assets/js/`

CSS source slices now live in:

- `assets/css/`
