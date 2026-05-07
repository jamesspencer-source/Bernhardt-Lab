import type { CommandDefinition, LabProp, PhaseDefinition, SpeciesDefinition, SpeciesId, UpgradeDefinition, WorldZone } from "./types";

export const CHAMBER = {
  width: 120,
  depth: 70,
  safeMargin: 3.2
} as const;

export const WORLD_ZONES: WorldZone[] = [
  {
    id: "microscopeSlide",
    label: "Microscope slide staging area",
    shortLabel: "Slide",
    bounds: { x: -42, z: 22, width: 34, depth: 20 },
    color: 0x6dddec,
    accent: 0xd6fbff,
    objectiveHint: "Practice movement, then push toward the pipette zone."
  },
  {
    id: "pipetteZone",
    label: "Research Plus pipette lane",
    shortLabel: "Pipette",
    bounds: { x: -39, z: -20, width: 42, depth: 20 },
    color: 0x74dce6,
    accent: 0x2a8aa4,
    objectiveHint: "Route through droplet pulses and collect sterile tips."
  },
  {
    id: "petriDish",
    label: "Petri dish plaque assay",
    shortLabel: "Petri dish",
    bounds: { x: 11, z: -22, width: 34, depth: 26 },
    color: 0xf3c278,
    accent: 0x9c6530,
    objectiveHint: "Clear plaques before the phage bloom overtakes the agar."
  },
  {
    id: "fernbachFlask",
    label: "Fernbach flask media current",
    shortLabel: "Fernbach",
    bounds: { x: -6, z: 6, width: 30, depth: 20 },
    color: 0x9be4d8,
    accent: 0x2a786f,
    objectiveHint: "Use membrane repair to cross swirling spill currents."
  },
  {
    id: "centrifuge",
    label: "Centrifuge rotor hazard",
    shortLabel: "Centrifuge",
    bounds: { x: 42, z: 8, width: 36, depth: 28 },
    color: 0x91b7ff,
    accent: 0x3b578e,
    objectiveHint: "Time motility bursts through the rotor sweep."
  },
  {
    id: "tubeRack",
    label: "Test tube rack maze",
    shortLabel: "Tube rack",
    bounds: { x: 15, z: 26, width: 38, depth: 20 },
    color: 0xf0a8c5,
    accent: 0x7d3d58,
    objectiveHint: "Thread between tubes and seal rupture points."
  }
];

export const LAB_PROPS: LabProp[] = [
  {
    id: "slide-start",
    kind: "microscopeSlide",
    label: "Microscope slide",
    zoneId: "microscopeSlide",
    x: -44,
    z: 22,
    width: 26,
    depth: 13,
    height: 0.14
  },
  {
    id: "research-plus-pipette",
    kind: "pipette",
    label: "Oversized Research Plus pipette",
    zoneId: "pipetteZone",
    x: -42,
    z: -29,
    width: 38,
    depth: 4,
    height: 2.5,
    angle: -0.12,
    collision: [{ type: "box", x: -42, z: -29, width: 34, depth: 4.2 }]
  },
  {
    id: "sterile-tip-box",
    kind: "tipBox",
    label: "Sterile pipette tip box",
    zoneId: "pipetteZone",
    x: -22,
    z: -11,
    width: 11,
    depth: 8,
    height: 2.1,
    collision: [{ type: "box", x: -22, z: -11, width: 10.5, depth: 7.5 }]
  },
  {
    id: "plaque-assay-dish",
    kind: "petriDish",
    label: "Plaque assay petri dish",
    zoneId: "petriDish",
    x: 11,
    z: -22,
    width: 27,
    depth: 27,
    height: 0.6,
    radius: 13.5
  },
  {
    id: "fernbach-flask",
    kind: "fernbachFlask",
    label: "Fernbach flask",
    zoneId: "fernbachFlask",
    x: -7,
    z: 4,
    width: 16,
    depth: 16,
    height: 9,
    radius: 8,
    collision: [{ type: "circle", x: -7, z: 4, radius: 6.4 }]
  },
  {
    id: "media-spill",
    kind: "spill",
    label: "Media spill",
    zoneId: "fernbachFlask",
    x: 6,
    z: 10,
    width: 16,
    depth: 9,
    height: 0.08
  },
  {
    id: "bench-centrifuge",
    kind: "centrifuge",
    label: "Centrifuge rotor",
    zoneId: "centrifuge",
    x: 42,
    z: 8,
    width: 25,
    depth: 25,
    height: 4.2,
    radius: 12.5,
    collision: [{ type: "circle", x: 42, z: 8, radius: 4.2 }]
  },
  {
    id: "tube-rack",
    kind: "tubeRack",
    label: "Test tube rack",
    zoneId: "tubeRack",
    x: 15,
    z: 26,
    width: 28,
    depth: 13,
    height: 3.4,
    collision: [
      { type: "box", x: 7, z: 20, width: 4, depth: 8 },
      { type: "box", x: 15, z: 26, width: 4, depth: 8 },
      { type: "box", x: 23, z: 32, width: 4, depth: 8 }
    ]
  }
];

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
    traitCopy: "Balanced handling and faster command charging.",
    speed: 8.2,
    dashSpeed: 18,
    integrity: 100,
    repairGain: 1.08,
    commandGain: 1.12,
    damageTaken: 1,
    colorA: 0x83f1ed,
    colorB: 0x2c8392,
    silhouette: "rod"
  },
  paeruginosa: {
    id: "paeruginosa",
    label: "Pseudomonas aeruginosa",
    shortLabel: "P. aeruginosa",
    traitTitle: "Fast swimmer",
    traitCopy: "Higher speed and longer dash recovery windows.",
    speed: 9.2,
    dashSpeed: 21,
    integrity: 96,
    repairGain: 1,
    commandGain: 1,
    damageTaken: 1,
    colorA: 0x83f0c8,
    colorB: 0x246f61,
    silhouette: "curved"
  },
  saureus: {
    id: "saureus",
    label: "Staphylococcus aureus",
    shortLabel: "S. aureus",
    traitTitle: "Thick wall",
    traitCopy: "Takes less damage but moves more deliberately.",
    speed: 7.2,
    dashSpeed: 15,
    integrity: 112,
    repairGain: 1.02,
    commandGain: 1,
    damageTaken: 0.84,
    colorA: 0xffd47d,
    colorB: 0x8f5722,
    silhouette: "coccus"
  },
  spneumoniae: {
    id: "spneumoniae",
    label: "Streptococcus pneumoniae",
    shortLabel: "S. pneumoniae",
    traitTitle: "Capsule buffering",
    traitCopy: "Command use briefly buffers follow-up damage.",
    speed: 7.5,
    dashSpeed: 16,
    integrity: 106,
    repairGain: 1.16,
    commandGain: 1,
    damageTaken: 0.94,
    colorA: 0xffb7cf,
    colorB: 0x88435f,
    silhouette: "diplococcus"
  },
  cglutamicum: {
    id: "cglutamicum",
    label: "Corynebacterium glutamicum",
    shortLabel: "C. glutamicum",
    traitTitle: "Layered envelope",
    traitCopy: "Autolysin and rupture damage is less punishing.",
    speed: 7.7,
    dashSpeed: 16,
    integrity: 104,
    repairGain: 1.08,
    commandGain: 1,
    damageTaken: 0.92,
    colorA: 0xc4d1ff,
    colorB: 0x4f5aa1,
    silhouette: "coryneform"
  },
  kpneumoniae: {
    id: "kpneumoniae",
    label: "Klebsiella pneumoniae",
    shortLabel: "K. pneumoniae",
    traitTitle: "Capsule retention",
    traitCopy: "Pickups drift toward the cell from farther away.",
    speed: 7.4,
    dashSpeed: 15.5,
    integrity: 108,
    repairGain: 1.06,
    commandGain: 1,
    damageTaken: 0.96,
    colorA: 0x91eadb,
    colorB: 0x287b78,
    silhouette: "capsule"
  },
  abaumannii: {
    id: "abaumannii",
    label: "Acinetobacter baumannii",
    shortLabel: "A. baumannii",
    traitTitle: "Stress tolerant",
    traitCopy: "Near misses and survival charge commands faster.",
    speed: 8.4,
    dashSpeed: 18,
    integrity: 102,
    repairGain: 1,
    commandGain: 1.18,
    damageTaken: 0.98,
    colorA: 0x91dcff,
    colorB: 0x2b6f98,
    silhouette: "shortRod"
  }
};

export const COMMANDS: Record<string, CommandDefinition> = {
  pg: {
    id: "pg",
    label: "PG synthesis",
    shortLabel: "PG",
    copy: "Builds wall material and scores for safe routing.",
    color: "#a8ffdf"
  },
  membrane: {
    id: "membrane",
    label: "Membrane repair",
    shortLabel: "Repair",
    copy: "Restores integrity and seals rupture pressure.",
    color: "#9ee9ff"
  },
  phage: {
    id: "phage",
    label: "Phage defense",
    shortLabel: "Defense",
    copy: "Clears attached phages and weakens swarms.",
    color: "#ffd68a"
  },
  motility: {
    id: "motility",
    label: "Motility",
    shortLabel: "Motility",
    copy: "Creates a fast evasive burst through stress fronts.",
    color: "#ffc0d2"
  }
};

export const PHASES: PhaseDefinition[] = [
  {
    id: "slideTraining",
    title: "Slide calibration",
    objective: "Carry assay beads back to the slide checkpoint.",
    targetZone: "pipetteZone",
    startsAt: 0,
    target: 3,
    boss: "Microscope slide pressure pulse",
    tint: 0x0b3443,
    pressure: "Orientation"
  },
  {
    id: "pipettePulse",
    title: "Pipette pulse",
    objective: "Steal sterile tips and deposit them on the slide.",
    targetZone: "pipetteZone",
    startsAt: 30,
    target: 5,
    boss: "Timed reagent stream",
    tint: 0x173d58,
    pressure: "Droplet pressure"
  },
  {
    id: "petriBloom",
    title: "Plaque assay bloom",
    objective: "Tag plaques on the agar and purge clustered phage.",
    targetZone: "petriDish",
    startsAt: 78,
    target: 6,
    boss: "Expanding phage plaque",
    tint: 0x3d3420,
    pressure: "Phage bloom"
  },
  {
    id: "fernbachCurrent",
    title: "Fernbach current",
    objective: "Carry reagent droplets through media currents and stabilize spills.",
    targetZone: "fernbachFlask",
    startsAt: 118,
    target: 5,
    boss: "Swirling media leak",
    tint: 0x173f39,
    pressure: "Media current"
  },
  {
    id: "centrifugeSweep",
    title: "Rotor crossing",
    objective: "Cross safe pockets, collect the sample, and escape spin-up.",
    targetZone: "centrifuge",
    startsAt: 130,
    target: 4,
    boss: "Rotor sweep",
    tint: 0x27365a,
    pressure: "Mechanical shear"
  },
  {
    id: "rackSeal",
    title: "Rack rupture route",
    objective: "Navigate the rack and seal three growing rupture sites.",
    targetZone: "tubeRack",
    startsAt: 190,
    target: 3,
    boss: "Tube-rack rupture cascade",
    tint: 0x563657,
    pressure: "Wall rupture"
  },
  {
    id: "lysisStorm",
    title: "Final lysis storm",
    objective: "Chain deposits across the bench while surviving collapse.",
    targetZone: "microscopeSlide",
    startsAt: 260,
    target: 8,
    boss: "Whole-bench lysis storm",
    tint: 0x6e2e3a,
    pressure: "Lytic collapse"
  }
];

export const UPGRADES: Record<string, UpgradeDefinition> = {
  "ponA-overdrive": {
    id: "ponA-overdrive",
    title: "PBP1b overdrive",
    copy: "PG synthesis repairs more integrity and scores more during beta-lactam fronts.",
    command: "pg"
  },
  "lpoB-tether": {
    id: "lpoB-tether",
    title: "LpoB tethering",
    copy: "PG synthesis grants a brief shield after each wall cycle.",
    command: "pg"
  },
  "bactoprenol-flow": {
    id: "bactoprenol-flow",
    title: "Bactoprenol flow",
    copy: "Pickups add extra command charge and drift toward the cell.",
    command: "pg"
  },
  "omp-buffer": {
    id: "omp-buffer",
    title: "Outer-membrane buffer",
    copy: "Membrane repair reduces rupture-zone damage.",
    command: "membrane"
  },
  "restriction-burst": {
    id: "restriction-burst",
    title: "Restriction burst",
    copy: "Phage defense clears a wider area and scores for every cleared phage.",
    command: "phage"
  },
  "chemoreflex": {
    id: "chemoreflex",
    title: "Chemoreflex",
    copy: "Motility command lasts longer and dash cooldowns recover faster.",
    command: "motility"
  },
  "autolysin-brake": {
    id: "autolysin-brake",
    title: "Autolysin brake",
    copy: "Crack damage and breach growth slow after every command.",
    command: "membrane"
  },
  "capsule-surge": {
    id: "capsule-surge",
    title: "Capsule surge",
    copy: "Damage taken is lower while command charge is above half.",
    command: "membrane"
  },
  "mreB-alignment": {
    id: "mreB-alignment",
    title: "MreB alignment",
    copy: "Movement is cleaner and near misses add score.",
    command: "motility"
  }
};
