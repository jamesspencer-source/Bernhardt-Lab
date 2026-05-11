import type {
  DailyProfile,
  ObjectiveDefinition,
  PhaseDefinition,
  PickupDefinition,
  ResponseDefinition,
  SpeciesDefinition,
  SpeciesId,
  ZoneDefinition
} from "./types";

export const WORLD = {
  width: 3200,
  height: 1800,
  viewWidth: 1600,
  viewHeight: 900,
  safeMargin: 96,
  maxLeaderboardScore: 2000000000
} as const;

export const ZONES: ZoneDefinition[] = [
  { id: "slide", label: "Microscope slide safe zone", x: 170, y: 1035, width: 710, height: 560, safe: true },
  { id: "pipette", label: "Pipette droplet lanes", x: 190, y: 170, width: 1110, height: 430 },
  { id: "petri", label: "Petri plaque field", x: 1375, y: 150, width: 760, height: 665 },
  { id: "flask", label: "Fernbach media currents", x: 2250, y: 185, width: 710, height: 700 },
  { id: "centrifuge", label: "Centrifuge rotor hazard", x: 2050, y: 1010, width: 840, height: 560 },
  { id: "rack", label: "Test-tube rack chokepoint", x: 1020, y: 1035, width: 850, height: 540 }
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
    sheet: "cell-ecoli",
    traitTitle: "Envelope homeostasis",
    traitCopy: "Balanced handling and faster response charging from envelope modules.",
    speed: 352,
    dashSpeed: 760,
    responseGain: 1.12,
    damageTaken: 1,
    pickupMagnet: 0,
    repairBonus: 2,
    color: "#8ff4f1"
  },
  paeruginosa: {
    id: "paeruginosa",
    label: "Pseudomonas aeruginosa",
    shortLabel: "P. aeruginosa",
    sheet: "cell-paeruginosa",
    traitTitle: "Fast swimmer",
    traitCopy: "Higher speed and dash distance make lane changes easier.",
    speed: 394,
    dashSpeed: 850,
    responseGain: 1,
    damageTaken: 1,
    pickupMagnet: 0,
    repairBonus: 0,
    color: "#8ef4ce"
  },
  saureus: {
    id: "saureus",
    label: "Staphylococcus aureus",
    shortLabel: "S. aureus",
    sheet: "cell-saureus",
    traitTitle: "Thick wall",
    traitCopy: "Takes less damage but accelerates more deliberately.",
    speed: 324,
    dashSpeed: 680,
    responseGain: 1,
    damageTaken: 0.86,
    pickupMagnet: 0,
    repairBonus: 1,
    color: "#ffd68a"
  },
  spneumoniae: {
    id: "spneumoniae",
    label: "Streptococcus pneumoniae",
    shortLabel: "S. pneumoniae",
    sheet: "cell-spneumoniae",
    traitTitle: "Capsule buffering",
    traitCopy: "Repair cycles grant a stronger recovery pulse.",
    speed: 336,
    dashSpeed: 720,
    responseGain: 1,
    damageTaken: 0.96,
    pickupMagnet: 0,
    repairBonus: 6,
    color: "#ffbad2"
  },
  cglutamicum: {
    id: "cglutamicum",
    label: "Corynebacterium glutamicum",
    shortLabel: "C. glutamicum",
    sheet: "cell-cglutamicum",
    traitTitle: "Layered envelope",
    traitCopy: "Autolysin cracks and rupture zones are less punishing.",
    speed: 340,
    dashSpeed: 710,
    responseGain: 1,
    damageTaken: 0.96,
    ruptureDamageTaken: 0.72,
    pickupMagnet: 0,
    repairBonus: 1,
    color: "#c7d6ff"
  },
  kpneumoniae: {
    id: "kpneumoniae",
    label: "Klebsiella pneumoniae",
    shortLabel: "K. pneumoniae",
    sheet: "cell-kpneumoniae",
    traitTitle: "Capsule retention",
    traitCopy: "Envelope modules drift toward the cell from farther away.",
    speed: 328,
    dashSpeed: 700,
    responseGain: 1,
    damageTaken: 0.98,
    pickupMagnet: 94,
    repairBonus: 2,
    color: "#93eadb"
  },
  abaumannii: {
    id: "abaumannii",
    label: "Acinetobacter baumannii",
    shortLabel: "A. baumannii",
    sheet: "cell-abaumannii",
    traitTitle: "Stress tolerant",
    traitCopy: "Survival and near misses charge the response meter faster.",
    speed: 354,
    dashSpeed: 750,
    responseGain: 1.18,
    damageTaken: 0.98,
    pickupMagnet: 0,
    repairBonus: 1,
    color: "#92dcff"
  }
};

export const PICKUPS: Record<string, PickupDefinition> = {
  pg: { id: "pg", label: "PG building block", sheet: "pickup-pg", repair: 1, response: 16, score: 70 },
  lipid: { id: "lipid", label: "Lipid II precursor", sheet: "pickup-lipid", repair: 2, response: 14, score: 85 },
  restraint: { id: "restraint", label: "Hydrolase restraint", sheet: "pickup-restraint", repair: 1, response: 21, score: 90 },
  repair: { id: "repair", label: "Membrane patch droplet", sheet: "pickup-repair", repair: 2, response: 18, score: 95 }
};

export const RESPONSES: Record<string, ResponseDefinition> = {
  patch: { id: "patch", label: "Patch Wall", shortLabel: "Patch", icon: "response-patch", copy: "Restore integrity and blunt rupture damage.", color: "#b8ffdf" },
  repair: { id: "repair", label: "Membrane Repair", shortLabel: "Repair", icon: "response-repair", copy: "Stabilize spill zones and shock fronts.", color: "#90e9ff" },
  purge: { id: "purge", label: "Purge Phages", shortLabel: "Purge", icon: "response-purge", copy: "Clear nearby phages and plaque pressure.", color: "#bbecff" },
  boost: { id: "boost", label: "Boost Motility", shortLabel: "Boost", icon: "response-boost", copy: "Gain a burst of movement and brief invulnerability.", color: "#ffe1a3" }
};

export const OBJECTIVES: Record<string, ObjectiveDefinition> = {
  assemble: { id: "assemble", title: "Assemble Wall", brief: "Collect enough PG and Lipid II modules to complete a wall cycle.", targetLabel: "modules", target: 5, reward: 420 },
  breach: { id: "breach", title: "Seal Breach", brief: "Survive autolysin crack patterns and finish one assembly cycle.", targetLabel: "cycles", target: 1, reward: 560 },
  adsorption: { id: "adsorption", title: "Clear Adsorption", brief: "Evade or purge phage pressure before the swarm tightens.", targetLabel: "phages cleared", target: 5, reward: 640 },
  rupture: { id: "rupture", title: "Rupture Alarm", brief: "Relocate through expanding osmotic rupture zones.", targetLabel: "safe dodges", target: 4, reward: 760 },
  storm: { id: "storm", title: "Lysis Storm", brief: "Score-chase survival. Every clean dodge matters.", targetLabel: "near misses", target: 8, reward: 980 }
};

export const PHASES: PhaseDefinition[] = [
  { id: "calibration", start: 0, title: "Bench Calibration", objectiveId: "assemble", note: "Collect precursors, learn safe routes, and keep moving.", pressure: "Low stress", tint: 0x0b3443, rates: { pickup: 1.2, phage: 0.42, shock: 0.28, crack: 0.16, rupture: 0.06, storm: 0 } },
  { id: "droplet", start: 38, title: "Droplet Pressure", objectiveId: "assemble", note: "Pipette streams begin cutting lanes across the bench.", pressure: "Droplet lanes", tint: 0x123a4a, rates: { pickup: 1.08, phage: 0.56, shock: 0.82, crack: 0.28, rupture: 0.12, storm: 0 } },
  { id: "phage", start: 88, title: "Phage Bloom", objectiveId: "adsorption", note: "Plaques expand near the dish and phages begin curving in.", pressure: "Phage bloom", tint: 0x254967, rates: { pickup: 1, phage: 1.2, shock: 0.82, crack: 0.46, rupture: 0.3, storm: 0.02 } },
  { id: "antibiotic", start: 146, title: "Antibiotic Shock", objectiveId: "breach", note: "Shock fronts and rupture sites overlap across routes.", pressure: "Antibiotic fronts", tint: 0x173d58, rates: { pickup: 0.98, phage: 1.16, shock: 1.16, crack: 0.82, rupture: 0.48, storm: 0.08 } },
  { id: "rotor", start: 214, title: "Rotor Chaos", objectiveId: "rupture", note: "Centrifuge sweeps punish straight-line escapes.", pressure: "Rotor sweep", tint: 0x563657, rates: { pickup: 0.92, phage: 1.28, shock: 1.26, crack: 1.08, rupture: 0.84, storm: 0.18 } },
  { id: "lysis", start: 292, title: "Final Lysis Storm", objectiveId: "storm", note: "All stress patterns combine. Chain near misses and responses.", pressure: "Lytic collapse", tint: 0x6b2e3a, rates: { pickup: 0.88, phage: 1.52, shock: 1.36, crack: 1.32, rupture: 1.06, storm: 0.56 } }
];

export const DAILY_PROFILES: DailyProfile[] = [
  { id: "phage-bloom", name: "Phage Bloom", subtitle: "More phages and richer response gain.", modifiers: { pickup: 1.08, phage: 1.34, shock: 0.92, crack: 0.96, rupture: 0.92, storm: 1, response: 1.18, score: 1.08, repairNeeded: 4 } },
  { id: "beta-lactam-surge", name: "Beta-Lactam Surge", subtitle: "Denser antibiotic fronts with slightly more modules.", modifiers: { pickup: 1.14, phage: 0.96, shock: 1.36, crack: 0.96, rupture: 0.94, storm: 1, response: 1, score: 1.1, repairNeeded: 4 } },
  { id: "autolysin-breach", name: "Autolysin Breach", subtitle: "More cracks and rupture zones. Positioning matters.", modifiers: { pickup: 1.04, phage: 0.98, shock: 1.02, crack: 1.42, rupture: 1.24, storm: 1.08, response: 1, score: 1.12, repairNeeded: 4 } },
  { id: "repair-rationing", name: "Repair Rationing", subtitle: "Scarcer modules, larger score rewards.", modifiers: { pickup: 0.78, phage: 1.08, shock: 1.06, crack: 1.06, rupture: 1.08, storm: 1.04, response: 1.06, score: 1.18, repairNeeded: 5 } }
];
