import type { CommandDefinition, PhaseDefinition, SpeciesDefinition, SpeciesId, UpgradeDefinition } from "./types";

export const CHAMBER = {
  width: 34,
  depth: 20,
  safeMargin: 1.2
} as const;

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
    id: "homeostasis",
    title: "Homeostasis",
    objective: "Collect envelope modules and complete the first wall cycle.",
    startsAt: 0,
    target: 5,
    boss: "Tutorialized pressure pulse",
    tint: 0x0b3443,
    pressure: "Balanced load"
  },
  {
    id: "betaLactam",
    title: "Beta-lactam front",
    objective: "Read lane telegraphs and command PG synthesis at the right moment.",
    startsAt: 38,
    target: 6,
    boss: "Cross-chamber antibiotic sweep",
    tint: 0x173d58,
    pressure: "Antibiotic shock"
  },
  {
    id: "phageBloom",
    title: "Phage bloom",
    objective: "Bait adsorption arcs, then purge the bloom.",
    startsAt: 84,
    target: 7,
    boss: "Orbiting phage rosette",
    tint: 0x254967,
    pressure: "Adsorption swarm"
  },
  {
    id: "autolysin",
    title: "Autolysin breach",
    objective: "Seal jagged cracks before they cross the chamber.",
    startsAt: 135,
    target: 8,
    boss: "Branching breach pattern",
    tint: 0x563657,
    pressure: "Wall hydrolysis"
  },
  {
    id: "rupture",
    title: "Rupture cascade",
    objective: "Relocate through expanding pressure zones.",
    startsAt: 190,
    target: 9,
    boss: "Osmotic rupture cascade",
    tint: 0x62334b,
    pressure: "Osmotic failure"
  },
  {
    id: "lysis",
    title: "Final lysis storm",
    objective: "Chain commands and survive for score.",
    startsAt: 250,
    target: 12,
    boss: "Full chamber collapse",
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
