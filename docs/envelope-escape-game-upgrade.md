# Envelope Escape V2 Production Track

This document tracks the production Phaser + TypeScript rebuild for Envelope Escape. The current V1 DOM/canvas game remains the public default until V2 passes browser QA and the live Cloudflare leaderboard check. V2 starts only when the homepage URL includes `?envelopeV2=1` and the footer game trigger is clicked.

## Current State

- V1 remains owned by `assets/envelope-escape.js` and `assets/envelope-escape.css`.
- V2 source modules live under `game-src/envelope-escape/src/`.
- V2 static output is built to `assets/game/envelope-escape/runtime/`.
- The compatibility namespace `window.BernhardtEnvelopePhaser` remains in `assets/envelope-escape-phaser.js` for local console testing.
- The hidden beta bootstrap lives at `assets/js/envelope-game/bootstrap.js`.
- V2 is bundled by Vite and includes Phaser from the local npm dependency.
- Public production visitors still receive V1 unless `?envelopeV2=1` is present.

## Runtime Shape

The V2 game uses typed systems plus Phaser scene classes:

- `Boot`: registers config/state and moves into the menu.
- `Menu`: shows the hidden beta attract scene while DOM controls handle species/name/start.
- `Play`: runs the top-down arcade survival loop.
- `GameOver`: renders the lysis end state while the DOM report handles run details.
- Leaderboard state is handled by the TypeScript leaderboard adapter and preserves the existing payload contract.

The game loop now includes phase objectives:

- `Assemble Wall`: collect PG/Lipid II modules.
- `Seal Breach`: survive cracks and complete repair.
- `Clear Adsorption`: purge or evade phage pressure.
- `Rupture Alarm`: route through expanding rupture zones.
- `Lysis Storm`: late-run score-chase survival.

Response choices:

- `Patch Wall`: restores envelope integrity at stress-response cost.
- `Purge Phages`: lowers phage pressure at stress-response cost.
- `Boost Motility`: gives a temporary movement burst at stress-response cost.

## Feature Flag Contract

Open the hidden beta with:

```text
index.html?envelopeV2=1
```

Use the legacy fallback explicitly with:

```text
index.html?envelopeLegacy=1
```

For console testing:

```js
window.BernhardtEnvelopePhaser.init({ enabled: true });
```

## Build Workflow

Install dependencies once:

```sh
npm install
```

Check and build the game:

```sh
npm run game:check
npm run game:build
```

Build the game and site together:

```sh
npm run site:build
```

The normal Python build still owns canonical HTML and `github-flat`; do not hand-edit generated mirror output.

## Leaderboard Migration Notes

V2 preserves the V1 leaderboard contract:

- URL source: `window.ENVELOPE_LEADERBOARD_URL`
- Fetch board: `GET ${url}?board=${encodeURIComponent(board)}`
- Submit entry: `POST` JSON with `name`, `score`, `species`, `playedAt`, `board`
- Expected GET response fields: `entries`, `totalEntries`, `updatedAt`, `board`
- Expected POST response fields: `ok`, `entries`, `rank`, `totalEntries`, `updatedAt`, `board`

V2 uses the same local/global fallback behavior as V1. Before replacing V1 publicly, the deployed Cloudflare worker must pass `python3 scripts/check_leaderboard_worker.py`.

## Local Phaser And Asset Pipeline

Phaser is installed locally through npm and bundled into the V2 runtime so GitHub Pages does not depend on a CDN:

- Source: `game-src/envelope-escape/src/`
- Runtime: `assets/game/envelope-escape/runtime/envelope-escape-v2.js`
- License notes: `assets/vendor/phaser-LICENSE.md`
- Vendor notes: `assets/vendor/README.md`

V2 sprites live under `assets/game/envelope-escape/`. Regenerate the first deterministic asset pack with:

```sh
python3 scripts/generate_envelope_escape_assets.py
```

See `docs/envelope-escape-art-direction.md` for the future artist/generation brief. The preferred asset set is:

- Cell sprite sheets for the supported species morphologies.
- Phage sheets with head, tail, adsorption, and warning states.
- Pickup sprites for `PG synthase`, `Lipid II`, and `Hydrolase restraint`.
- Shock-front, crack, and particle textures.
- UI state art for response choices and run reports.

When assets are regenerated, document the source tool, export dimensions, compression settings, and intended runtime file paths in this document or a neighboring asset README.

## Suggested Migration Workflow

1. Keep V1 active as the public footer game.
2. Test V2 through `?envelopeV2=1`.
3. Replace generated first-pass sprites with artist-approved sprite sheets.
4. Run V1 and V2 side by side behind mutually exclusive flags.
5. Switch the public footer trigger to V2 only after art approval, QA, and live leaderboard verification.
6. Keep `?envelopeLegacy=1` as rollback after launch.

## Testing Workflow

Static safety checks:

```sh
npm run game:check
npm run game:build
python3 scripts/build_site.py
```

Manual browser smoke test on a development page:

```js
Open `index.html?envelopeV2=1`, click the footer trigger, then verify classic run, daily run, pause, restart, response choices, game over report, and scores drawer.
```

Regression checks before any activation:

- Confirm the existing V1 Envelope Escape still loads and starts normally.
- Confirm leaderboard reads and writes still use `window.ENVELOPE_LEADERBOARD_URL`.
- Confirm normal `index.html` still opens V1.
- Confirm `index.html?envelopeV2=1` opens V2.
- Confirm `index.html?envelopeLegacy=1` leaves V1 behavior intact.
