# Site Maintenance Workflow

## One rule

Edit canonical sources first, then rebuild.

Do not hand-edit `github-flat/`.

## Canonical sources

- People and alumni: `/Users/james/Documents/HMS Lab Ops/01 Bernhardt Lab/13 Lab Website/TB lab website/data/people.json`
- Gallery: `/Users/james/Documents/HMS Lab Ops/01 Bernhardt Lab/13 Lab Website/TB lab website/data/gallery.json`
- Featured alumni: `/Users/james/Documents/HMS Lab Ops/01 Bernhardt Lab/13 Lab Website/TB lab website/data/featured-alumni.json`
- Curated publications fallback: `/Users/james/Documents/HMS Lab Ops/01 Bernhardt Lab/13 Lab Website/TB lab website/data/curated-publications.json`
- Shared homepage/site copy: `/Users/james/Documents/HMS Lab Ops/01 Bernhardt Lab/13 Lab Website/TB lab website/data/site-copy.json`
- Runtime config such as the public leaderboard URL: `/Users/james/Documents/HMS Lab Ops/01 Bernhardt Lab/13 Lab Website/TB lab website/data/runtime-config.json`

## Rebuild command

```bash
python3 scripts/build_site.py
```

This regenerates:

- homepage people/alumni slices
- people and alumni directory pages
- all current-member and alumni profile pages
- generated CSS bundle
- generated game runtime config
- generated `github-flat/` mirror

## Routine refreshes

These scripts refresh machine-generated feeds and then rebuild automatically:

```bash
python3 scripts/refresh_recent_publications.py
python3 scripts/refresh_youtube_video_stats.py
python3 scripts/refresh_research_in_motion.py
```

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

### Update homepage copy

Edit `data/site-copy.json`, then run the build.

### Update gallery or featured alumni

Edit `data/gallery.json` or `data/featured-alumni.json`, then run the build.

## Leaderboard health check

Run:

```bash
python3 scripts/check_leaderboard_worker.py
```

This verifies the live Cloudflare Worker still responds correctly for:

- classic board
- current daily board

If it fails, check:

- `data/runtime-config.json`
- Cloudflare Worker deployment state
- D1 binding / schema drift
- whether the live worker has been redeployed after repo-side leaderboard API changes

## Generated assets

These are outputs, not canonical source:

- `assets/styles.css`
- `assets/envelope-escape-config.js`
- `github-flat/`

Feature JS source now lives in:

- `assets/js/`

CSS source slices now live in:

- `assets/css/`
