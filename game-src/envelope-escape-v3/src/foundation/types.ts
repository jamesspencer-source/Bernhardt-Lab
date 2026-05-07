export type RunMode = "classic" | "daily" | "seeded";
export type RunStatus = "idle" | "running" | "paused" | "ended";

export type SpeciesId =
  | "ecoli"
  | "paeruginosa"
  | "saureus"
  | "spneumoniae"
  | "cglutamicum"
  | "kpneumoniae"
  | "abaumannii";

export type PhaseId = "homeostasis" | "wall-siege" | "phage-bloom" | "osmotic-collapse" | "lysis-storm";
export type ObjectiveId = "assemble-wall" | "seal-breach" | "clear-adsorption" | "route-ruptures" | "survive-storm";
export type PickupId = "pg-synthase" | "lipid-ii" | "hydrolase-restraint" | "om-signal";
export type StressEventId = "beta-lactam-front" | "autolysin-crack" | "phage-adsorption" | "osmotic-rupture" | "lysis-storm";
export type StressEventKind = "front" | "crack" | "seeker" | "zone" | "storm";
export type RadialCommandId = "patch-wall" | "purge-phages" | "motility-burst" | "osmotic-brace";
export type UpgradeId =
  | "mesh-reinforcement"
  | "sensor-kinase"
  | "capsule-sheath"
  | "autolysin-governor"
  | "efflux-routing"
  | "division-site-focus";

export type ScoreReason =
  | "survival"
  | "pickup"
  | "repair-cycle"
  | "objective"
  | "near-miss"
  | "stress-cleared"
  | "command"
  | "upgrade"
  | "damage-penalty";

export interface Vec2 {
  x: number;
  y: number;
}

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface TransformSnapshot {
  position: Vec3;
  rotation: Vec3;
  scale: Vec3;
}

export type ColliderShape =
  | { kind: "sphere"; radius: number }
  | { kind: "capsule"; radius: number; halfHeight: number }
  | { kind: "cuboid"; halfExtents: Vec3 }
  | { kind: "segment"; a: Vec3; b: Vec3; radius: number };

export interface PhysicsSnapshot {
  bodyKind: "dynamic" | "kinematic" | "fixed" | "sensor";
  collider: ColliderShape;
  collisionGroup: "player" | "pickup" | "stress" | "boundary" | "sensor";
  linearDamping: number;
  angularDamping: number;
  sensor: boolean;
}

export interface RenderSnapshot {
  key: string;
  label: string;
  tint: string;
  emissive: string;
  opacity: number;
  hidden: boolean;
}

export interface WorldDefinition {
  width: number;
  depth: number;
  safeMargin: number;
  fixedStep: number;
  maxDelta: number;
  leaderboardLimit: number;
}

export interface SpeciesStats {
  maxIntegrity: number;
  moveSpeed: number;
  dashImpulse: number;
  responseGain: number;
  repairGain: number;
  damageTaken: number;
  pickupMagnet: number;
  commandEfficiency: number;
}

export interface SpeciesDefinition {
  id: SpeciesId;
  label: string;
  shortLabel: string;
  traitTitle: string;
  traitCopy: string;
  renderKey: string;
  tint: string;
  body: ColliderShape;
  stats: SpeciesStats;
}

export interface PickupDefinition {
  id: PickupId;
  label: string;
  renderKey: string;
  radius: number;
  repair: number;
  response: number;
  score: number;
  weight: number;
}

export interface ObjectiveDefinition {
  id: ObjectiveId;
  title: string;
  brief: string;
  targetLabel: string;
  target: number;
  reward: number;
}

export interface PhaseDefinition {
  id: PhaseId;
  title: string;
  startsAt: number;
  objectiveId: ObjectiveId;
  pressureLabel: string;
  note: string;
  tint: string;
  scoreMultiplier: number;
  spawnInterval: number;
  stressWeights: Partial<Record<StressEventId, number>>;
}

export interface StressEventDefinition {
  id: StressEventId;
  kind: StressEventKind;
  label: string;
  telegraphSeconds: number;
  activeSeconds: number;
  damage: number;
  score: number;
  baseCount: number;
  maxConcurrent: number;
  radius: number;
  speed: number;
  renderKey: string;
  tint: string;
}

export interface RadialCommandDefinition {
  id: RadialCommandId;
  label: string;
  shortLabel: string;
  description: string;
  cost: number;
  cooldown: number;
  radius: number;
  score: number;
  requiredUpgrade?: UpgradeId;
}

export interface UpgradeEffect {
  stat:
    | "maxIntegrity"
    | "moveSpeed"
    | "dashImpulse"
    | "responseGain"
    | "repairGain"
    | "damageTaken"
    | "pickupMagnet"
    | "commandEfficiency"
    | "stressResistance"
    | "repairNeeded";
  operation: "add" | "multiply";
  value: number;
}

export interface UpgradeDefinition {
  id: UpgradeId;
  label: string;
  description: string;
  maxRank: number;
  costs: number[];
  effects: UpgradeEffect[];
  unlocksCommand?: RadialCommandId;
}

export interface SimulationModifiers {
  pickupRate: number;
  stressRate: number;
  phageRate: number;
  shockRate: number;
  crackRate: number;
  ruptureRate: number;
  score: number;
  response: number;
  repairNeeded: number;
}

export interface DailyProfile {
  id: string;
  name: string;
  subtitle: string;
  modifiers: SimulationModifiers;
}

export interface DailyChallenge {
  dateKey: string;
  board: string;
  seed: number;
  profile: DailyProfile;
  speciesId: SpeciesId;
}

export interface PlayerState {
  id: "player";
  speciesId: SpeciesId;
  transform: TransformSnapshot;
  velocity: Vec3;
  radius: number;
  maxIntegrity: number;
  integrity: number;
  responseCharge: number;
  responseCapacity: number;
  dashCooldown: number;
  dashTimer: number;
  boostTimer: number;
  invulnerableTimer: number;
}

export interface PickupEntityState {
  id: string;
  kind: "pickup";
  pickupId: PickupId;
  transform: TransformSnapshot;
  velocity: Vec3;
  radius: number;
  age: number;
  physics: PhysicsSnapshot;
  render: RenderSnapshot;
}

export interface StressEntityState {
  id: string;
  kind: StressEventKind;
  eventId: StressEventId;
  eventInstanceId: string;
  transform: TransformSnapshot;
  velocity: Vec3;
  radius: number;
  width: number;
  length: number;
  telegraphRemaining: number;
  activeRemaining: number;
  age: number;
  hit: boolean;
  nearMiss: boolean;
  physics: PhysicsSnapshot;
  render: RenderSnapshot;
}

export interface StressEventState {
  id: string;
  eventId: StressEventId;
  kind: StressEventKind;
  phaseId: PhaseId;
  status: "telegraph" | "active" | "finished";
  intensity: number;
  startedAt: number;
  telegraphRemaining: number;
  activeRemaining: number;
  spawned: number;
}

export interface EntityStore {
  pickups: PickupEntityState[];
  stressors: StressEntityState[];
}

export interface InputState {
  move: Vec2;
  aim: Vec2;
  dashQueued: boolean;
  radialOpen: boolean;
  selectedCommandId: RadialCommandId | null;
  activateCommandQueued: boolean;
}

export type InputAction =
  | { type: "move"; vector: Vec2 }
  | { type: "aim"; vector: Vec2 }
  | { type: "dash"; queued?: boolean }
  | { type: "command-wheel"; open: boolean }
  | { type: "select-command"; commandId: RadialCommandId | null }
  | { type: "activate-command"; commandId?: RadialCommandId }
  | { type: "purchase-upgrade"; upgradeId: UpgradeId }
  | { type: "pause"; paused?: boolean }
  | { type: "end-run"; cause?: string };

export interface ObjectiveState {
  id: ObjectiveId;
  title: string;
  brief: string;
  targetLabel: string;
  target: number;
  progress: number;
  completed: boolean;
  reward: number;
  startedAt: number;
}

export interface CommandRuntimeState {
  id: RadialCommandId;
  unlocked: boolean;
  cooldownRemaining: number;
  activations: number;
}

export interface ScoreBreakdown {
  survival: number;
  pickup: number;
  repairCycle: number;
  objective: number;
  nearMiss: number;
  stressCleared: number;
  command: number;
  upgrade: number;
  damagePenalty: number;
}

export interface ScoreState {
  total: number;
  multiplier: number;
  breakdown: ScoreBreakdown;
}

export interface RunMetrics {
  repairCycles: number;
  pickupsCollected: number;
  stressCleared: number;
  damageEvents: number;
  nearMisses: number;
  commandsUsed: number;
  upgradesPurchased: number;
  objectivesCompleted: number;
  highestIntegrity: number;
  lowestIntegrity: number;
}

export interface SimulationEvent {
  type:
    | "run-start"
    | "phase-change"
    | "objective-start"
    | "objective-complete"
    | "pickup"
    | "repair-cycle"
    | "stress-spawn"
    | "stress-cleared"
    | "near-miss"
    | "damage"
    | "command"
    | "upgrade"
    | "dash"
    | "run-end";
  at: number;
  id?: string;
  label?: string;
  value?: number;
  x?: number;
  z?: number;
  phaseId?: PhaseId;
  commandId?: RadialCommandId;
  upgradeId?: UpgradeId;
  stressEventId?: StressEventId;
  cause?: string;
}

export interface EnvelopeV3State {
  version: "envelope-escape-v3";
  status: RunStatus;
  mode: RunMode;
  board: string;
  boardLabel: string;
  playerName: string;
  selectedSpeciesId: SpeciesId;
  speciesId: SpeciesId;
  runId: string;
  seed: number;
  rngState: number;
  dailyChallenge: DailyChallenge | null;
  tick: number;
  elapsed: number;
  phaseIndex: number;
  phaseId: PhaseId;
  nextEntitySeq: number;
  spawnTimer: number;
  pickupTimer: number;
  repairProgress: number;
  repairNeeded: number;
  upgradePoints: number;
  lysisCause: string;
  input: InputState;
  player: PlayerState;
  objective: ObjectiveState;
  commands: Record<RadialCommandId, CommandRuntimeState>;
  upgrades: Record<UpgradeId, number>;
  score: ScoreState;
  metrics: RunMetrics;
  activeStressEvents: StressEventState[];
  entities: EntityStore;
  recentEvents: SimulationEvent[];
}

export interface CreateRunOptions {
  mode?: RunMode;
  speciesId?: SpeciesId | string;
  playerName?: string;
  seed?: number | string;
  dateKey?: string;
  board?: string;
}

export interface StepResult {
  state: EnvelopeV3State;
  events: SimulationEvent[];
}

export interface HudSnapshot {
  status: RunStatus;
  mode: RunMode;
  board: string;
  boardLabel: string;
  speciesId: SpeciesId;
  speciesLabel: string;
  score: number;
  timeSeconds: number;
  timeLabel: string;
  integrity: number;
  responseCharge: number;
  repairProgress: number;
  repairNeeded: number;
  upgradePoints: number;
  phaseId: PhaseId;
  phaseTitle: string;
  pressureLabel: string;
  objectiveTitle: string;
  objectiveProgress: number;
  objectiveTarget: number;
  objectiveTargetLabel: string;
  commands: CommandRuntimeState[];
  upgrades: Record<UpgradeId, number>;
  dailyChallenge: DailyChallenge | null;
}

export interface RunReport {
  version: "envelope-escape-v3";
  runId: string;
  mode: RunMode;
  board: string;
  boardLabel: string;
  seed: number;
  playerName: string;
  speciesId: SpeciesId;
  speciesLabel: string;
  score: number;
  scoreBreakdown: ScoreBreakdown;
  survivedSeconds: number;
  survivedLabel: string;
  phaseReached: string;
  objectiveTitle: string;
  lysisCause: string;
  metrics: RunMetrics;
  upgrades: Record<UpgradeId, number>;
  dailyChallenge: DailyChallenge | null;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  species: SpeciesId;
  playedAt: number;
  board: string;
  mode: RunMode;
  seed: number;
  version: "envelope-escape-v3";
  survivedSeconds: number;
  phaseId: PhaseId;
  repairCycles: number;
}

export interface LeaderboardPayload {
  mode: "global" | "local" | "fallback";
  ok?: boolean;
  board: string;
  entries: LeaderboardEntry[];
  rank?: number;
  totalEntries: number;
  updatedAt: number;
  submitted?: LeaderboardEntry;
}
