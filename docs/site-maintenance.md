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

- People and alumni: `/Users/james/Documents/GitHub/Bernhardt-Lab/data/people.json`
- Gallery: `/Users/james/Documents/GitHub/Bernhardt-Lab/data/gallery.json`
- Featured alumni: `/Users/james/Documents/GitHub/Bernhardt-Lab/data/featured-alumni.json`
- Curated publications fallback: `/Users/james/Documents/GitHub/Bernhardt-Lab/data/curated-publications.json`
- Scientific media archive highlights: `/Users/james/Documents/GitHub/Bernhardt-Lab/data/scientific-media.json`
- Shared homepage/site copy: `/Users/james/Documents/GitHub/Bernhardt-Lab/data/site-copy.json`
- Runtime config such as the public leaderboard URL: `/Users/james/Documents/GitHub/Bernhardt-Lab/data/runtime-config.json`

## Rebuild command

```bash
python3 scripts/build_site.py
```

This command now runs data validation, generated-page validation, favicon validation, local page-link and fragment checks, image-alt checks, a 1 MB limit for referenced public images, and the Tom feedback compliance gate.

## Publish command

```bash
python3 scripts/publish_site.py --dry-run --include data/people.json
python3 scripts/publish_site.py --include data/people.json --message "site: update people"
```

Use this for the normal website workflow. It will:

- verify you are on `main`
- fetch `origin/main` and stop unless local `main` matches it exactly
- build only the selected source changes over a clean temporary snapshot
- refuse unrelated working changes or generated edits that do not match that build
- stage only the exact source and generated files shown in the output plan
- commit only if a real website diff remains
- push to `origin main`

Use `--include` with exact repository-relative source file paths, never directory names. For larger releases, use `--manifest /path/to/reviewed-source-files.json`, containing a JSON array of those paths. Do not include `github-flat/` or generated CSS: the isolated build determines those outputs. A dry run leaves the checkout and index untouched. The publisher does not clean or delete numbered duplicates; use a clean review checkout if unrelated work is present. After publishing, verify GitHub Pages and the changed live URLs before calling the change live.

For homepage or visual styling updates, add a small visual QA pass before publish. At minimum, review:

- homepage first screen
- Featured Video / Research block
- Team page
- Alumni page
- one profile page

Confirm the changed surfaces still read as part of one editorial system before publishing.

Run the full regression gate before publishing:

```bash
python3 scripts/check_site.py --browser --evidence /path/to/local-evidence
```

The check starts a loopback-only HTTP server on an available port and stops it
when finished, including on failure. It checks actual filtered-card visibility,
keyboard focus, mobile selectors, five layout widths, natural photo proportions,
gallery space, contact routing, Julia's details, shared-module cache versions,
the flat mirror, no-JavaScript publications, animation controls, and V1 dialog
opening. It never submits game scores. Keep screenshots outside the public
repository (CI evidence uses the ignored `output/` directory).

One-time setup with Node.js 20+ and npm available:

```bash
npm install --no-save --package-lock=false --ignore-scripts playwright@1.62.1
npx playwright install chromium
```

On Linux CI, install Chromium's system dependencies with
`npx playwright install --with-deps chromium`. For installed Chrome, set
`PLAYWRIGHT_CHANNEL=chrome`. `NODE_BINARY` can select an existing Node executable;
`NODE_PATH` can point to an existing Playwright package directory. The publisher
builds in a temporary snapshot without `node_modules`, so its check runner also
resolves the original checkout's `node_modules` through `NODE_PATH`.

The gate runs a second build to verify reproducibility and runs all `test_*.py`
regressions. Both dry-run and actual publishing require the same browser gate;
there is no silent test bypass. Missing browser tools stop publication before
staging. GitHub checks pull requests and main pushes and uploads short-lived
browser evidence. Scheduled personnel updates use this same scoped publisher;
only their two canonical data files are selected.

Featured alumni selection and approved short role labels remain in
`data/featured-alumni.json`. Each entry references a `profileSlug`; names,
external URLs, and default current roles derive from `data/people.json`.
`currentRoleOverride` is reserved for explicitly approved editorial wording
that differs from the directory. `sourceLabel` and `roleInLab` retain approved
presentation text; `showSource: false` preserves an intentional omission of an
external link. Duplicate names/URLs and repeated or unknown slugs fail the build.
Source-button labels come from one builder mapping. `assets/data/featured-alumni.json`
is generated runtime data, not an editing source. A source label describes the
link destination, not a guarantee that every listed career fact has been freshly verified.

CSS and entrypoint versions are content hashes. A generated import map hashes
each shared module independently, so an update to a dependency is not hidden
behind an unchanged browser cache entry. Source imports stay clean and relative;
no bundler or manual version-bumping is required. Maps are generated before
module scripts for both nested and flat pages. See the
[browser import-map documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/importmap).
The separately managed V1 game and favicon versions are unchanged.

Homepage contact routes are generated by `contact_mailto` in the builder.
General inquiries use `[Bernhardt Lab website] General inquiry` and CC
`james_spencer@hms.harvard.edu`. Training inquiries use a distinct website subject
and a short applicant template without CC. Tom's personal profile stays a direct
email link without a preset CC. These are editable email-client defaults, not a
spam filter or a guarantee that a sender retains the subject, template, or CC.

This regenerates:

- homepage people/alumni slices
- people and alumni directory pages
- all current-member and alumni profile pages
- generated CSS bundles
- generated game runtime config
- generated `github-flat/` mirror

## Routine refreshes

These scripts refresh machine-generated feeds and then rebuild automatically:

```bash
python3 scripts/refresh_youtube_video_stats.py
python3 scripts/refresh_research_in_motion.py
```

The YouTube view-count workflow runs monthly. Manual refreshes are still
available, but routine publishing should not create high-frequency view-count
commits.

The unused weekly PubMed-feed workflow has been retired. The manual
`refresh_recent_publications.py` script and last feed snapshot are retained for
reference only, not used by live pages. Homepage publication HTML is generated
from the six approved entries in `data/curated-publications.json`; publication
content does not depend on JavaScript or a runtime fetch.
The small `assets/js/publications.js` compatibility module remains so cached
older entrypoints do not encounter a missing import during the transition.

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

Edit the appropriate source, then select it explicitly for publishing. `data/site-copy.json` owns selected settings such as slides and featured video data; other approved homepage prose lives in `index.html`. For example: `python3 scripts/publish_site.py --include data/site-copy.json`.

### Update gallery or featured alumni

Edit `data/gallery.json` or `data/featured-alumni.json`, then select that exact file with `python3 scripts/publish_site.py --include <source-file>`.

### Update scientific archive media

1. Import stills and poster frames into `assets/images/research/`
2. Import browser-safe local videos into `assets/media/research/`
3. Update `data/scientific-media.json`
4. Review a `--dry-run` manifest listing `data/scientific-media.json` and each intentionally imported asset, then publish with that same manifest.

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

## Envelope Escape game

V1 is the public footer game and the gameplay baseline. The prior V2 Phaser preview, source, generated bundle, and npm build dependencies were removed in August 2026.

Future replacements must stay experimental until they pass real browser screenshot/playtest QA and are visibly better than V1. Do not make a preview the default based on static checks alone.

Source and output:

- `assets/envelope-escape.js` and `assets/envelope-escape.css` are the active production game.
- `assets/envelope-escape-config.js` is generated from `data/runtime-config.json`.
- Replacement-game work should remain isolated until it passes real browser playtesting.

## Generated assets

These are outputs, not canonical source:

- `assets/styles.css`
- `assets/profile.css`
- `assets/alumni.css`
- `assets/envelope-escape-config.js`
- `github-flat/`

`github-flat/` now keeps nested `assets/` and `data/` as the authoritative generated mirror. Root-level non-HTML files there are cleaned during the build and should not be restored manually.

Private archives must stay outside the public repository. The build fails if an `archive/` or `tmp/` directory, or a raw TIFF, appears in the public tree.

Feature JS source now lives in:

- `assets/js/`

CSS source slices now live in:

- `assets/css/`
