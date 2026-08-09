# Thomas Bernhardt Lab Website

Static lab website for the Thomas Bernhardt Lab, published via GitHub Pages at `https://bernhardtlab.com`.

For a zero-context Codex or engineer handoff, start with `AGENTS.md`.

For visual and interface work, also use:

- `docs/editorial-style-guide.md`

## How the site is organized now

- `data/` is the canonical hand-edited content source.
- `assets/data/` is runtime/generated data for the live site.
- `assets/js/` contains feature-level browser modules.
- `assets/css/` contains the source CSS slices.
- `assets/styles.css`, `assets/profile.css`, and `assets/alumni.css` are generated from `assets/css/`.
- `github-flat/` is generated output only. Do not hand-edit it.

Private website archives must stay outside this public repository. The local private archive is stored under the HMS lab website folder and is explicitly labeled `PRIVATE Website Archive`.

## Canonical URL scheme

The branded public URL map is:

- `/` homepage
- `/team/` current team directory
- `/team/{person-slug}/` current member profiles
- `/alumni/` alumni directory
- `/alumni/{person-slug}/` alumni profiles
- `/research/` research library
- `/accessibility/` accessibility page

Legacy paths such as `/people/`, `/research-library/`, root-level profile slugs, and `alumni-profiles/*.html` are redirect-only compatibility pages. Canonical pages, internal links, and `sitemap.xml` should use only the branded route map above.

## Canonical content sources

Edit these first:

- `/Users/james/Documents/GitHub/Bernhardt-Lab/data/people.json`
- `/Users/james/Documents/GitHub/Bernhardt-Lab/data/gallery.json`
- `/Users/james/Documents/GitHub/Bernhardt-Lab/data/featured-alumni.json`
- `/Users/james/Documents/GitHub/Bernhardt-Lab/data/curated-publications.json`
- `/Users/james/Documents/GitHub/Bernhardt-Lab/data/scientific-media.json`
- `/Users/james/Documents/GitHub/Bernhardt-Lab/data/site-copy.json`
- `/Users/james/Documents/GitHub/Bernhardt-Lab/data/runtime-config.json`

Generated or entrypoint files you should usually not hand-edit directly:

- `/Users/james/Documents/GitHub/Bernhardt-Lab/assets/styles.css`
- `/Users/james/Documents/GitHub/Bernhardt-Lab/assets/profile.css`
- `/Users/james/Documents/GitHub/Bernhardt-Lab/assets/alumni.css`
- `/Users/james/Documents/GitHub/Bernhardt-Lab/assets/envelope-escape-config.js`
- `/Users/james/Documents/GitHub/Bernhardt-Lab/github-flat/**`

Frontend entrypoints:

- `/Users/james/Documents/GitHub/Bernhardt-Lab/assets/main.js`
- `/Users/james/Documents/GitHub/Bernhardt-Lab/assets/alumni.js`

Those entrypoints now import smaller feature modules from:

- `/Users/james/Documents/GitHub/Bernhardt-Lab/assets/js/`

## Build the site

Run:

```bash
python3 scripts/build_site.py
```

The normal build also runs the Tom feedback compliance gate. To run that gate by itself:

```bash
python3 scripts/validate_tom_compliance.py
```

That validator blocks regressions against Tom's requested content rules: the curated six-paper homepage publication set, removed alumni, required featured alumni, corrected gallery caption, omitted placeholder verification/role text, and pasted raw formatting artifacts.

The build also rejects broken local page links or fragments, public images without `alt` attributes, and referenced public images larger than 1 MB.

Publish website updates to `main`:

```bash
python3 scripts/publish_site.py
```

This will:

- validate canonical structured data
- regenerate homepage team/alumni slices
- regenerate `team/index.html` and `alumni/index.html`
- regenerate current-member and alumni profile pages
- rebuild generated CSS bundles
- regenerate `assets/envelope-escape-config.js`
- refresh the generated `github-flat/` mirror

## Routine refresh scripts

These write canonical runtime data and then regenerate dependent outputs automatically:

- `python3 scripts/refresh_recent_publications.py`
- `python3 scripts/refresh_youtube_video_stats.py`
- `python3 scripts/refresh_research_in_motion.py`

YouTube view stats are also refreshed by GitHub Actions once per month.

For the normal end-to-end website workflow, use:

```bash
python3 scripts/publish_site.py
```

This command will:

- confirm you are on `main`
- fetch and verify `origin/main` is not ahead
- remove transient local noise such as `.DS_Store` and Python cache folders
- run `python3 scripts/build_site.py`
- stage only approved website paths
- commit only if a real website diff remains
- push the result to `origin main`

Archive scientific media is curated manually:

- import stills and poster frames into `assets/images/research/`
- import browser-safe local videos into `assets/media/research/`
- update `data/scientific-media.json`
- run `python3 scripts/build_site.py`

## Scheduled people updates

Future-dated personnel changes live in `data/scheduled-updates.json`.
Use this for known departures so the site can move current lab members to
alumni automatically after their last day.

Preview due updates locally:

```bash
python3 scripts/apply_scheduled_updates.py --dry-run
```

Preview a specific date:

```bash
python3 scripts/apply_scheduled_updates.py --today 2026-07-01 --dry-run
```

The daily GitHub Action applies due updates, rebuilds the site, and commits only
when a real website diff exists. Featured alumni remains manually curated.

## Envelope Escape game

V1 is the public footer game and the gameplay baseline. The prior Phaser + TypeScript V2 preview and its build dependencies were removed from the public repository in August 2026.

Do not make any replacement game public until it has real browser screenshot/playtest QA and is clearly better than V1.

The legacy path remains:

```text
index.html?envelopeLegacy=1
```

Active source and generated config:

- `/Users/james/Documents/GitHub/Bernhardt-Lab/assets/envelope-escape.js`
- `/Users/james/Documents/GitHub/Bernhardt-Lab/assets/envelope-escape.css`
- `/Users/james/Documents/GitHub/Bernhardt-Lab/assets/envelope-escape-config.js`

Develop any replacement game in an isolated branch until it passes desktop and mobile browser playtesting and is clearly ready to replace V1.

## Global Envelope Escape leaderboard

The public leaderboard endpoint now comes from:

- `/Users/james/Documents/GitHub/Bernhardt-Lab/data/runtime-config.json`

`assets/envelope-escape-config.js` and the flat mirror are generated from that source during the build.

Manual smoke test:

```bash
python3 scripts/check_leaderboard_worker.py
```

This checks:

- `GET /leaderboard?board=classic`
- `GET /leaderboard?board=daily-YYYY-MM-DD`

and verifies the response shape the public site needs to load shared scores. If the
live worker still has the legacy boardless response shape, the check prints a
board-routing warning instead of failing; the game uses the shared classic board
and falls back to a local daily board in that state.

After redeploying the board-aware worker, enforce the stricter contract with:

```bash
python3 scripts/check_leaderboard_worker.py --require-board-routing
```

## Important editing rule

Edit canonical source files only.

Standard workflow for this repo is to verify, commit, and push completed scoped changes to `main` unless the user explicitly asks otherwise or a concrete blocker makes that unsafe.

The preferred command-driven path for that workflow is:

```bash
python3 scripts/publish_site.py
```

Do not hand-edit:

- `github-flat/`
- generated flat HTML pages
- generated runtime config files copied from canonical sources

## Key pages and assets

- Homepage: `/Users/james/Documents/GitHub/Bernhardt-Lab/index.html`
- Team directory: `/Users/james/Documents/GitHub/Bernhardt-Lab/team/index.html`
- Alumni directory: `/Users/james/Documents/GitHub/Bernhardt-Lab/alumni/index.html`
- Shared layout styling source: `/Users/james/Documents/GitHub/Bernhardt-Lab/assets/css/`
- Profile styling: `/Users/james/Documents/GitHub/Bernhardt-Lab/assets/profile.css`
- Production game code: `/Users/james/Documents/GitHub/Bernhardt-Lab/assets/envelope-escape.js`
- Leaderboard worker: `/Users/james/Documents/GitHub/Bernhardt-Lab/leaderboard-worker/`

## Maintenance notes

For a plain-language maintenance workflow, see:

- `/Users/james/Documents/GitHub/Bernhardt-Lab/docs/site-maintenance.md`
- `/Users/james/Documents/GitHub/Bernhardt-Lab/docs/editorial-style-guide.md`
