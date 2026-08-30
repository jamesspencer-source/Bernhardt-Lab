(() => {
  "use strict";

  const level = {
    id: "ecoli-envelope-run",
    number: 1,
    species: "Escherichia coli",
    title: "The Cross-Link Run",
    worldWidth: 24200,
    goalX: 23820,
    spawnX: 420,
    floorY: 590,
    baseSpeed: 320,
    maxSpeed: 535,
    zones: [
      { start: 0, name: "Calibration Lane", mechanic: "Green builds. Coral damages. Learn jump, then duck." },
      { start: 4500, name: "Cross-Link Rhythm", mechanic: "Chain precursors across capsules and short wall gaps." },
      { start: 9500, name: "Autolysin Corridor", mechanic: "Read each coral silhouette: jump low, duck high." },
      { start: 14500, name: "PBP Split", mechanic: "Take the raised gold route for a larger bonus." },
      { start: 19500, name: "Pressure Sprint", mechanic: "The assay accelerates. Protect the envelope to the gate." }
    ],
    gaps: [
      { x: 5200, width: 210 },
      { x: 10820, width: 238 },
      { x: 17420, width: 248 },
      { x: 21620, width: 262 }
    ],
    platforms: [
      { x: 15240, y: 500, width: 1500, kind: "pbp-route" }
    ],
    hazards: [
      { type: "antibiotic", x: 1600, coach: "jump" },
      { type: "autolysin", x: 3020, coach: "duck" },
      { type: "antibiotic", x: 4100 },
      { type: "antibiotic", x: 6350 },
      { type: "antibiotic", x: 6510 },
      { type: "autolysin", x: 7600 },
      { type: "antibiotic", x: 8700 },
      { type: "antibiotic", x: 9780 },
      { type: "autolysin", x: 10320 },
      { type: "antibiotic", x: 11640 },
      { type: "autolysin", x: 12480 },
      { type: "antibiotic", x: 13280 },
      { type: "antibiotic", x: 13430 },
      { type: "autolysin", x: 14980, route: "lower" },
      { type: "antibiotic", x: 15520, route: "lower" },
      { type: "autolysin", x: 16520 },
      { type: "antibiotic", x: 16980 },
      { type: "antibiotic", x: 18440 },
      { type: "autolysin", x: 18940 },
      { type: "antibiotic", x: 19820 },
      { type: "antibiotic", x: 19970 },
      { type: "autolysin", x: 20500 },
      { type: "antibiotic", x: 21020 },
      { type: "autolysin", x: 22460 },
      { type: "antibiotic", x: 22980 }
    ],
    tokenRuns: [
      { shape: "arc", x: 1420, count: 5, spacing: 78, lift: 92 },
      { shape: "low", x: 2860, count: 5, spacing: 72 },
      { shape: "arc", x: 3920, count: 5, spacing: 78, lift: 86 },
      { shape: "gap", x: 4930, count: 7, spacing: 82, lift: 118 },
      { shape: "arc", x: 6180, count: 7, spacing: 76, lift: 96 },
      { shape: "low", x: 7440, count: 5, spacing: 72 },
      { shape: "arc", x: 8520, count: 5, spacing: 78, lift: 92 },
      { shape: "wave", x: 9580, count: 11, spacing: 78, lift: 88 },
      { shape: "gap", x: 10530, count: 7, spacing: 82, lift: 122 },
      { shape: "arc", x: 11460, count: 5, spacing: 78, lift: 90 },
      { shape: "low", x: 12320, count: 5, spacing: 72 },
      { shape: "arc", x: 13100, count: 7, spacing: 76, lift: 94 },
      { shape: "platform", x: 14620, count: 11, spacing: 120, y: 458, bonus: true },
      { shape: "wave", x: 16320, count: 9, spacing: 80, lift: 86 },
      { shape: "gap", x: 17120, count: 8, spacing: 80, lift: 124 },
      { shape: "wave", x: 18220, count: 11, spacing: 78, lift: 94 },
      { shape: "arc", x: 19620, count: 7, spacing: 75, lift: 96 },
      { shape: "low", x: 20340, count: 5, spacing: 70 },
      { shape: "gap", x: 21290, count: 9, spacing: 78, lift: 128 },
      { shape: "wave", x: 22250, count: 11, spacing: 76, lift: 96 }
    ],
    pbpBonuses: [
      { x: 14880, y: 455 },
      { x: 15340, y: 455 },
      { x: 15800, y: 455 }
    ],
    checkpoints: [4800, 9400, 14300, 19300, 21950]
  };

  window.ENVELOPE_RUNNER_LEVEL = Object.freeze(level);
})();
