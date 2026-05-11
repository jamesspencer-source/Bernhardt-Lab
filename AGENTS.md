# AGENTS.md

Start here if you are a fresh Codex thread or any engineer opening this repo with no prior context.

## Project purpose

This repository contains the static Bernhardt Lab website, published via GitHub Pages.

- Canonical working directory:
  `/Users/james/Documents/HMS Lab Ops/01 Bernhardt Lab/13 Lab Website/Bernhardt-Lab`
- Current public site URL:
  `https://bernhardtlab.com/`

## Source of truth

Edit canonical sources first.

- `data/` is the canonical hand-edited content source.
- `assets/data/` is runtime/generated data for the live site.
- `github-flat/` is generated output only. Do not hand-edit it.
- Canonical branded URLs use `/team/`, `/team/{slug}/`, `/alumni/`, `/alumni/{slug}/`, `/research/`, and `/accessibility/`.
- Legacy URLs such as `/people/`, `/research-library/`, root-level profile slugs, and `alumni-profiles/*.html` should remain redirect-only compatibility pages.

Important canonical files:

- `data/people.json`
- `data/gallery.json`
- `data/featured-alumni.json`
- `data/curated-publications.json`
- `data/scientific-media.json`
- `data/site-copy.json`
- `data/runtime-config.json`

Generated outputs you should usually not edit directly:

- `assets/styles.css`
- `assets/envelope-escape-config.js`
- `assets/game/envelope-escape/runtime/envelope-escape-v2.js`
- `github-flat/**`

## Primary commands

Build the site:

```bash
python3 scripts/build_site.py
```

Run Tom feedback compliance only:

```bash
python3 scripts/validate_tom_compliance.py
```

`build_site.py` and `publish_site.py` both enforce this gate. It prevents future updates from reintroducing Tom-removed alumni, incorrect homepage publication links, removed gallery items, placeholder alumni text, or escaped raw formatting markup.

Build the hidden Envelope Escape V2 game after TypeScript source changes:

```bash
npm install
npm run game:check
npm run game:build
python3 scripts/build_site.py
```

Publish website updates:

```bash
python3 scripts/publish_site.py
```

Refresh machine-generated site data:

```bash
python3 scripts/refresh_recent_publications.py
python3 scripts/refresh_youtube_video_stats.py
python3 scripts/refresh_research_in_motion.py
```

Check the live leaderboard worker:

```bash
python3 scripts/check_leaderboard_worker.py
```

After redeploying board-aware worker changes, verify board routing explicitly:

```bash
python3 scripts/check_leaderboard_worker.py --require-board-routing
```

## Editing rules

- Edit canonical sources first, then rebuild.
- Do not hand-edit `github-flat/`.
- Do not hand-edit generated runtime config or generated CSS bundles.
- Stage narrowly and avoid bundling unrelated local churn.
- `.DS_Store` should generally be discarded, not committed.
- `github-flat` is regenerated from nested `assets/` and `data/` paths. Root-level non-HTML files there are legacy baggage and should not be reintroduced.
- Prefer `python3 scripts/publish_site.py` for the normal build/commit/push flow.
- Do not bypass the Tom feedback compliance gate; if it fails, fix the canonical source rather than patching generated HTML.

## Common tasks

Update people or alumni:

1. Edit `data/people.json`
2. Update the record fields
3. Run `python3 scripts/build_site.py`

Update homepage/site copy:

1. Edit `data/site-copy.json`
2. Run `python3 scripts/build_site.py`

Update gallery or featured alumni:

1. Edit `data/gallery.json` or `data/featured-alumni.json`
2. Run `python3 scripts/build_site.py`

Update archive scientific media:

1. Import stills/poster frames into `assets/images/research/`
2. Import browser-safe local videos into `assets/media/research/`
3. Edit `data/scientific-media.json`
4. Run `python3 scripts/build_site.py`

## Game and leaderboard notes

- The Envelope Escape frontend runtime URL comes from `data/runtime-config.json`.
- The generated frontend config file is `assets/envelope-escape-config.js`.
- V1 production game code lives in `assets/envelope-escape.js`.
- V2 beta source lives in `game-src/envelope-escape/`.
- V2 beta static output lives in `assets/game/envelope-escape/runtime/`.
- V2 beta loads only with `?envelopeV2=1`.
- `?envelopeLegacy=1` keeps the legacy path.
- The Cloudflare Worker + D1 backend lives in `leaderboard-worker/`.
- Repo-side changes do not redeploy the worker automatically.
- If leaderboard API or schema behavior changes, the live worker may need a separate redeploy.

## Git / push expectations

- Push using SSH.
- Push from `main`.
- Before committing, make sure you are in the repo root, not inside `github-flat/`.
- Default workflow for this repo: after completing a scoped change, run the relevant verification, commit it, and push it to `main` unless the user explicitly asks not to or there is a concrete blocker such as unrelated dirty changes, merge conflicts, or a failed check.
- The preferred command-driven path is `python3 scripts/publish_site.py`.
- That publish command cleans transient local artifacts, rebuilds the site, stages only approved website paths, commits if needed, and pushes to `origin main`.
- If a push is blocked, report the blocker clearly instead of leaving the repo half-finished without explanation.

## Related docs

- `README.md` is the main repo overview.
- `docs/site-maintenance.md` is the deeper operator workflow.
- `docs/editorial-style-guide.md` is the visual source of truth for editorial style, card cohesion, and pre-publish UI QA.
- `docs/envelope-escape-game-upgrade.md` tracks the Phaser + TypeScript game rebuild.
- `docs/envelope-escape-art-direction.md` tracks the Envelope Escape asset brief and QA checklist.
- `leaderboard-worker/README.md` explains the global leaderboard backend and deployment.
