This directory stores third-party browser-game license notes.

- `phaser-LICENSE.md` contains the Phaser license text from the npm package.

The default production game remains the legacy V1 canvas experience. The V2 bundle is
built from `game-src/envelope-escape/` into `assets/game/envelope-escape/runtime/`;
Phaser is included in that generated bundle from the local npm dependency. V2 is
loaded only when explicitly testing `index.html?envelopeV2=1`, or through the
compatibility entrypoint at `assets/envelope-escape-phaser.js`.
