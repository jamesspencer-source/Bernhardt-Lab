# AGENTS.md

Start here if you are a fresh Codex thread or any engineer opening this repo with no prior context.

## Project purpose

This repository contains the static Bernhardt Lab website, published via GitHub Pages.

- Canonical working directory:
  `/Users/james/Documents/HMS Lab Ops/01 Bernhardt Lab/13 Lab Website/TB lab website`
- Current public site URL:
  `https://jamesspencer-source.github.io/Bernhardt-Lab/`

## Source of truth

Edit canonical sources first.

- `data/` is the canonical hand-edited content source.
- `assets/data/` is runtime/generated data for the live site.
- `github-flat/` is generated output only. Do not hand-edit it.

Important canonical files:

- `data/people.json`
- `data/gallery.json`
- `data/featured-alumni.json`
- `data/curated-publications.json`
- `data/site-copy.json`
- `data/runtime-config.json`

Generated outputs you should usually not edit directly:

- `assets/styles.css`
- `assets/envelope-escape-config.js`
- `github-flat/**`

## Primary commands

Build the site:

```bash
python3 scripts/build_site.py
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

## Editing rules

- Edit canonical sources first, then rebuild.
- Do not hand-edit `github-flat/`.
- Do not hand-edit generated runtime config or generated CSS bundles.
- Stage narrowly and avoid bundling unrelated local churn.
- `.DS_Store` should generally be discarded, not committed.
- `github-flat` and image mirrors can show noisy local churn; do not commit those changes unless they are intentional.

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

## Game and leaderboard notes

- The Envelope Escape frontend runtime URL comes from `data/runtime-config.json`.
- The generated frontend config file is `assets/envelope-escape-config.js`.
- The Cloudflare Worker + D1 backend lives in `leaderboard-worker/`.
- Repo-side changes do not redeploy the worker automatically.
- If leaderboard API or schema behavior changes, the live worker may need a separate redeploy.

## Git / push expectations

- Push using SSH.
- Push from `main`.
- Before committing, make sure you are in the repo root, not inside `github-flat/`.
- Default workflow for this repo: after completing a scoped change, run the relevant verification, commit it, and push it to `main` unless the user explicitly asks not to or there is a concrete blocker such as unrelated dirty changes, merge conflicts, or a failed check.
- If a push is blocked, report the blocker clearly instead of leaving the repo half-finished without explanation.

## Related docs

- `README.md` is the main repo overview.
- `docs/site-maintenance.md` is the deeper operator workflow.
- `leaderboard-worker/README.md` explains the global leaderboard backend and deployment.
