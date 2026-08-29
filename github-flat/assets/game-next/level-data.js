window.ENVELOPE_NEXT_LEVELS = Object.freeze([
  {
    id: "ecoli",
    number: 1,
    species: "Escherichia coli",
    title: "Build the Way",
    worldWidth: 12600,
    spawn: { x: 260, y: 625 },
    goalX: 12160,
    pressureStartsAt: 8060,
    palette: {
      membrane: 0x45d6e6,
      membraneLight: 0xb9fbff,
      cytoplasm: 0x082d4a,
      precursor: 0x61f0a9,
      danger: 0xf24f61,
      route: 0xf5c965
    },
    zones: [
      {
        start: 0,
        name: "Build the Way",
        mechanic: "Collect three green PG precursors to assemble the missing bridge."
      },
      {
        start: 2450,
        name: "PBP Fork",
        mechanic: "The cyan PBP route is faster. The lower route is steadier."
      },
      {
        start: 5420,
        name: "Autolysin Works",
        mechanic: "Time your jumps past the red wall-cutting enzymes."
      },
      {
        start: 8200,
        name: "Pressure Front",
        mechanic: "Keep moving. The antibiotic pressure front is closing in."
      },
      {
        start: 10880,
        name: "Final Cross-Link",
        mechanic: "Build the last span and reach the gold PBP gate."
      }
    ],
    ground: [
      [0, 1840],
      [2400, 4860],
      [5410, 7600],
      [8190, 10380],
      [11010, 12600]
    ],
    platforms: [
      { x: 720, y: 620, width: 250 },
      { x: 1180, y: 555, width: 240 },
      { x: 1600, y: 640, width: 250 },
      { x: 2820, y: 635, width: 290 },
      { x: 3290, y: 585, width: 260 },
      { x: 3890, y: 635, width: 300 },
      { x: 4480, y: 570, width: 250 },
      { x: 5700, y: 630, width: 270 },
      { x: 6230, y: 525, width: 250 },
      { x: 6810, y: 625, width: 280 },
      { x: 7320, y: 540, width: 230 },
      { x: 8490, y: 630, width: 260 },
      { x: 9020, y: 535, width: 240 },
      { x: 9580, y: 625, width: 280 },
      { x: 10080, y: 525, width: 230 },
      { x: 11310, y: 620, width: 260 },
      { x: 11720, y: 515, width: 230 }
    ],
    movingPlatforms: [
      { x: 2920, y: 480, width: 250, axis: "y", distance: 90, speed: 70 },
      { x: 3550, y: 390, width: 250, axis: "x", distance: 160, speed: 86 },
      { x: 4240, y: 475, width: 250, axis: "y", distance: 105, speed: 78 },
      { x: 6480, y: 395, width: 235, axis: "x", distance: 150, speed: 92 },
      { x: 9300, y: 390, width: 235, axis: "y", distance: 115, speed: 92 },
      { x: 11480, y: 400, width: 250, axis: "x", distance: 160, speed: 100 }
    ],
    bridges: [
      { x: 2120, y: 770, width: 560 },
      { x: 5135, y: 770, width: 550 },
      { x: 7895, y: 770, width: 590 },
      { x: 10695, y: 770, width: 630 }
    ],
    pickups: [
      { x: 600, y: 675, bridge: 0 },
      { x: 1080, y: 675, bridge: 0 },
      { x: 1570, y: 675, bridge: 0 },
      { x: 2760, y: 680, bridge: 1 },
      { x: 3360, y: 680, bridge: 1 },
      { x: 4260, y: 680, bridge: 1 },
      { x: 2910, y: 415, bridge: 1, bonus: true },
      { x: 3570, y: 320, bridge: 1, bonus: true },
      { x: 4240, y: 400, bridge: 1, bonus: true },
      { x: 4580, y: 680, bridge: 1 },
      { x: 5670, y: 680, bridge: 2 },
      { x: 6250, y: 680, bridge: 2 },
      { x: 6890, y: 680, bridge: 2 },
      { x: 7450, y: 680, bridge: 2 },
      { x: 6420, y: 455, bridge: 2, bonus: true },
      { x: 7260, y: 470, bridge: 2, bonus: true },
      { x: 8480, y: 680, bridge: 3 },
      { x: 9150, y: 680, bridge: 3 },
      { x: 9800, y: 680, bridge: 3 },
      { x: 10150, y: 680, bridge: 3 },
      { x: 9230, y: 455, bridge: 3, bonus: true },
      { x: 10020, y: 455, bridge: 3, bonus: true }
    ],
    antibiotics: [
      { x: 2600, y: 700 },
      { x: 3160, y: 700 },
      { x: 4050, y: 700 },
      { x: 5840, y: 700 },
      { x: 7060, y: 700 },
      { x: 8680, y: 700 },
      { x: 9720, y: 700 },
      { x: 11550, y: 700 }
    ],
    autolysins: [
      { x: 6020, y: 665, distance: 190, speed: 105 },
      { x: 6750, y: 570, distance: 170, speed: 118 },
      { x: 7350, y: 655, distance: 150, speed: 128 }
    ],
    checkpoints: [5410, 8190, 11010]
  }
]);
