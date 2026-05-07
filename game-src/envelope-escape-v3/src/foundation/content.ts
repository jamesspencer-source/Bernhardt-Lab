import type {
  DailyProfile,
  ObjectiveDefinition,
  PhaseDefinition,
  PickupDefinition,
  PickupId,
  RadialCommandDefinition,
  RadialCommandId,
  SimulationModifiers,
  SpeciesDefinition,
  SpeciesId,
  StressEventDefinition,
  StressEventId,
  UpgradeDefinition,
  UpgradeId,
  WorldDefinition
} from "./types";

export const SIMULATION_VERSION = "envelope-escape-v3" as const;

export const WORLD: WorldDefinition = {
  width: 1600,
  depth: 900,
  safeMargin: 72,
  fixedStep: 1 / 60,
  maxDelta: 0.05,
  leaderboardLimit: 25
};

export const BASE_MODIFIERS: SimulationModifiers = {
  pickupRate: 1,
  stressRate: 1,
  phageRate: 1,
  shockRate: 1,
  crackRate: 1,
  ruptureRate: 1,
  score: 1,
  response: 1,
  repairNeeded: 5
};

export const SPECIES_ORDER: SpeciesId[] = [
  "ecoli",
  "paeruginosa",
  "saureus",
  "spneumoniae",
  "cglutamicum",
  "kpneumoniae",
  "abaumannii"
];

export const SPECIES: Record<SpeciesId, SpeciesDefinition> = {
  ecoli: {
    id: "ecoli",
    label: "Escherichia coli",
    shortLabel: "E. coli",
    traitTitle: "Envelope homeostasis",
    traitCopy: "Balanced movement, strong stress-response gain, and reliable repair cycles.",
    renderKey: "cell.ecoli",
    tint: "#8ff4f1",
    body: { kind: "capsule", radius: 24, halfHeight: 18 },
    stats: { maxIntegrity: 100, moveSpeed: 352, dashImpulse: 760, responseGain: 1.12, repairGain: 1, damageTaken: 1, pickupMagnet: 0, commandEfficiency: 1 }
  },
  paeruginosa: {
    id: "paeruginosa",
    label: "Pseudomonas aeruginosa",
    shortLabel: "P. aeruginosa",
    traitTitle: "Fast swimmer",
    traitCopy: "Higher baseline speed and dash impulse for aggressive routing through stress fronts.",
    renderKey: "cell.paeruginosa",
    tint: "#8ef4ce",
    body: { kind: "capsule", radius: 23, halfHeight: 22 },
    stats: { maxIntegrity: 96, moveSpeed: 394, dashImpulse: 850, responseGain: 1, repairGain: 1, damageTaken: 1.02, pickupMagnet: 0, commandEfficiency: 1 }
  },
  saureus: {
    id: "saureus",
    label: "Staphylococcus aureus",
    shortLabel: "S. aureus",
    traitTitle: "Thick wall",
    traitCopy: "Lower damage intake and higher max integrity, offset by deliberate acceleration.",
    renderKey: "cell.saureus",
    tint: "#ffd68a",
    body: { kind: "sphere", radius: 27 },
    stats: { maxIntegrity: 112, moveSpeed: 324, dashImpulse: 680, responseGain: 0.98, repairGain: 1.06, damageTaken: 0.86, pickupMagnet: 0, commandEfficiency: 1.02 }
  },
  spneumoniae: {
    id: "spneumoniae",
    label: "Streptococcus pneumoniae",
    shortLabel: "S. pneumoniae",
    traitTitle: "Capsule buffering",
    traitCopy: "Repair cycles restore more integrity and commands gain a small efficiency boost.",
    renderKey: "cell.spneumoniae",
    tint: "#ffbad2",
    body: { kind: "capsule", radius: 25, halfHeight: 14 },
    stats: { maxIntegrity: 106, moveSpeed: 336, dashImpulse: 720, responseGain: 1, repairGain: 1.18, damageTaken: 0.95, pickupMagnet: 8, commandEfficiency: 1.05 }
  },
  cglutamicum: {
    id: "cglutamicum",
    label: "Corynebacterium glutamicum",
    shortLabel: "C. glutamicum",
    traitTitle: "Layered envelope",
    traitCopy: "Resists crack and rupture pressure with a stable, slightly slower cell body.",
    renderKey: "cell.cglutamicum",
    tint: "#c7d6ff",
    body: { kind: "capsule", radius: 24, halfHeight: 24 },
    stats: { maxIntegrity: 108, moveSpeed: 340, dashImpulse: 710, responseGain: 1, repairGain: 1.04, damageTaken: 0.91, pickupMagnet: 0, commandEfficiency: 1 }
  },
  kpneumoniae: {
    id: "kpneumoniae",
    label: "Klebsiella pneumoniae",
    shortLabel: "K. pneumoniae",
    traitTitle: "Capsule retention",
    traitCopy: "A wide pickup magnet makes modules drift in from farther away.",
    renderKey: "cell.kpneumoniae",
    tint: "#93eadb",
    body: { kind: "capsule", radius: 27, halfHeight: 17 },
    stats: { maxIntegrity: 104, moveSpeed: 328, dashImpulse: 700, responseGain: 1, repairGain: 1.04, damageTaken: 0.98, pickupMagnet: 90, commandEfficiency: 1.02 }
  },
  abaumannii: {
    id: "abaumannii",
    label: "Acinetobacter baumannii",
    shortLabel: "A. baumannii",
    traitTitle: "Stress tolerant",
    traitCopy: "Near misses and passive survival charge radial commands faster.",
    renderKey: "cell.abaumannii",
    tint: "#92dcff",
    body: { kind: "capsule", radius: 23, halfHeight: 18 },
    stats: { maxIntegrity: 102, moveSpeed: 354, dashImpulse: 750, responseGain: 1.2, repairGain: 1, damageTaken: 0.98, pickupMagnet: 0, commandEfficiency: 1 }
  }
};

export const PICKUPS: Record<PickupId, PickupDefinition> = {
  "pg-synthase": { id: "pg-synthase", label: "PG synthase", renderKey: "pickup.pgSynthase", radius: 20, repair: 1.2, response: 14, score: 75, weight: 4 },
  "lipid-ii": { id: "lipid-ii", label: "Lipid II", renderKey: "pickup.lipidII", radius: 20, repair: 1.55, response: 12, score: 90, weight: 3 },
  "hydrolase-restraint": { id: "hydrolase-restraint", label: "Hydrolase restraint", renderKey: "pickup.hydrolaseRestraint", radius: 21, repair: 0.9, response: 20, score: 105, weight: 2 },
  "om-signal": { id: "om-signal", label: "OM stress signal", renderKey: "pickup.omSignal", radius: 18, repair: 0.55, response: 28, score: 120, weight: 1 }
};

export const OBJECTIVES: Record<ObjectiveDefinition["id"], ObjectiveDefinition> = {
  "assemble-wall": { id: "assemble-wall", title: "Assemble Wall", brief: "Collect envelope modules to finish one robust wall cycle.", targetLabel: "repair", target: 5, reward: 480 },
  "seal-breach": { id: "seal-breach", title: "Seal Breach", brief: "Complete repair while beta-lactam fronts and cracks constrain the chamber.", targetLabel: "repair cycles", target: 2, reward: 650 },
  "clear-adsorption": { id: "clear-adsorption", title: "Clear Adsorption", brief: "Evade or purge phage pressure before adsorption overwhelms the surface.", targetLabel: "phages cleared", target: 6, reward: 760 },
  "route-ruptures": { id: "route-ruptures", title: "Route Ruptures", brief: "Survive expanding rupture zones and keep the envelope above waterline.", targetLabel: "safe dodges", target: 5, reward: 900 },
  "survive-storm": { id: "survive-storm", title: "Survive Lysis Storm", brief: "Chain near misses, repairs, and radial commands through late-run collapse.", targetLabel: "near misses", target: 10, reward: 1200 }
};

export const STRESS_EVENTS: Record<StressEventId, StressEventDefinition> = {
  "beta-lactam-front": {
    id: "beta-lactam-front",
    kind: "front",
    label: "Beta-lactam front",
    telegraphSeconds: 0.95,
    activeSeconds: 7.2,
    damage: 16,
    score: 110,
    baseCount: 1,
    maxConcurrent: 4,
    radius: 42,
    speed: 240,
    renderKey: "stress.betaLactamFront",
    tint: "#8fd7ff"
  },
  "autolysin-crack": {
    id: "autolysin-crack",
    kind: "crack",
    label: "Autolysin crack",
    telegraphSeconds: 1.1,
    activeSeconds: 6.1,
    damage: 15,
    score: 125,
    baseCount: 1,
    maxConcurrent: 5,
    radius: 18,
    speed: 180,
    renderKey: "stress.autolysinCrack",
    tint: "#ffcf8a"
  },
  "phage-adsorption": {
    id: "phage-adsorption",
    kind: "seeker",
    label: "Phage adsorption",
    telegraphSeconds: 0.7,
    activeSeconds: 10.5,
    damage: 13,
    score: 95,
    baseCount: 2,
    maxConcurrent: 14,
    radius: 22,
    speed: 170,
    renderKey: "stress.phage",
    tint: "#cbb9ff"
  },
  "osmotic-rupture": {
    id: "osmotic-rupture",
    kind: "zone",
    label: "Osmotic rupture",
    telegraphSeconds: 1.2,
    activeSeconds: 4.8,
    damage: 20,
    score: 150,
    baseCount: 1,
    maxConcurrent: 5,
    radius: 72,
    speed: 58,
    renderKey: "stress.osmoticRupture",
    tint: "#ff8fa3"
  },
  "lysis-storm": {
    id: "lysis-storm",
    kind: "storm",
    label: "Lysis storm",
    telegraphSeconds: 0.85,
    activeSeconds: 4.2,
    damage: 23,
    score: 190,
    baseCount: 1,
    maxConcurrent: 6,
    radius: 92,
    speed: 72,
    renderKey: "stress.lysisStorm",
    tint: "#ff647d"
  }
};

export const PHASES: PhaseDefinition[] = [
  {
    id: "homeostasis",
    title: "Homeostatic Load",
    startsAt: 0,
    objectiveId: "assemble-wall",
    pressureLabel: "Balanced envelope stress",
    note: "Learn the chamber rhythm and build the wall.",
    tint: "#0b3443",
    scoreMultiplier: 1,
    spawnInterval: 2.7,
    stressWeights: { "phage-adsorption": 0.6, "beta-lactam-front": 0.35, "autolysin-crack": 0.2, "osmotic-rupture": 0.08 }
  },
  {
    id: "wall-siege",
    title: "Cell-Wall Siege",
    startsAt: 45,
    objectiveId: "seal-breach",
    pressureLabel: "Beta-lactam pulses and autolysin cracks",
    note: "Repair cycles matter while lane-cutting stress appears.",
    tint: "#173d58",
    scoreMultiplier: 1.12,
    spawnInterval: 2.25,
    stressWeights: { "beta-lactam-front": 1.05, "autolysin-crack": 0.82, "phage-adsorption": 0.62, "osmotic-rupture": 0.18 }
  },
  {
    id: "phage-bloom",
    title: "Phage Bloom",
    startsAt: 105,
    objectiveId: "clear-adsorption",
    pressureLabel: "Curving adsorption pressure",
    note: "Bait phages into misses or purge the swarm.",
    tint: "#254967",
    scoreMultiplier: 1.24,
    spawnInterval: 1.95,
    stressWeights: { "phage-adsorption": 1.55, "beta-lactam-front": 0.88, "autolysin-crack": 0.78, "osmotic-rupture": 0.3, "lysis-storm": 0.06 }
  },
  {
    id: "osmotic-collapse",
    title: "Osmotic Collapse",
    startsAt: 180,
    objectiveId: "route-ruptures",
    pressureLabel: "Mixed envelope failure",
    note: "Rupture zones overlap with cracks. Route early.",
    tint: "#563657",
    scoreMultiplier: 1.42,
    spawnInterval: 1.65,
    stressWeights: { "osmotic-rupture": 1.08, "phage-adsorption": 1.25, "beta-lactam-front": 0.95, "autolysin-crack": 1.05, "lysis-storm": 0.2 }
  },
  {
    id: "lysis-storm",
    title: "Lysis Storm",
    startsAt: 270,
    objectiveId: "survive-storm",
    pressureLabel: "Lytic collapse",
    note: "Late-run score chase. Every clean dodge counts.",
    tint: "#6b2e3a",
    scoreMultiplier: 1.7,
    spawnInterval: 1.25,
    stressWeights: { "lysis-storm": 0.88, "phage-adsorption": 1.45, "beta-lactam-front": 1.2, "autolysin-crack": 1.2, "osmotic-rupture": 1.1 }
  }
];

export const RADIAL_COMMANDS: Record<RadialCommandId, RadialCommandDefinition> = {
  "patch-wall": {
    id: "patch-wall",
    label: "Patch Wall",
    shortLabel: "Patch",
    description: "Restore integrity and clear nearby cracks, fronts, and rupture zones.",
    cost: 72,
    cooldown: 8.5,
    radius: 240,
    score: 180
  },
  "purge-phages": {
    id: "purge-phages",
    label: "Purge Phages",
    shortLabel: "Purge",
    description: "Clear phages across a wide radius and lower adsorption pressure briefly.",
    cost: 82,
    cooldown: 10,
    radius: 520,
    score: 170
  },
  "motility-burst": {
    id: "motility-burst",
    label: "Motility Burst",
    shortLabel: "Burst",
    description: "Gain movement speed, a dash reset, and brief invulnerability.",
    cost: 62,
    cooldown: 7.2,
    radius: 180,
    score: 150
  },
  "osmotic-brace": {
    id: "osmotic-brace",
    label: "Osmotic Brace",
    shortLabel: "Brace",
    description: "Unlockable command that reduces rupture damage and trims active zones.",
    cost: 66,
    cooldown: 9.6,
    radius: 360,
    score: 190,
    requiredUpgrade: "capsule-sheath"
  }
};

export const UPGRADES: Record<UpgradeId, UpgradeDefinition> = {
  "mesh-reinforcement": {
    id: "mesh-reinforcement",
    label: "Mesh Reinforcement",
    description: "Raises integrity and reduces incoming envelope damage.",
    maxRank: 3,
    costs: [1, 2, 3],
    effects: [
      { stat: "maxIntegrity", operation: "add", value: 10 },
      { stat: "damageTaken", operation: "multiply", value: 0.95 }
    ]
  },
  "sensor-kinase": {
    id: "sensor-kinase",
    label: "Sensor Kinase",
    description: "Charges radial commands faster from stress and module collection.",
    maxRank: 3,
    costs: [1, 2, 3],
    effects: [
      { stat: "responseGain", operation: "multiply", value: 1.11 },
      { stat: "commandEfficiency", operation: "multiply", value: 1.06 }
    ]
  },
  "capsule-sheath": {
    id: "capsule-sheath",
    label: "Capsule Sheath",
    description: "Extends pickup magnetism and unlocks Osmotic Brace.",
    maxRank: 2,
    costs: [2, 3],
    effects: [
      { stat: "pickupMagnet", operation: "add", value: 32 },
      { stat: "stressResistance", operation: "multiply", value: 1.08 }
    ],
    unlocksCommand: "osmotic-brace"
  },
  "autolysin-governor": {
    id: "autolysin-governor",
    label: "Autolysin Governor",
    description: "Makes repair cycles easier and crack damage less punishing.",
    maxRank: 2,
    costs: [2, 4],
    effects: [
      { stat: "repairNeeded", operation: "add", value: -0.45 },
      { stat: "damageTaken", operation: "multiply", value: 0.96 }
    ]
  },
  "efflux-routing": {
    id: "efflux-routing",
    label: "Efflux Routing",
    description: "Improves movement speed and dash impulse for repositioning.",
    maxRank: 3,
    costs: [1, 2, 3],
    effects: [
      { stat: "moveSpeed", operation: "multiply", value: 1.06 },
      { stat: "dashImpulse", operation: "multiply", value: 1.08 }
    ]
  },
  "division-site-focus": {
    id: "division-site-focus",
    label: "Division-Site Focus",
    description: "Improves repair gains and grants score from upgrade discipline.",
    maxRank: 3,
    costs: [1, 2, 4],
    effects: [
      { stat: "repairGain", operation: "multiply", value: 1.1 },
      { stat: "responseGain", operation: "multiply", value: 1.04 }
    ]
  }
};

export const DAILY_PROFILES: DailyProfile[] = [
  {
    id: "phage-bloom",
    name: "Phage Bloom",
    subtitle: "More phages, richer response gain, and a faster score curve.",
    modifiers: { ...BASE_MODIFIERS, phageRate: 1.34, response: 1.18, score: 1.08 }
  },
  {
    id: "beta-lactam-surge",
    name: "Beta-Lactam Surge",
    subtitle: "Dense beta-lactam fronts with slightly more repair material.",
    modifiers: { ...BASE_MODIFIERS, pickupRate: 1.12, shockRate: 1.38, score: 1.1 }
  },
  {
    id: "autolysin-breach",
    name: "Autolysin Breach",
    subtitle: "Cracks and rupture zones dominate the chamber.",
    modifiers: { ...BASE_MODIFIERS, crackRate: 1.42, ruptureRate: 1.2, score: 1.12 }
  },
  {
    id: "repair-rationing",
    name: "Repair Rationing",
    subtitle: "Scarcer modules, harder repair cycles, larger score rewards.",
    modifiers: { ...BASE_MODIFIERS, pickupRate: 0.78, repairNeeded: 6, score: 1.2, response: 1.06 }
  }
];
