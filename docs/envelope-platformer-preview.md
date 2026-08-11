# Envelope Escape replacement preview

The replacement game is isolated from the production V1 launcher and is not
linked from the public website.

- Local preview route: `/game-preview/`
- Game engine: Phaser 3.90.0, vendored under `assets/vendor/` (MIT license)
- Current milestone: Level 1, *Escherichia coli*
- Core loop: collect five green wall blocks to trigger a timed Wall Rush; red
  hazards damage health outside the rush and break for bonus points during it
- Visual language: green means collect, red means avoid, gold marks safe progress
  and the exit, and cyan launch pads open faster routes across course gaps
- Leaderboard: local browser playtest board only until gameplay is approved

Do not connect this preview to the public footer trigger until desktop and mobile
playtesting, browser QA, and the shared leaderboard migration are complete.
