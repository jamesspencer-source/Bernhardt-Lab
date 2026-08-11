window.ENVELOPE_NEXT_LEVELS = Object.freeze([
  {
    id: "ecoli",
    number: 1,
    species: "Escherichia coli",
    title: "Build the Wall",
    worldWidth: 19200,
    spawn: { x: 240, y: 610 },
    goalX: 18920,
    palette: {
      membrane: 0x4fd4df,
      membraneLight: 0xa4f7f1,
      cytoplasm: 0x0c3c63,
      precursor: 0x70efc2,
      danger: 0xff6173,
      route: 0xffd166
    },
    zones: [
      {
        start: 0,
        name: "Assembly Line",
        mechanic: "Collect Lipid II and settle into the movement rhythm."
      },
      {
        start: 3000,
        name: "Periplasm Traverse",
        mechanic: "Climb membrane lifts without losing momentum."
      },
      {
        start: 6200,
        name: "Beta-lactam Pulse",
        mechanic: "Red antibiotic pulses telegraph before they strike."
      },
      {
        start: 9400,
        name: "Repair Relay",
        mechanic: "Choose a fast upper route or a safer lower route."
      },
      {
        start: 12700,
        name: "Phage Breach",
        mechanic: "Keep moving while phage particles sweep the corridor."
      },
      {
        start: 15900,
        name: "Division Sprint",
        mechanic: "Chain jumps and carry the strongest wall to the gate."
      }
    ],
    ground: [
      [0, 3650],
      [3830, 5230],
      [5410, 7040],
      [7220, 8740],
      [8940, 10580],
      [10780, 12580],
      [12780, 14420],
      [14610, 16080],
      [16260, 17680],
      [17860, 19200]
    ],
    platforms: [
      [760, 620, 250],
      [1100, 530, 210],
      [1440, 610, 260],
      [2320, 610, 230],
      [2660, 520, 230],
      [3000, 430, 260],
      [3380, 540, 280],
      [3970, 610, 240],
      [4320, 510, 220],
      [4660, 420, 240],
      [5020, 520, 260],
      [5660, 600, 260],
      [6020, 500, 230],
      [6420, 590, 250],
      [6780, 480, 220],
      [7440, 600, 250],
      [7800, 500, 220],
      [8140, 400, 240],
      [8500, 520, 260],
      [9180, 610, 260],
      [9520, 500, 220],
      [9860, 390, 240],
      [10220, 500, 260],
      [11020, 610, 250],
      [11360, 510, 230],
      [11720, 410, 230],
      [12080, 510, 260],
      [13100, 610, 250],
      [13460, 500, 220],
      [13820, 400, 240],
      [14180, 510, 250],
      [14920, 610, 250],
      [15280, 500, 220],
      [15620, 410, 230],
      [16520, 610, 240],
      [16860, 500, 220],
      [17220, 400, 240],
      [17560, 520, 250],
      [18120, 610, 240],
      [18460, 510, 220],
      [18780, 420, 250]
    ],
    movingPlatforms: [
      { x: 4100, y: 470, width: 220, axis: "y", distance: 170, speed: 92 },
      { x: 4860, y: 590, width: 220, axis: "x", distance: 180, speed: 86 },
      { x: 8000, y: 570, width: 220, axis: "y", distance: 190, speed: 102 },
      { x: 13640, y: 580, width: 220, axis: "y", distance: 180, speed: 96 },
      { x: 17040, y: 590, width: 220, axis: "x", distance: 170, speed: 105 }
    ],
    checkpoints: [3200, 6400, 9600, 12800, 16000],
    antibiotics: [
      [1740, 690],
      [2490, 690],
      [3560, 690],
      [5740, 550],
      [6660, 690],
      [6980, 690],
      [7520, 550],
      [8440, 690],
      [9300, 690],
      [10060, 450],
      [11120, 690],
      [12380, 690],
      [13280, 560],
      [14060, 690],
      [15080, 690],
      [15740, 690],
      [16620, 560],
      [17440, 690],
      [18220, 560]
    ],
    autolysins: [
      { x: 5900, y: 625, distance: 260, speed: 115 },
      { x: 9000, y: 610, distance: 220, speed: 125 },
      { x: 11550, y: 610, distance: 300, speed: 135 },
      { x: 14680, y: 610, distance: 250, speed: 145 },
      { x: 17920, y: 610, distance: 240, speed: 155 }
    ],
    labels: [
      { x: 720, y: 490, title: "LIPID II", subtitle: "COLLECT", tone: "good" },
      { x: 1660, y: 570, title: "AMPICILLIN", subtitle: "AVOID", tone: "danger" },
      { x: 3050, y: 285, title: "CHECKPOINT", subtitle: "TOUCH THE GOLD BEACON", tone: "route" },
      { x: 6210, y: 270, title: "BETA-LACTAM PULSE", subtitle: "WATCH FOR THE RED TARGET", tone: "danger" },
      { x: 12720, y: 270, title: "PHAGE BREACH", subtitle: "KEEP MOVING", tone: "danger" },
      { x: 17780, y: 270, title: "DIVISION GATE", subtitle: "FINAL SPRINT", tone: "route" }
    ]
  }
]);
