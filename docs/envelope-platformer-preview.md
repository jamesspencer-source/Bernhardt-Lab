# Envelope Escape replacement preview

The replacement game is isolated from the production V1 launcher and is not
linked from the public website.

- Local preview route: `/game-preview/`
- Game engine: Phaser 3.90.0, vendored under `assets/vendor/` (MIT license)
- Current milestone: Level 1, *Escherichia coli*
- Core loop: collect five green wall blocks to trigger a timed Wall Rush; red
  hazards damage health outside the rush and break for bonus points during it
- Fixed values: green blocks add 100 points, red hits remove 20 health and 200
  points, gold checkpoints add 750 points and fully heal, cyan health kits
  restore 20 health, and Wall Rush smashes add 1,000 points
- Visual language: cyan is the player and helper color, green means collect,
  red means avoid, and gold marks checkpoints and the exit
- Beginner guidance: the start screen teaches the complete color and scoring
  rules, the HUD repeats them, and a contextual control prompt appears if the
  player does not begin moving
- Leaderboard: local browser playtest board only until gameplay is approved

Do not connect this preview to the public footer trigger until desktop and mobile
playtesting, browser QA, and the shared leaderboard migration are complete.
