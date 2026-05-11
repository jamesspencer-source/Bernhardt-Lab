export type SpeciesId =
  | "ecoli"
  | "paeruginosa"
  | "saureus"
  | "spneumoniae"
  | "cglutamicum"
  | "kpneumoniae"
  | "abaumannii";

export type PickupId = "pg" | "lipid" | "restraint" | "repair";
export type ResponseId = "patch" | "repair" | "purge" | "boost";
export type HazardKind = "phage" | "shock" | "crack" | "rupture" | "storm";
export type RunMode = "classic" | "daily";
export type RunStatus = "menu" | "running" | "paused" | "ended";
export type ObjectiveId = "assemble" | "breach" | "adsorption" | "rupture" | "storm";
export type ZoneId = "slide" | "pipette" | "petri" | "flask" | "centrifuge" | "rack";

export interface SpeciesDefinition {
  id: SpeciesId;
  label: string;
  shortLabel: string;
  sheet: string;
  traitTitle: string;
  traitCopy: string;
  speed: number;
  dashSpeed: number;
  responseGain: number;
  damageTaken: number;
  ruptureDamageTaken?: number;
  pickupMagnet: number;
  repairBonus: number;
  color: string;
}

export interface PickupDefinition {
  id: PickupId;
  label: string;
  sheet: string;
  repair: number;
  response: number;
  score: number;
}

export interface ResponseDefinition {
  id: ResponseId;
  label: string;
  shortLabel: string;
  icon: string;
  copy: string;
  color: string;
}

export interface PhaseDefinition {
  id: string;
  start: number;
  title: string;
  objectiveId: ObjectiveId;
  note: string;
  pressure: string;
  tint: number;
  rates: Record<"pickup" | HazardKind, number>;
}

export interface ZoneDefinition {
  id: ZoneId;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  safe?: boolean;
}

export interface ObjectiveDefinition {
  id: ObjectiveId;
  title: string;
  brief: string;
  targetLabel: string;
  target: number;
  reward: number;
}

export interface DailyProfile {
  id: string;
  name: string;
  subtitle: string;
  modifiers: ModeModifiers;
}

export interface ModeModifiers {
  pickup: number;
  phage: number;
  shock: number;
  crack: number;
  rupture: number;
  storm: number;
  response: number;
  score: number;
  repairNeeded: number;
}

export interface DailyChallenge {
  dateKey: string;
  board: string;
  profile: DailyProfile;
  speciesId: SpeciesId;
}

export interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  dash: boolean;
  pointerActive: boolean;
  pointerX: number;
  pointerY: number;
}

export interface PlayerState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  radius: number;
}

export interface PickupEntity {
  id: string;
  type: PickupId;
  x: number;
  y: number;
  radius: number;
  age: number;
}

export interface PhageEntity {
  id: string;
  kind: "phage";
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  speed: number;
  warning: number;
  age: number;
  nearMiss: boolean;
  attachTimer: number;
}

export interface ShockEntity {
  id: string;
  kind: "shock";
  variant: "antibiotic" | "droplet" | "rotor";
  axis: "x" | "y";
  position: number;
  velocity: number;
  thickness: number;
  spanStart: number;
  spanEnd: number;
  warning: number;
}

export interface CrackEntity {
  id: string;
  kind: "crack";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  vx: number;
  vy: number;
  width: number;
  warning: number;
  life: number;
}

export interface RuptureEntity {
  id: string;
  kind: "rupture" | "storm";
  variant: "rupture" | "plaque" | "spill" | "storm";
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  warning: number;
  life: number;
  hit: boolean;
}

export interface EntityStore {
  pickups: PickupEntity[];
  phages: PhageEntity[];
  shocks: ShockEntity[];
  cracks: CrackEntity[];
  ruptures: RuptureEntity[];
  storms: RuptureEntity[];
}

export interface ObjectiveState {
  id: ObjectiveId;
  title: string;
  brief: string;
  targetLabel: string;
  target: number;
  reward: number;
  progress: number;
  completed: boolean;
  timeInObjective: number;
}

export interface GameEvent {
  type:
    | "run-start"
    | "phase"
    | "objective"
    | "objective-complete"
    | "pickup"
    | "assembly"
    | "response"
    | "damage"
    | "near-miss"
    | "dash"
    | "end";
  x?: number;
  y?: number;
  label?: string;
  choice?: ResponseId;
  cause?: string;
  damage?: number;
  cleared?: number;
  title?: string;
  copy?: string;
}

export interface GameState {
  status: RunStatus;
  mode: RunMode;
  board: string;
  boardLabel: string;
  playerName: string;
  selectedSpeciesId: SpeciesId;
  speciesId: SpeciesId;
  dailyChallenge: DailyChallenge;
  runSeed: number;
  rng: () => number;
  elapsed: number;
  score: number;
  integrity: number;
  repairProgress: number;
  repairNeeded: number;
  responseCharge: number;
  assemblyCycles: number;
  dashCooldown: number;
  dashTimer: number;
  boostTimer: number;
  invulnerableTimer: number;
  pressureReliefTimer: number;
  phaseIndex: number;
  objective: ObjectiveState;
  zoneId: ZoneId;
  nearMissChain: number;
  lysisCause: string;
  lastEvents: GameEvent[];
  player: PlayerState;
  spawnTimers: Record<"pickup" | HazardKind | "pattern", number>;
  entities: EntityStore;
}

export interface HudSnapshot {
  status: RunStatus;
  board: string;
  boardLabel: string;
  speciesId: SpeciesId;
  speciesLabel: string;
  traitTitle: string;
  traitCopy: string;
  score: number;
  timeLabel: string;
  integrity: number;
  repairProgress: number;
  repairNeeded: number;
  responseCharge: number;
  dashCooldown: number;
  phaseTitle: string;
  phaseNote: string;
  pressure: string;
  zoneLabel: string;
  objectiveTitle: string;
  objectiveBrief: string;
  objectiveProgress: number;
  objectiveTarget: number;
  objectiveTargetLabel: string;
  assemblyCycles: number;
  dailyChallenge: DailyChallenge;
  responseReady: boolean;
}

export interface RunReport {
  score: number;
  speciesId: SpeciesId;
  speciesLabel: string;
  board: string;
  boardLabel: string;
  survived: string;
  phaseReached: string;
  objectiveTitle: string;
  zoneLabel: string;
  assemblyCycles: number;
  lysisCause: string;
  placement?: { rank?: number; mode?: string; totalEntries?: number } | null;
}

export interface ScoreEntry {
  name: string;
  score: number;
  species: SpeciesId;
  playedAt: number;
  board: string;
}

export interface LeaderboardPayload {
  mode: "global" | "local" | "fallback";
  ok?: boolean;
  entries: ScoreEntry[];
  rank?: number;
  totalEntries: number;
  updatedAt: number;
  board: string;
}
