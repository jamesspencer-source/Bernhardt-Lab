# Casual Leaderboard (Cloudflare Worker + D1)

Envelope Escape has a shared Top 25 for classic and daily runs. Scores are
**casual and unverified**, not authenticated competition results. A run ticket,
elapsed-time plausibility check, replay prevention, and request/storage limits
discourage accidental duplicates and simple abuse; they do not prove gameplay.
CORS controls browser response access, not who can call the API.

## API: submission protocol 2

- `GET /leaderboard?board=classic` reads classic scores.
- `GET /leaderboard?board=daily-YYYY-MM-DD` reads a valid calendar-date board.
- `POST /leaderboard/runs` starts a run with `{ "board": "classic", "species": "ecoli" }`.
  It returns `runId`, `expiresAt`, board/species, and `submissionProtocol: 2`.
- `POST /leaderboard` completes that run with
  `{ "runId": "<issued UUID>", "name": "Player", "score": 123, "species": "ecoli", "board": "classic" }`.
  The server assigns the public timestamp and returns `entry`, `entries`, and `rank`.
- `/api/leaderboard` and `/api/leaderboard/runs` are equivalent aliases.

POST bodies must be JSON objects under 1 KiB with only the documented fields.
Scores must be positive integers. No client timestamp is accepted. A matching
repeat completion is idempotent; a changed completion is rejected. Name
moderation still applies. New daily runs use today's date in America/New_York;
an issued run may finish after midnight within its two-hour lifetime.

Gameplay does not wait for the network. If a ticket expires, the API is unavailable,
or a shared submission is rejected, the game saves to the device's local board.
Cached older clients without run tickets also fall back locally.

## Limits and persistence

- The two Cloudflare rate bindings limit writes to about 120/minute per location
  and 30/minute per client IP per location. They are approximate, not a global
  billing quota. IP addresses are used transiently and are not stored in D1.
- Atomic D1 admission permits at most 1,000 unsubmitted, unexpired tickets.
- New completed runs retain at most 500 per board and 5,000 globally for 31 days.
  Deterministic cleanup runs on writes and hourly; reads exclude expired history.
- The historical `leaderboard_scores` table is read-only in this Worker. Existing
  scores are preserved, including when only an older subset of columns exists.
  At most 500 historical and 500 new records are combined for each board's result
  and retained-entry count. These are not lifetime participation statistics.
- The new `leaderboard_runs` table is separate. Missing/incomplete run schema or
  missing rate bindings blocks writes explicitly; requests never migrate tables.
- Static-site pushes and Worker deployments do not reset the database. Never
  delete/recreate D1 or change its ID to perform a routine deployment.

## Test and deploy

Use Node.js 24+ and the pinned dependencies, not a globally unpinned Wrangler:

```bash
cd leaderboard-worker
npx --yes pnpm@11.19.0 install --frozen-lockfile
npx --yes pnpm@11.19.0 test
npx --yes pnpm@11.19.0 test:runtime
```

The first suite exercises real SQLite including legacy schemas, bounds,
timestamps, concurrency and replay. The runtime suite uses local Miniflare/D1
and real Cloudflare rate-limit bindings. Neither writes to the public board.

Before deploying, confirm `wrangler whoami` and the existing Worker version's
database/origin bindings. Export D1 **outside this public repository** and retain
that backup privately before applying the additive migration:

```bash
npx --yes pnpm@11.19.0 exec wrangler d1 export bernhardt_lab_leaderboard --remote --output /private/path/leaderboard-backup.sql
npx --yes pnpm@11.19.0 exec wrangler d1 execute bernhardt_lab_leaderboard --remote --file=security-schema.sql
npx --yes pnpm@11.19.0 exec wrangler deploy --dry-run
npx --yes pnpm@11.19.0 exec wrangler deploy
```

`schema.sql` initializes historical storage only for a genuinely new database;
do not substitute that setup for backing up the existing production database.
`wrangler.toml.example` documents the required bindings. Do not copy it over an
existing deployment without preserving the real database ID and origins.

Deploy the Worker and publish the matching frontend in the same release. The
site endpoint remains in `data/runtime-config.json`; rebuild with
`python3 scripts/build_site.py` and use the normal scoped site publisher.
From the repository root, check the live read-only API after deployment:

```bash
python3 scripts/check_leaderboard_worker.py --require-board-routing
```

This smoke check does not submit scores or replace the local security suites.
Confirm production reads advertise `submissionProtocol: 2` and
`ranking: "casual-unverified"`. Keep the previous Worker version ID and private
database backup for rollback; the additive schema can stay in place if code is
rolled back. Reverting code also reverts the write protections.
