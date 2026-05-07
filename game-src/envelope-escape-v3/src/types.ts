export type SpeciesId =
  | "ecoli"
  | "paeruginosa"
  | "saureus"
  | "spneumoniae"
  | "cglutamicum"
  | "kpneumoniae"
  | "abaumannii";

export type RunMode = "classic" | "daily";
export type RunStatus = "menu" | "briefing" | "running" | "command" | "upgrade" | "paused" | "ended";
export type CommandId = "pg" | "membrane" | "phage" | "motility";
export type StressId = "slideTraining" | "pipettePulse" | "petriBloom" | "centrifugeSweep" | "rackSeal" | "lysisStorm";
export type WorldZoneId = "microscopeSlide" | "pipetteZone" | "petriDish" | "fernbachFlask" | "centrifuge" | "tubeRack";
export type LabPropKind = "pipette" | "petriDish" | "fernbachFlask" | "centrifuge" | "tubeRack" | "microscopeSlide" | "spill" | "tipBox";
export type HazardKind = "phage" | "shock" | "crack" | "rupture" | "droplet" | "rotor" | "plaque" | "spill";
export type PickupKind = "pipetteTip" | "reagentDroplet" | "agarPlug" | "mediaBead";
export type UpgradeId =
  | "ponA-overdrive"
  | "lpoB-tether"
  | "bactoprenol-flow"
  | "omp-buffer"
  | "restriction-burst"
  | "chemoreflex"
  | "autolysin-brake"
  | "capsule-surge"
  | "mreB-alignment";

export interface Vec2 {
  x: number;
  z: number;
}

export interface Bounds {
  x: number;
  z: number;
  width: number;
  depth: number;
}

export type CollisionProxy =
  | { type: "circle"; x: number; z: number; radius: number }
  | { type: "box"; x: number; z: number; width: number; depth: number };

export interface WorldZone {
  id: WorldZoneId;
  label: string;
  shortLabel: string;
  bounds: Bounds;
  color: number;
  accent: number;
  objectiveHint: string;
}

export interface LabProp {
  id: string;
  kind: LabPropKind;
  label: string;
  zoneId: WorldZoneId;
  x: number;
  z: number;
  width: number;
  depth: number;
  height?: number;
  radius?: number;
  angle?: number;
  collision?: CollisionProxy[];
}

export interface InputState {
  moveX: number;
  moveZ: number;
  dash: boolean;
  commandWheel: boolean;
}

export interface SpeciesDefinition {
  id: SpeciesId;
  label: string;
  shortLabel: string;
  traitTitle: string;
  traitCopy: string;
  speed: number;
  dashSpeed: number;
  integrity: number;
  repairGain: number;
  commandGain: number;
  damageTaken: number;
  colorA: number;
  colorB: number;
  silhouette: "rod" | "curved" | "coccus" | "diplococcus" | "coryneform" | "capsule" | "shortRod";
}

export interface PhaseDefinition {
  id: StressId;
  title: string;
  objective: string;
  targetZone: WorldZoneId;
  startsAt: number;
  target: number;
  boss: string;
  tint: number;
  pressure: string;
}

export interface CommandDefinition {
  id: CommandId;
  label: string;
  shortLabel: string;
  copy: string;
  color: string;
}

export interface UpgradeDefinition {
  id: UpgradeId;
  title: string;
  copy: string;
  command?: CommandId;
}

export interface HazardEntity {
  id: number;
  kind: HazardKind;
  zoneId: WorldZoneId;
  x: number;
  z: number;
  vx: number;
  vz: number;
  radius: number;
  width: number;
  angle: number;
  age: number;
  telegraph: number;
  duration: number;
  damage: number;
  angularSpeed?: number;
}

export interface PickupEntity {
  id: number;
  kind: PickupKind;
  x: number;
  z: number;
  radius: number;
  age: number;
}

export interface EffectEvent {
  id: number;
  type: "dash" | "damage" | "pickup" | "command" | "phase" | "upgrade" | "lysis";
  x: number;
  z: number;
  label: string;
  age: number;
}

export interface GameState {
  status: RunStatus;
  previousStatus: RunStatus;
  mode: RunMode;
  board: string;
  playerName: string;
  selectedSpeciesId: SpeciesId;
  speciesId: SpeciesId;
  seed: number;
  elapsed: number;
  score: number;
  integrity: number;
  commandCharge: number;
  assembly: number;
  assemblyTarget: number;
  phaseIndex: number;
  phaseTime: number;
  phaseProgress: number;
  zoneId: WorldZoneId;
  upgrades: UpgradeId[];
  upgradeChoices: UpgradeId[];
  lysisCause: string;
  player: Vec2 & { vx: number; vz: number; radius: number; dashCooldown: number; dashTimer: number };
  hazards: HazardEntity[];
  pickups: PickupEntity[];
  effects: EffectEvent[];
  timers: Record<HazardKind | "pickup" | "boss", number>;
}

export interface HudSnapshot {
  status: RunStatus;
  score: number;
  timeLabel: string;
  integrity: number;
  commandCharge: number;
  phaseTitle: string;
  phasePressure: string;
  zoneLabel: string;
  objective: string;
  objectiveProgress: number;
  objectiveTarget: number;
  board: string;
  speciesLabel: string;
  upgradeCount: number;
}

export interface RunReport {
  score: number;
  speciesId: SpeciesId;
  speciesLabel: string;
  board: string;
  survived: string;
  phaseReached: string;
  lysisCause: string;
  upgrades: string[];
  completedAt: number;
}

export interface ScoreEntry {
  name: string;
  score: number;
  species: SpeciesId;
  playedAt: number;
  board: string;
}

export interface LeaderboardPayload {
  entries: ScoreEntry[];
  totalEntries: number;
  updatedAt: number;
  board: string;
  mode: "global" | "fallback" | "local";
  rank?: number;
}
