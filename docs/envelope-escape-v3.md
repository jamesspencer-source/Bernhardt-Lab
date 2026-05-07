# Envelope Escape V3 Simulation Foundation

V3 simulation foundation code lives under `game-src/envelope-escape-v3/src/foundation/` and is exported from `game-src/envelope-escape-v3/src/index.ts`.

The foundation is renderer-agnostic. State is plain JSON-compatible data with Three.js/Rapier-facing transform and physics snapshots, but it never stores renderer objects, Rapier handles, closures, DOM nodes, or audio objects.

## Renderer/UI Import

```ts
import {
  PHASES,
  RADIAL_COMMANDS,
  SPECIES,
  STRESS_EVENTS,
  UPGRADES,
  activateRadialCommand,
  applyInputAction,
  createLeaderboardPayload,
  getHudSnapshot,
  getRunReport,
  serializeLeaderboardEntry,
  startEnvelopeV3Run,
  stepEnvelopeV3Simulation
} from "./foundation";
```

## Runtime Loop

Create a run with `startEnvelopeV3Run({ mode, speciesId, playerName, seed, dateKey })`.

Advance it with `stepEnvelopeV3Simulation(state, dt, actions)`. The function mutates and returns the same serializable `EnvelopeV3State`, plus `recentEvents` for UI toasts, sound cues, particles, and report updates.

Input should be sent as action objects, not renderer callbacks:

```ts
stepEnvelopeV3Simulation(state, dt, [
  { type: "move", vector: { x: 0.7, y: -0.2 } },
  { type: "dash" },
  { type: "activate-command", commandId: "patch-wall" }
]);
```

## Contracts

- Content exports: `WORLD`, `SPECIES`, `PICKUPS`, `PHASES`, `STRESS_EVENTS`, `RADIAL_COMMANDS`, `UPGRADES`, `DAILY_PROFILES`.
- State exports: `EnvelopeV3State`, `PlayerState`, `PickupEntityState`, `StressEntityState`, `StressEventState`, `InputAction`.
- UI exports: `getHudSnapshot`, `getRunReport`, `serializeLeaderboardEntry`, `createLeaderboardPayload`.
- Daily exports: `getDailyDateKey`, `buildDailySeed`, `buildDailyChallenge`.
- Determinism: daily runs derive from the New York date key and keep `rngState` as a number in state for replay/save compatibility.
