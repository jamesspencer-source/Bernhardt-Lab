# Global Leaderboard Backend (Cloudflare Worker + D1)

This adds a shared Top 25 leaderboard for `Envelope Escape` across all visitors.

## Persistence across GitHub/site updates
- Yes: scores persist across GitHub pushes and site redesigns.
- Reason: leaderboard data lives in Cloudflare D1, not in site files.
- Redeploying static pages does not erase D1 data.
- Redeploying the Worker also keeps data as long as it stays bound to the same D1 database.

## What this API provides
- `GET /leaderboard?board=classic` returns the shared classic top 25.
- `GET /leaderboard?board=daily-YYYY-MM-DD` returns the seeded daily board top 25.
- `POST /leaderboard` submits `{ "name": "...", "score": 123, "species": "ecoli", "playedAt": 1739999999999, "board": "classic" }`.
- `GET` and `POST` responses include `totalEntries` and `board`, and `POST` also returns the submitted run's `rank`.
- Name submissions are moderated (disallowed names are rejected).

## Deploy steps
1. Install Wrangler:
```bash
npm install -g wrangler
```
2. Authenticate:
```bash
wrangler login
```
3. Create the D1 database:
```bash
wrangler d1 create bernhardt_lab_leaderboard
```
4. Copy `wrangler.toml.example` to `wrangler.toml` and paste the `database_id` from step 3.
6. (Optional) Set allowed origins in `wrangler.toml` using `ALLOWED_ORIGINS`.
7. Apply schema:
```bash
wrangler d1 execute bernhardt_lab_leaderboard --remote --file=schema.sql
```
8. Deploy:
```bash
wrangler deploy
```

## Keep data durable
- Do not delete/recreate the D1 database unless you intentionally want to reset scores.
- Keep the same `database_id` in `wrangler.toml`.
- Optional periodic backup:
```bash
wrangler d1 export bernhardt_lab_leaderboard --output ./leaderboard-backup.sql
```

## Wire frontend to the API
1. Open:
- `data/runtime-config.json`
2. Set:
```json
{
  "leaderboardUrl": "https://<your-worker-subdomain>/leaderboard"
}
```
3. Run:
```bash
python3 scripts/build_site.py
```
4. Deploy/publish your site.

When the URL is set, the game leaderboard becomes global.
Players will also see their latest overall placement after each ranked run.
