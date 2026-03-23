# Thomas Bernhardt Lab Website

Static lab website for the Thomas Bernhardt Lab, published via GitHub Pages.

## How the site is organized now

- `data/` is the canonical hand-edited content source.
- `assets/data/` is runtime/generated data for the live site.
- `assets/js/` contains feature-level browser modules.
- `assets/css/` contains the source CSS slices.
- `assets/styles.css` is generated from `assets/css/`.
- `github-flat/` is generated output only. Do not hand-edit it.

## Canonical content sources

Edit these first:

- `/Users/james/Documents/HMS Lab Ops/01 Bernhardt Lab/13 Lab Website/TB lab website/data/people.json`
- `/Users/james/Documents/HMS Lab Ops/01 Bernhardt Lab/13 Lab Website/TB lab website/data/gallery.json`
- `/Users/james/Documents/HMS Lab Ops/01 Bernhardt Lab/13 Lab Website/TB lab website/data/featured-alumni.json`
- `/Users/james/Documents/HMS Lab Ops/01 Bernhardt Lab/13 Lab Website/TB lab website/data/curated-publications.json`
- `/Users/james/Documents/HMS Lab Ops/01 Bernhardt Lab/13 Lab Website/TB lab website/data/site-copy.json`
- `/Users/james/Documents/HMS Lab Ops/01 Bernhardt Lab/13 Lab Website/TB lab website/data/runtime-config.json`

Generated or entrypoint files you should usually not hand-edit directly:

- `/Users/james/Documents/HMS Lab Ops/01 Bernhardt Lab/13 Lab Website/TB lab website/assets/styles.css`
- `/Users/james/Documents/HMS Lab Ops/01 Bernhardt Lab/13 Lab Website/TB lab website/assets/envelope-escape-config.js`
- `/Users/james/Documents/HMS Lab Ops/01 Bernhardt Lab/13 Lab Website/TB lab website/github-flat/**`

Frontend entrypoints:

- `/Users/james/Documents/HMS Lab Ops/01 Bernhardt Lab/13 Lab Website/TB lab website/assets/main.js`
- `/Users/james/Documents/HMS Lab Ops/01 Bernhardt Lab/13 Lab Website/TB lab website/assets/alumni.js`

Those entrypoints now import smaller feature modules from:

- `/Users/james/Documents/HMS Lab Ops/01 Bernhardt Lab/13 Lab Website/TB lab website/assets/js/`

## Build the site

Run:

```bash
python3 scripts/build_site.py
```

This will:

- validate canonical structured data
- regenerate homepage team/alumni slices
- regenerate `people/index.html` and `alumni/index.html`
- regenerate current-member and alumni profile pages
- rebuild `assets/styles.css`
- regenerate `assets/envelope-escape-config.js`
- refresh the generated `github-flat/` mirror

## Routine refresh scripts

These write canonical runtime data and then regenerate dependent outputs automatically:

- `python3 scripts/refresh_recent_publications.py`
- `python3 scripts/refresh_youtube_video_stats.py`
- `python3 scripts/refresh_research_in_motion.py`

## Global Envelope Escape leaderboard

The public leaderboard endpoint now comes from:

- `/Users/james/Documents/HMS Lab Ops/01 Bernhardt Lab/13 Lab Website/TB lab website/data/runtime-config.json`

`assets/envelope-escape-config.js` and the flat mirror are generated from that source during the build.

Manual smoke test:

```bash
python3 scripts/check_leaderboard_worker.py
```

This checks:

- `GET /leaderboard?board=classic`
- `GET /leaderboard?board=daily-YYYY-MM-DD`

and verifies the expected response shape.

## Important editing rule

Edit canonical source files only.

Do not hand-edit:

- `github-flat/`
- generated flat HTML pages
- generated runtime config files copied from canonical sources

## Key pages and assets

- Homepage: `/Users/james/Documents/HMS Lab Ops/01 Bernhardt Lab/13 Lab Website/TB lab website/index.html`
- Team directory: `/Users/james/Documents/HMS Lab Ops/01 Bernhardt Lab/13 Lab Website/TB lab website/people/index.html`
- Alumni directory: `/Users/james/Documents/HMS Lab Ops/01 Bernhardt Lab/13 Lab Website/TB lab website/alumni/index.html`
- Shared layout styling source: `/Users/james/Documents/HMS Lab Ops/01 Bernhardt Lab/13 Lab Website/TB lab website/assets/css/`
- Profile styling: `/Users/james/Documents/HMS Lab Ops/01 Bernhardt Lab/13 Lab Website/TB lab website/assets/profile.css`
- Game code: `/Users/james/Documents/HMS Lab Ops/01 Bernhardt Lab/13 Lab Website/TB lab website/assets/envelope-escape.js`
- Leaderboard worker: `/Users/james/Documents/HMS Lab Ops/01 Bernhardt Lab/13 Lab Website/TB lab website/leaderboard-worker/`

## Maintenance notes

For a plain-language maintenance workflow, see:

- `/Users/james/Documents/HMS Lab Ops/01 Bernhardt Lab/13 Lab Website/TB lab website/docs/site-maintenance.md`
