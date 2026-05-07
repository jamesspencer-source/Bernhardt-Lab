import {
  BASE_MODIFIERS,
  OBJECTIVES,
  PHASES,
  PICKUPS,
  RADIAL_COMMANDS,
  SIMULATION_VERSION,
  SPECIES,
  SPECIES_ORDER,
  STRESS_EVENTS,
  UPGRADES,
  WORLD
} from "./content";
import { buildDailyChallenge, hashString, normalizeDateKey, normalizeSeed, pickWeighted, randomFloat, randomRange } from "./rng";
import type {
  ColliderShape,
  CommandRuntimeState,
  CreateRunOptions,
  DailyChallenge,
  EnvelopeV3State,
  HudSnapshot,
  InputAction,
  InputState,
  LeaderboardEntry,
  LeaderboardPayload,
  ObjectiveId,
  ObjectiveState,
  PhaseDefinition,
  PickupEntityState,
  PickupId,
  PhysicsSnapshot,
  PlayerState,
  RadialCommandId,
  RenderSnapshot,
  RunMetrics,
  RunMode,
  RunReport,
  ScoreBreakdown,
  ScoreReason,
  SimulationEvent,
  SimulationModifiers,
  SpeciesId,
  SpeciesStats,
  StepResult,
  StressEntityState,
  StressEventDefinition,
  StressEventId,
  TransformSnapshot,
  UpgradeId,
  Vec2,
  Vec3
} from "./types";

type MutableRngState = Pick<EnvelopeV3State, "rngState">;

interface EffectiveStats extends SpeciesStats {
  stressResistance: number;
  repairNeeded: number;
}

const BOARD_PATTERN = /^(classic|seeded-[a-z0-9-]{1,40}|daily-\d{4}-\d{2}-\d{2})$/;
const PICKUP_IDS = Object.keys(PICKUPS) as PickupId[];
const STRESS_EVENT_IDS = Object.keys(STRESS_EVENTS) as StressEventId[];
const RADIAL_COMMAND_IDS = Object.keys(RADIAL_COMMANDS) as RadialCommandId[];
const UPGRADE_IDS = Object.keys(UPGRADES) as UpgradeId[];

export function normalizeSpeciesId(value: unknown): SpeciesId {
  return typeof value === "string" && (SPECIES_ORDER as string[]).includes(value) ? (value as SpeciesId) : "ecoli";
}

export function normalizeBoard(value: unknown): string {
  const board = String(value || "").trim().toLowerCase();
  return BOARD_PATTERN.test(board) ? board : "classic";
}

export function createInputState(): InputState {
  return {
    move: { x: 0, y: 0 },
    aim: { x: 1, y: 0 },
    dashQueued: false,
    radialOpen: false,
    selectedCommandId: "patch-wall",
    activateCommandQueued: false
  };
}

export function createEnvelopeV3State(options: CreateRunOptions = {}): EnvelopeV3State {
  return createState(options, "idle");
}

export function startEnvelopeV3Run(options: CreateRunOptions = {}): EnvelopeV3State {
  const state = createState(options, "running");
  pushEvent(state, { type: "run-start", label: state.boardLabel, value: state.seed });
  pushEvent(state, { type: "phase-change", phaseId: state.phaseId, label: getPhase(state).title });
  pushEvent(state, { type: "objective-start", label: state.objective.title });
  for (let index = 0; index < 5; index += 1) spawnPickup(state);
  return state;
}

export function cloneEnvelopeV3State(state: EnvelopeV3State): EnvelopeV3State {
  return JSON.parse(JSON.stringify(state)) as EnvelopeV3State;
}

export function applyInputAction(state: EnvelopeV3State, action: InputAction): boolean {
  if (action.type === "move") {
    state.input.move = normalizeVec2(action.vector);
    return true;
  }
  if (action.type === "aim") {
    const aim = normalizeVec2(action.vector);
    if (Math.hypot(aim.x, aim.y) > 0) state.input.aim = aim;
    return true;
  }
  if (action.type === "dash") {
    state.input.dashQueued = action.queued ?? true;
    return true;
  }
  if (action.type === "command-wheel") {
    state.input.radialOpen = action.open;
    if (!action.open) state.input.activateCommandQueued = false;
    return true;
  }
  if (action.type === "select-command") {
    state.input.selectedCommandId = action.commandId;
    return true;
  }
  if (action.type === "activate-command") {
    if (action.commandId) state.input.selectedCommandId = action.commandId;
    state.input.activateCommandQueued = true;
    return true;
  }
  if (action.type === "purchase-upgrade") {
    return purchaseUpgrade(state, action.upgradeId);
  }
  if (action.type === "pause") {
    if (state.status === "running" || state.status === "paused") {
      const paused = action.paused ?? state.status === "running";
      state.status = paused ? "paused" : "running";
    }
    return true;
  }
  if (action.type === "end-run") {
    endRun(state, action.cause || "run ended");
    return true;
  }
  return false;
}

export function applyInputActions(state: EnvelopeV3State, actions: readonly InputAction[] = []): void {
  for (const action of actions) applyInputAction(state, action);
}

export function stepEnvelopeV3Simulation(state: EnvelopeV3State, dt: number, actions: readonly InputAction[] = []): StepResult {
  state.recentEvents = [];
  applyInputActions(state, actions);
  if (state.status !== "running") return { state, events: state.recentEvents };

  const step = clamp(Number(dt) || 0, 0, WORLD.maxDelta);
  if (step <= 0) return { state, events: state.recentEvents };

  state.tick += 1;
  state.elapsed += step;
  updatePhase(state);
  updateTimers(state, step);

  if (state.input.activateCommandQueued && state.input.selectedCommandId) {
    activateRadialCommand(state, state.input.selectedCommandId);
  }

  updatePlayer(state, step);
  updateSpawns(state, step);
  updateActiveStressEvents(state, step);
  updatePickups(state, step);
  updateStressors(state, step);
  addScore(state, step * 42, "survival");
  refreshRunBounds(state);

  state.input.dashQueued = false;
  state.input.activateCommandQueued = false;
  return { state, events: state.recentEvents };
}

export function activateRadialCommand(state: EnvelopeV3State, commandId: RadialCommandId): boolean {
  const definition = RADIAL_COMMANDS[commandId];
  const runtime = state.commands[commandId];
  if (!definition || !runtime || state.status !== "running" || !runtime.unlocked || runtime.cooldownRemaining > 0) return false;

  const stats = getEffectiveStats(state);
  const cost = getCommandCost(state, commandId);
  if (state.player.responseCharge < cost) return false;

  state.player.responseCharge = clamp(state.player.responseCharge - cost, 0, state.player.responseCapacity);
  runtime.cooldownRemaining = definition.cooldown;
  runtime.activations += 1;
  state.metrics.commandsUsed += 1;

  let cleared = 0;
  if (commandId === "patch-wall") {
    state.player.integrity = clamp(state.player.integrity + 34 * stats.commandEfficiency, 0, state.player.maxIntegrity);
    state.player.invulnerableTimer = Math.max(state.player.invulnerableTimer, 1.1);
    cleared = clearStressorsAroundPlayer(state, definition.radius, (entity) => entity.kind !== "seeker" && entity.kind !== "storm");
  } else if (commandId === "purge-phages") {
    cleared = clearStressorsAroundPlayer(state, definition.radius, (entity) => entity.eventId === "phage-adsorption");
    advanceObjective(state, "clear-adsorption", cleared);
  } else if (commandId === "motility-burst") {
    state.player.boostTimer = Math.max(state.player.boostTimer, 3.4);
    state.player.dashCooldown = 0;
    state.player.invulnerableTimer = Math.max(state.player.invulnerableTimer, 0.85);
  } else if (commandId === "osmotic-brace") {
    state.player.invulnerableTimer = Math.max(state.player.invulnerableTimer, 1.35);
    cleared = clearStressorsAroundPlayer(state, definition.radius, (entity) => entity.kind === "zone" || entity.kind === "storm");
    for (const entity of state.entities.stressors) {
      if (entity.kind === "zone" || entity.kind === "storm") entity.radius *= 0.76;
    }
    advanceObjective(state, "route-ruptures", Math.max(1, cleared));
  }

  addScore(state, definition.score + cleared * 64, "command");
  pushEvent(state, {
    type: "command",
    commandId,
    label: definition.label,
    value: cleared,
    x: state.player.transform.position.x,
    z: state.player.transform.position.z
  });
  return true;
}

export function purchaseUpgrade(state: EnvelopeV3State, upgradeId: UpgradeId): boolean {
  const definition = UPGRADES[upgradeId];
  if (!definition || state.status === "ended") return false;
  const currentRank = state.upgrades[upgradeId] || 0;
  if (currentRank >= definition.maxRank) return false;

  const cost = definition.costs[currentRank] ?? definition.costs[definition.costs.length - 1] ?? 1;
  if (state.upgradePoints < cost) return false;

  const previousMaxIntegrity = state.player.maxIntegrity;
  state.upgradePoints -= cost;
  state.upgrades[upgradeId] = currentRank + 1;
  state.metrics.upgradesPurchased += 1;
  refreshDerivedState(state, previousMaxIntegrity);
  addScore(state, 90 + cost * 35, "upgrade");
  pushEvent(state, { type: "upgrade", upgradeId, label: definition.label, value: state.upgrades[upgradeId] });
  return true;
}

export function getHudSnapshot(state: EnvelopeV3State): HudSnapshot {
  const species = SPECIES[state.speciesId];
  const phase = getPhase(state);
  return {
    status: state.status,
    mode: state.mode,
    board: state.board,
    boardLabel: state.boardLabel,
    speciesId: state.speciesId,
    speciesLabel: species.label,
    score: Math.max(0, Math.round(state.score.total)),
    timeSeconds: state.elapsed,
    timeLabel: formatDuration(state.elapsed),
    integrity: Math.round(state.player.integrity),
    responseCharge: Math.round(state.player.responseCharge),
    repairProgress: roundTo(state.repairProgress, 2),
    repairNeeded: state.repairNeeded,
    upgradePoints: state.upgradePoints,
    phaseId: phase.id,
    phaseTitle: phase.title,
    pressureLabel: phase.pressureLabel,
    objectiveTitle: state.objective.title,
    objectiveProgress: roundTo(Math.min(state.objective.progress, state.objective.target), 2),
    objectiveTarget: state.objective.target,
    objectiveTargetLabel: state.objective.targetLabel,
    commands: RADIAL_COMMAND_IDS.map((id) => ({ ...state.commands[id] })),
    upgrades: { ...state.upgrades },
    dailyChallenge: state.dailyChallenge
  };
}

export function getRunReport(state: EnvelopeV3State): RunReport {
  const phase = getPhase(state);
  return {
    version: SIMULATION_VERSION,
    runId: state.runId,
    mode: state.mode,
    board: state.board,
    boardLabel: state.boardLabel,
    seed: state.seed,
    playerName: state.playerName,
    speciesId: state.speciesId,
    speciesLabel: SPECIES[state.speciesId].label,
    score: Math.max(0, Math.round(state.score.total)),
    scoreBreakdown: { ...state.score.breakdown },
    survivedSeconds: roundTo(state.elapsed, 3),
    survivedLabel: formatDuration(state.elapsed),
    phaseReached: phase.title,
    objectiveTitle: state.objective.title,
    lysisCause: state.lysisCause || "run complete",
    metrics: { ...state.metrics },
    upgrades: { ...state.upgrades },
    dailyChallenge: state.dailyChallenge
  };
}

export function serializeLeaderboardEntry(state: EnvelopeV3State, playedAt = Date.now()): LeaderboardEntry {
  return normalizeLeaderboardEntry({
    name: state.playerName,
    score: Math.max(0, Math.round(state.score.total)),
    species: state.speciesId,
    playedAt,
    board: state.board,
    mode: state.mode,
    seed: state.seed,
    version: SIMULATION_VERSION,
    survivedSeconds: state.elapsed,
    phaseId: state.phaseId,
    repairCycles: state.metrics.repairCycles
  });
}

export function normalizeLeaderboardEntry(entry: Partial<LeaderboardEntry>): LeaderboardEntry {
  const board = normalizeBoard(entry.board);
  const mode = entry.mode === "daily" || board.startsWith("daily-") ? "daily" : entry.mode === "seeded" || board.startsWith("seeded-") ? "seeded" : "classic";
  return {
    name: cleanName(entry.name) || "Anonymous",
    score: clamp(Math.floor(Number(entry.score) || 0), 0, 2000000000),
    species: normalizeSpeciesId(entry.species),
    playedAt: Math.floor(Number(entry.playedAt) || Date.now()),
    board,
    mode,
    seed: normalizeSeed(entry.seed),
    version: SIMULATION_VERSION,
    survivedSeconds: Math.max(0, Number(entry.survivedSeconds) || 0),
    phaseId: PHASES.some((phase) => phase.id === entry.phaseId) ? entry.phaseId! : PHASES[0].id,
    repairCycles: Math.max(0, Math.floor(Number(entry.repairCycles) || 0))
  };
}

export function createLeaderboardPayload(
  entries: readonly Partial<LeaderboardEntry>[],
  options: { board?: string; mode?: LeaderboardPayload["mode"]; submitted?: Partial<LeaderboardEntry>; rank?: number; totalEntries?: number; updatedAt?: number; ok?: boolean } = {}
): LeaderboardPayload {
  const board = normalizeBoard(options.board || options.submitted?.board || entries[0]?.board || "classic");
  const normalizedEntries = entries
    .map((entry) => normalizeLeaderboardEntry({ ...entry, board: entry.board || board }))
    .filter((entry) => entry.board === board && entry.score > 0)
    .sort((left, right) => (right.score !== left.score ? right.score - left.score : left.playedAt - right.playedAt))
    .slice(0, WORLD.leaderboardLimit);
  const submitted = options.submitted ? normalizeLeaderboardEntry({ ...options.submitted, board: options.submitted.board || board }) : undefined;
  return {
    mode: options.mode || "local",
    ok: options.ok,
    board,
    entries: normalizedEntries,
    rank: options.rank ?? (submitted ? computeRank(normalizedEntries, submitted) : undefined),
    totalEntries: Math.max(normalizedEntries.length, Math.floor(Number(options.totalEntries) || 0)),
    updatedAt: Math.floor(Number(options.updatedAt) || Date.now()),
    submitted
  };
}

function createState(options: CreateRunOptions, status: EnvelopeV3State["status"]): EnvelopeV3State {
  const selectedSpeciesId = normalizeSpeciesId(options.speciesId);
  const mode = normalizeRunMode(options);
  const dailyChallenge = mode === "daily" ? buildDailyChallenge(normalizeDateKey(options.dateKey)) : null;
  const speciesId = dailyChallenge?.speciesId || selectedSpeciesId;
  const seed = resolveSeed(options, mode, dailyChallenge, speciesId);
  const board = resolveBoard(options, mode, dailyChallenge, seed);
  const modifiers = dailyChallenge?.profile.modifiers || BASE_MODIFIERS;
  const phase = PHASES[0];
  const objective = createObjective(phase.objectiveId, 0);
  const upgrades = createUpgradeState();
  const commands = createCommandState(upgrades);
  const baseStats = { ...SPECIES[speciesId].stats, stressResistance: 1, repairNeeded: modifiers.repairNeeded };
  const state: EnvelopeV3State = {
    version: SIMULATION_VERSION,
    status,
    mode,
    board,
    boardLabel: resolveBoardLabel(mode, dailyChallenge),
    playerName: cleanName(options.playerName) || "Anonymous",
    selectedSpeciesId,
    speciesId,
    runId: `v3-${board}-${seed.toString(36)}`,
    seed,
    rngState: seed,
    dailyChallenge,
    tick: 0,
    elapsed: 0,
    phaseIndex: 0,
    phaseId: phase.id,
    nextEntitySeq: 1,
    spawnTimer: phase.spawnInterval,
    pickupTimer: 0.55,
    repairProgress: 0,
    repairNeeded: Math.max(3, Math.round(baseStats.repairNeeded)),
    upgradePoints: 0,
    lysisCause: "",
    input: createInputState(),
    player: createPlayer(speciesId, baseStats),
    objective,
    commands,
    upgrades,
    score: {
      total: 0,
      multiplier: phase.scoreMultiplier * modifiers.score,
      breakdown: createScoreBreakdown()
    },
    metrics: createMetrics(baseStats.maxIntegrity),
    activeStressEvents: [],
    entities: { pickups: [], stressors: [] },
    recentEvents: []
  };
  refreshDerivedState(state, state.player.maxIntegrity);
  return state;
}

function normalizeRunMode(options: CreateRunOptions): RunMode {
  if (options.mode === "daily" || options.mode === "seeded") return options.mode;
  return options.seed !== undefined ? "seeded" : "classic";
}

function resolveSeed(options: CreateRunOptions, mode: RunMode, dailyChallenge: DailyChallenge | null, speciesId: SpeciesId): number {
  if (mode === "daily" && dailyChallenge) return dailyChallenge.seed;
  if (options.seed !== undefined) return normalizeSeed(options.seed);
  return hashString(`envelope-escape-v3-classic:${speciesId}:${Date.now()}:${Math.random()}`) || 1;
}

function resolveBoard(options: CreateRunOptions, mode: RunMode, dailyChallenge: DailyChallenge | null, seed: number): string {
  if (mode === "daily" && dailyChallenge) return dailyChallenge.board;
  if (mode === "seeded") return normalizeBoard(options.board || `seeded-${seed.toString(36)}`);
  return normalizeBoard(options.board || "classic");
}

function resolveBoardLabel(mode: RunMode, dailyChallenge: DailyChallenge | null): string {
  if (mode === "daily" && dailyChallenge) return `Daily challenge: ${dailyChallenge.profile.name}`;
  if (mode === "seeded") return "Seeded lab run";
  return "Classic board";
}

function createPlayer(speciesId: SpeciesId, stats: EffectiveStats): PlayerState {
  const radius = radiusFromCollider(SPECIES[speciesId].body);
  return {
    id: "player",
    speciesId,
    transform: createTransform(WORLD.width * 0.5, WORLD.depth * 0.56),
    velocity: createVec3(),
    radius,
    maxIntegrity: stats.maxIntegrity,
    integrity: stats.maxIntegrity,
    responseCharge: 0,
    responseCapacity: 100,
    dashCooldown: 0,
    dashTimer: 0,
    boostTimer: 0,
    invulnerableTimer: 1.15
  };
}

function createObjective(id: ObjectiveId, startedAt: number): ObjectiveState {
  const definition = OBJECTIVES[id];
  return {
    id: definition.id,
    title: definition.title,
    brief: definition.brief,
    targetLabel: definition.targetLabel,
    target: definition.target,
    progress: 0,
    completed: false,
    reward: definition.reward,
    startedAt
  };
}

function createCommandState(upgrades: Record<UpgradeId, number>): Record<RadialCommandId, CommandRuntimeState> {
  const commands = {} as Record<RadialCommandId, CommandRuntimeState>;
  for (const id of RADIAL_COMMAND_IDS) {
    const definition = RADIAL_COMMANDS[id];
    commands[id] = { id, unlocked: !definition.requiredUpgrade || (upgrades[definition.requiredUpgrade] || 0) > 0, cooldownRemaining: 0, activations: 0 };
  }
  return commands;
}

function createUpgradeState(): Record<UpgradeId, number> {
  const upgrades = {} as Record<UpgradeId, number>;
  for (const id of UPGRADE_IDS) upgrades[id] = 0;
  return upgrades;
}

function createScoreBreakdown(): ScoreBreakdown {
  return { survival: 0, pickup: 0, repairCycle: 0, objective: 0, nearMiss: 0, stressCleared: 0, command: 0, upgrade: 0, damagePenalty: 0 };
}

function createMetrics(maxIntegrity: number): RunMetrics {
  return {
    repairCycles: 0,
    pickupsCollected: 0,
    stressCleared: 0,
    damageEvents: 0,
    nearMisses: 0,
    commandsUsed: 0,
    upgradesPurchased: 0,
    objectivesCompleted: 0,
    highestIntegrity: maxIntegrity,
    lowestIntegrity: maxIntegrity
  };
}

function updatePhase(state: EnvelopeV3State): void {
  let nextIndex = 0;
  for (let index = 0; index < PHASES.length; index += 1) {
    if (state.elapsed >= PHASES[index].startsAt) nextIndex = index;
  }
  if (nextIndex === state.phaseIndex) return;

  state.phaseIndex = nextIndex;
  state.phaseId = PHASES[nextIndex].id;
  state.objective = createObjective(PHASES[nextIndex].objectiveId, state.elapsed);
  state.spawnTimer = Math.min(state.spawnTimer, PHASES[nextIndex].spawnInterval);
  refreshScoreMultiplier(state);
  pushEvent(state, { type: "phase-change", phaseId: state.phaseId, label: PHASES[nextIndex].title });
  pushEvent(state, { type: "objective-start", label: state.objective.title });
}

function updateTimers(state: EnvelopeV3State, dt: number): void {
  state.player.dashCooldown = Math.max(0, state.player.dashCooldown - dt);
  state.player.dashTimer = Math.max(0, state.player.dashTimer - dt);
  state.player.boostTimer = Math.max(0, state.player.boostTimer - dt);
  state.player.invulnerableTimer = Math.max(0, state.player.invulnerableTimer - dt);
  for (const id of RADIAL_COMMAND_IDS) state.commands[id].cooldownRemaining = Math.max(0, state.commands[id].cooldownRemaining - dt);
}

function updatePlayer(state: EnvelopeV3State, dt: number): void {
  const stats = getEffectiveStats(state);
  const move = normalizeVec2(state.input.move);
  const moving = Math.hypot(move.x, move.y) > 0.01;
  if (state.input.dashQueued && moving && state.player.dashCooldown <= 0) {
    state.player.dashTimer = 0.18;
    state.player.dashCooldown = 2.05;
    state.player.invulnerableTimer = Math.max(state.player.invulnerableTimer, 0.28);
    pushEvent(state, { type: "dash", x: state.player.transform.position.x, z: state.player.transform.position.z });
  }

  const boost = state.player.boostTimer > 0 ? 1.28 : 1;
  const speed = (state.player.dashTimer > 0 ? stats.dashImpulse : stats.moveSpeed) * boost;
  state.player.velocity.x = move.x * speed;
  state.player.velocity.y = 0;
  state.player.velocity.z = move.y * speed;
  state.player.transform.position.x = clamp(state.player.transform.position.x + state.player.velocity.x * dt, WORLD.safeMargin, WORLD.width - WORLD.safeMargin);
  state.player.transform.position.z = clamp(state.player.transform.position.z + state.player.velocity.z * dt, WORLD.safeMargin, WORLD.depth - WORLD.safeMargin);
  if (moving) state.player.transform.rotation.y = Math.atan2(move.x, move.y);
}

function updateSpawns(state: EnvelopeV3State, dt: number): void {
  const phase = getPhase(state);
  const modifiers = getModeModifiers(state);
  const difficulty = 1 + clamp(state.elapsed / 360, 0, 0.85);

  state.pickupTimer -= dt * modifiers.pickupRate;
  if (state.pickupTimer <= 0) {
    if (state.entities.pickups.length < 10) spawnPickup(state);
    state.pickupTimer = randomRange(state, 1.15, 2.25);
  }

  state.spawnTimer -= dt * modifiers.stressRate * difficulty;
  if (state.spawnTimer <= 0) {
    spawnStressEvent(state);
    state.spawnTimer = randomRange(state, phase.spawnInterval * 0.72, phase.spawnInterval * 1.18);
  }
}

function updateActiveStressEvents(state: EnvelopeV3State, dt: number): void {
  for (const event of state.activeStressEvents) {
    event.telegraphRemaining = Math.max(0, event.telegraphRemaining - dt);
    if (event.status === "telegraph" && event.telegraphRemaining <= 0) event.status = "active";
    event.activeRemaining = Math.max(0, event.activeRemaining - dt);
    if (event.activeRemaining <= 0) event.status = "finished";
  }
  state.activeStressEvents = state.activeStressEvents.filter((event) => event.status !== "finished");
}

function spawnPickup(state: EnvelopeV3State): void {
  const definition = pickWeighted(state, PICKUP_IDS.map((id) => PICKUPS[id]));
  const entity: PickupEntityState = {
    id: makeId(state, "pickup"),
    kind: "pickup",
    pickupId: definition.id,
    transform: createTransform(randomRange(state, 96, WORLD.width - 96), randomRange(state, 96, WORLD.depth - 96)),
    velocity: createVec3(),
    radius: definition.radius,
    age: 0,
    physics: createPhysics({ kind: "sphere", radius: definition.radius }, "pickup", true),
    render: createRender(definition.renderKey, definition.label, "#ffffff", "#9dfcff", 1)
  };
  state.entities.pickups.push(entity);
}

function spawnStressEvent(state: EnvelopeV3State): void {
  const eventId = chooseStressEvent(state);
  if (!eventId) return;

  const definition = STRESS_EVENTS[eventId];
  const phase = getPhase(state);
  const instanceId = makeId(state, "event");
  const intensity = 1 + clamp((state.elapsed - phase.startsAt) / 90, 0, 0.8);
  const available = Math.max(0, definition.maxConcurrent - countStressors(state, eventId));
  const count = Math.min(available, Math.max(1, Math.round(definition.baseCount * intensity + (randomFloat(state) > 0.62 ? 1 : 0))));
  if (count <= 0) return;

  state.activeStressEvents.push({
    id: instanceId,
    eventId,
    kind: definition.kind,
    phaseId: phase.id,
    status: "telegraph",
    intensity,
    startedAt: state.elapsed,
    telegraphRemaining: definition.telegraphSeconds,
    activeRemaining: definition.telegraphSeconds + definition.activeSeconds,
    spawned: count
  });

  for (let index = 0; index < count; index += 1) state.entities.stressors.push(createStressEntity(state, definition, instanceId, index, count));
  pushEvent(state, { type: "stress-spawn", stressEventId: eventId, id: instanceId, label: definition.label, value: count });
}

function chooseStressEvent(state: EnvelopeV3State): StressEventId | null {
  const phase = getPhase(state);
  const options = STRESS_EVENT_IDS.map((id) => {
    const definition = STRESS_EVENTS[id];
    const baseWeight = phase.stressWeights[id] || 0;
    const room = Math.max(0, definition.maxConcurrent - countStressors(state, id));
    return { id, weight: baseWeight * getStressModifier(state, id) * (room > 0 ? 1 : 0) };
  }).filter((option) => option.weight > 0);
  return options.length > 0 ? pickWeighted(state, options).id : null;
}

function createStressEntity(state: EnvelopeV3State, definition: StressEventDefinition, eventInstanceId: string, index: number, count: number): StressEntityState {
  const id = makeId(state, definition.kind);
  const spread = (index - (count - 1) / 2) * definition.radius * 2.4;
  const transform = createTransform(WORLD.width * 0.5, WORLD.depth * 0.5);
  const velocity = createVec3();
  let radius = definition.radius;
  let width = definition.radius * 2;
  let length = definition.radius * 2;
  let collider: ColliderShape = { kind: "sphere", radius };

  if (definition.kind === "seeker") {
    const edge = edgePosition(state, 84);
    transform.position.x = edge.x + (edge.axis === "z" ? spread : 0);
    transform.position.z = edge.z + (edge.axis === "x" ? spread : 0);
    radius = definition.radius;
    collider = { kind: "sphere", radius };
  } else if (definition.kind === "front") {
    const alongX = randomFloat(state) > 0.5;
    const fromStart = randomFloat(state) > 0.5;
    width = randomRange(state, 84, 122);
    length = alongX ? WORLD.width : WORLD.depth;
    transform.position.x = alongX ? WORLD.width * 0.5 : fromStart ? -width : WORLD.width + width;
    transform.position.z = alongX ? fromStart ? -width : WORLD.depth + width : WORLD.depth * 0.5;
    velocity.x = alongX ? 0 : (fromStart ? 1 : -1) * definition.speed;
    velocity.z = alongX ? (fromStart ? 1 : -1) * definition.speed : 0;
    transform.rotation.y = alongX ? Math.PI / 2 : 0;
    collider = { kind: "cuboid", halfExtents: alongX ? { x: WORLD.width * 0.5, y: 4, z: width * 0.5 } : { x: width * 0.5, y: 4, z: WORLD.depth * 0.5 } };
  } else if (definition.kind === "crack") {
    const center = edgePosition(state, 140);
    const angle = randomRange(state, -Math.PI, Math.PI);
    length = randomRange(state, 340, 520);
    width = randomRange(state, 16, 26);
    transform.position.x = center.x;
    transform.position.z = center.z;
    transform.rotation.y = angle;
    velocity.x = Math.cos(angle + Math.PI / 2) * randomRange(state, 120, definition.speed);
    velocity.z = Math.sin(angle + Math.PI / 2) * randomRange(state, 120, definition.speed);
    collider = makeSegmentCollider(transform, length, width);
  } else {
    transform.position.x = randomRange(state, 140, WORLD.width - 140);
    transform.position.z = randomRange(state, 120, WORLD.depth - 120);
    radius = definition.kind === "storm" ? definition.radius * 0.72 : definition.radius * 0.78;
    collider = { kind: "sphere", radius };
  }

  return {
    id,
    kind: definition.kind,
    eventId: definition.id,
    eventInstanceId,
    transform,
    velocity,
    radius,
    width,
    length,
    telegraphRemaining: definition.telegraphSeconds,
    activeRemaining: definition.activeSeconds,
    age: 0,
    hit: false,
    nearMiss: false,
    physics: createPhysics(collider, "stress", true),
    render: createRender(definition.renderKey, definition.label, definition.tint, definition.tint, 0.55)
  };
}

function updatePickups(state: EnvelopeV3State, dt: number): void {
  const stats = getEffectiveStats(state);
  const magnet = 118 + stats.pickupMagnet;
  for (let index = state.entities.pickups.length - 1; index >= 0; index -= 1) {
    const pickup = state.entities.pickups[index];
    pickup.age += dt;
    const distance = distanceToPlayer(state, pickup.transform.position);
    if (distance < magnet && distance > 0.1) {
      const pull = (magnet - distance) / magnet;
      pickup.transform.position.x += ((state.player.transform.position.x - pickup.transform.position.x) / distance) * pull * 132 * dt;
      pickup.transform.position.z += ((state.player.transform.position.z - pickup.transform.position.z) / distance) * pull * 132 * dt;
    }
    if (distance <= state.player.radius + pickup.radius) {
      state.entities.pickups.splice(index, 1);
      collectPickup(state, pickup);
    }
  }
}

function collectPickup(state: EnvelopeV3State, entity: PickupEntityState): void {
  const definition = PICKUPS[entity.pickupId];
  const stats = getEffectiveStats(state);
  const modifiers = getModeModifiers(state);
  state.metrics.pickupsCollected += 1;
  state.repairProgress += definition.repair * stats.repairGain;
  state.player.responseCharge = clamp(state.player.responseCharge + definition.response * stats.responseGain * modifiers.response, 0, state.player.responseCapacity);
  addScore(state, definition.score, "pickup");
  advanceObjective(state, "assemble-wall", definition.repair * stats.repairGain);
  if (entity.pickupId === "hydrolase-restraint") clearStressorsAroundPlayer(state, 190, (stressor) => stressor.kind === "crack");
  pushEvent(state, { type: "pickup", id: entity.id, label: definition.label, x: entity.transform.position.x, z: entity.transform.position.z });
  if (state.repairProgress >= state.repairNeeded) completeRepairCycle(state);
}

function completeRepairCycle(state: EnvelopeV3State): void {
  const stats = getEffectiveStats(state);
  state.repairProgress = 0;
  state.metrics.repairCycles += 1;
  state.player.integrity = clamp(state.player.integrity + 16 * stats.repairGain, 0, state.player.maxIntegrity);
  state.player.responseCharge = clamp(state.player.responseCharge + 16 * stats.responseGain, 0, state.player.responseCapacity);
  const cleared = clearStressorsAroundPlayer(state, 230, (entity) => entity.kind !== "storm");
  if (state.metrics.repairCycles % 2 === 0) state.upgradePoints += 1;
  addScore(state, 420 + cleared * 30, "repair-cycle");
  advanceObjective(state, "seal-breach", 1);
  pushEvent(state, { type: "repair-cycle", label: "Repair cycle complete", value: cleared, x: state.player.transform.position.x, z: state.player.transform.position.z });
}

function updateStressors(state: EnvelopeV3State, dt: number): void {
  for (let index = state.entities.stressors.length - 1; index >= 0; index -= 1) {
    const entity = state.entities.stressors[index];
    const definition = STRESS_EVENTS[entity.eventId];
    entity.age += dt;
    entity.telegraphRemaining = Math.max(0, entity.telegraphRemaining - dt);
    entity.render.opacity = entity.telegraphRemaining > 0 ? 0.5 : 1;
    if (entity.telegraphRemaining > 0) continue;

    entity.activeRemaining -= dt;
    if (entity.kind === "seeker") updateSeeker(state, entity, definition, dt);
    else if (entity.kind === "front") updateFront(entity, dt);
    else if (entity.kind === "crack") updateCrack(entity, dt);
    else updateZone(entity, definition, dt);
    updateStressPhysics(entity);
    resolveStressCollision(state, entity, definition);

    if (entity.activeRemaining <= 0 || stressorOutside(entity)) {
      if (!entity.hit && (entity.kind === "zone" || entity.kind === "storm")) {
        advanceObjective(state, entity.kind === "storm" ? "survive-storm" : "route-ruptures", 1);
        addScore(state, definition.score * 0.35, "near-miss");
      }
      state.entities.stressors.splice(index, 1);
    }
  }
}

function updateSeeker(state: EnvelopeV3State, entity: StressEntityState, definition: StressEventDefinition, dt: number): void {
  const dx = state.player.transform.position.x - entity.transform.position.x;
  const dz = state.player.transform.position.z - entity.transform.position.z;
  const distance = Math.hypot(dx, dz) || 1;
  const targetVx = (dx / distance) * definition.speed * (1 + clamp(state.elapsed / 360, 0, 0.35));
  const targetVz = (dz / distance) * definition.speed * (1 + clamp(state.elapsed / 360, 0, 0.35));
  entity.velocity.x = lerp(entity.velocity.x, targetVx, clamp(dt * 2.4, 0, 1));
  entity.velocity.z = lerp(entity.velocity.z, targetVz, clamp(dt * 2.4, 0, 1));
  entity.transform.position.x += entity.velocity.x * dt;
  entity.transform.position.z += entity.velocity.z * dt;
  entity.transform.rotation.y = Math.atan2(entity.velocity.x, entity.velocity.z);
}

function updateFront(entity: StressEntityState, dt: number): void {
  entity.transform.position.x += entity.velocity.x * dt;
  entity.transform.position.z += entity.velocity.z * dt;
}

function updateCrack(entity: StressEntityState, dt: number): void {
  entity.transform.position.x += entity.velocity.x * dt;
  entity.transform.position.z += entity.velocity.z * dt;
}

function updateZone(entity: StressEntityState, definition: StressEventDefinition, dt: number): void {
  const maxRadius = entity.kind === "storm" ? definition.radius * 2.45 : definition.radius * 1.75;
  entity.radius = Math.min(maxRadius, entity.radius + definition.speed * dt);
}

function resolveStressCollision(state: EnvelopeV3State, entity: StressEntityState, definition: StressEventDefinition): void {
  const distance = stressorDistanceToPlayer(state, entity);
  if (entity.kind === "seeker" && !entity.nearMiss && distance < state.player.radius + entity.radius + 46 && state.player.invulnerableTimer <= 0) {
    entity.nearMiss = true;
    state.metrics.nearMisses += 1;
    state.player.responseCharge = clamp(state.player.responseCharge + 4.8 * getEffectiveStats(state).responseGain, 0, state.player.responseCapacity);
    addScore(state, 58, "near-miss");
    advanceObjective(state, "survive-storm", 1);
    pushEvent(state, { type: "near-miss", id: entity.id, label: "Near miss", x: entity.transform.position.x, z: entity.transform.position.z });
  }

  if (!entity.hit && distance <= state.player.radius + entity.radius * (entity.kind === "front" || entity.kind === "crack" ? 0.72 : 1)) {
    entity.hit = true;
    applyDamage(state, definition.damage, definition.label, entity.transform.position.x, entity.transform.position.z);
    if (entity.kind === "seeker" || entity.kind === "front" || entity.kind === "crack") entity.activeRemaining = 0;
  }
}

function applyDamage(state: EnvelopeV3State, amount: number, cause: string, x: number, z: number): boolean {
  if (state.player.invulnerableTimer > 0 || state.status !== "running") return false;
  const stats = getEffectiveStats(state);
  const adjusted = amount * stats.damageTaken / stats.stressResistance;
  state.player.integrity = clamp(state.player.integrity - adjusted, 0, state.player.maxIntegrity);
  state.player.invulnerableTimer = 0.58;
  state.lysisCause = cause;
  state.metrics.damageEvents += 1;
  state.metrics.lowestIntegrity = Math.min(state.metrics.lowestIntegrity, state.player.integrity);
  addScore(state, -adjusted * 7, "damage-penalty");
  pushEvent(state, { type: "damage", label: cause, value: roundTo(adjusted, 2), x, z });
  if (state.player.integrity <= 0) endRun(state, cause);
  return true;
}

function endRun(state: EnvelopeV3State, cause: string): void {
  if (state.status === "ended") return;
  state.status = "ended";
  state.lysisCause = cause;
  pushEvent(state, { type: "run-end", label: "Cell lysis", cause, value: Math.round(state.score.total) });
}

function advanceObjective(state: EnvelopeV3State, id: ObjectiveId, amount: number): void {
  if (state.objective.id !== id || state.objective.completed || amount <= 0) return;
  state.objective.progress = Math.min(state.objective.target, state.objective.progress + amount);
  if (state.objective.progress < state.objective.target) return;

  state.objective.completed = true;
  state.metrics.objectivesCompleted += 1;
  state.upgradePoints += 1;
  state.player.integrity = clamp(state.player.integrity + 8, 0, state.player.maxIntegrity);
  state.player.responseCharge = clamp(state.player.responseCharge + 18, 0, state.player.responseCapacity);
  addScore(state, state.objective.reward, "objective");
  pushEvent(state, { type: "objective-complete", label: state.objective.title, value: state.objective.reward });
}

function clearStressorsAroundPlayer(state: EnvelopeV3State, radius: number, predicate: (entity: StressEntityState) => boolean): number {
  let cleared = 0;
  state.entities.stressors = state.entities.stressors.filter((entity) => {
    const keep = !predicate(entity) || stressorDistanceToPlayer(state, entity) > radius + entity.radius;
    if (!keep) cleared += 1;
    return keep;
  });
  if (cleared > 0) {
    state.metrics.stressCleared += cleared;
    addScore(state, cleared * 85, "stress-cleared");
    pushEvent(state, { type: "stress-cleared", label: "Stress cleared", value: cleared, x: state.player.transform.position.x, z: state.player.transform.position.z });
  }
  return cleared;
}

function refreshDerivedState(state: EnvelopeV3State, previousMaxIntegrity: number): void {
  const stats = getEffectiveStats(state);
  state.player.maxIntegrity = stats.maxIntegrity;
  if (stats.maxIntegrity > previousMaxIntegrity) state.player.integrity = clamp(state.player.integrity + (stats.maxIntegrity - previousMaxIntegrity), 0, stats.maxIntegrity);
  else state.player.integrity = clamp(state.player.integrity, 0, stats.maxIntegrity);
  state.repairNeeded = Math.max(3, Math.round(stats.repairNeeded));
  for (const id of RADIAL_COMMAND_IDS) {
    const requiredUpgrade = RADIAL_COMMANDS[id].requiredUpgrade;
    state.commands[id].unlocked = !requiredUpgrade || (state.upgrades[requiredUpgrade] || 0) > 0;
  }
  refreshScoreMultiplier(state);
}

function getEffectiveStats(state: EnvelopeV3State): EffectiveStats {
  const stats: EffectiveStats = { ...SPECIES[state.speciesId].stats, stressResistance: 1, repairNeeded: getModeModifiers(state).repairNeeded };
  for (const upgradeId of UPGRADE_IDS) {
    const rank = state.upgrades[upgradeId] || 0;
    const definition = UPGRADES[upgradeId];
    for (let index = 0; index < rank; index += 1) {
      for (const effect of definition.effects) {
        const apply = (current: number) => effect.operation === "add" ? current + effect.value : current * effect.value;
        if (effect.stat === "stressResistance") stats.stressResistance = apply(stats.stressResistance);
        else if (effect.stat === "repairNeeded") stats.repairNeeded = apply(stats.repairNeeded);
        else if (effect.stat === "maxIntegrity") stats.maxIntegrity = apply(stats.maxIntegrity);
        else if (effect.stat === "moveSpeed") stats.moveSpeed = apply(stats.moveSpeed);
        else if (effect.stat === "dashImpulse") stats.dashImpulse = apply(stats.dashImpulse);
        else if (effect.stat === "responseGain") stats.responseGain = apply(stats.responseGain);
        else if (effect.stat === "repairGain") stats.repairGain = apply(stats.repairGain);
        else if (effect.stat === "damageTaken") stats.damageTaken = apply(stats.damageTaken);
        else if (effect.stat === "pickupMagnet") stats.pickupMagnet = apply(stats.pickupMagnet);
        else if (effect.stat === "commandEfficiency") stats.commandEfficiency = apply(stats.commandEfficiency);
      }
    }
  }
  stats.maxIntegrity = Math.max(1, stats.maxIntegrity);
  stats.moveSpeed = Math.max(1, stats.moveSpeed);
  stats.dashImpulse = Math.max(stats.moveSpeed, stats.dashImpulse);
  stats.damageTaken = Math.max(0.2, stats.damageTaken);
  stats.stressResistance = Math.max(0.35, stats.stressResistance);
  stats.repairNeeded = clamp(stats.repairNeeded, 3, 8);
  return stats;
}

function getModeModifiers(state: EnvelopeV3State): SimulationModifiers {
  return state.mode === "daily" && state.dailyChallenge ? state.dailyChallenge.profile.modifiers : BASE_MODIFIERS;
}

function getStressModifier(state: EnvelopeV3State, eventId: StressEventId): number {
  const modifiers = getModeModifiers(state);
  if (eventId === "phage-adsorption") return modifiers.phageRate;
  if (eventId === "beta-lactam-front") return modifiers.shockRate;
  if (eventId === "autolysin-crack") return modifiers.crackRate;
  if (eventId === "osmotic-rupture" || eventId === "lysis-storm") return modifiers.ruptureRate;
  return 1;
}

function getCommandCost(state: EnvelopeV3State, commandId: RadialCommandId): number {
  return Math.ceil(RADIAL_COMMANDS[commandId].cost / getEffectiveStats(state).commandEfficiency);
}

function addScore(state: EnvelopeV3State, amount: number, reason: ScoreReason): void {
  const multiplier = amount >= 0 ? state.score.multiplier : 1;
  const adjusted = amount * multiplier;
  state.score.total = Math.max(0, state.score.total + adjusted);
  const key = scoreKey(reason);
  state.score.breakdown[key] += adjusted;
}

function refreshScoreMultiplier(state: EnvelopeV3State): void {
  state.score.multiplier = getPhase(state).scoreMultiplier * getModeModifiers(state).score;
}

function scoreKey(reason: ScoreReason): keyof ScoreBreakdown {
  if (reason === "repair-cycle") return "repairCycle";
  if (reason === "near-miss") return "nearMiss";
  if (reason === "stress-cleared") return "stressCleared";
  if (reason === "damage-penalty") return "damagePenalty";
  return reason;
}

function refreshRunBounds(state: EnvelopeV3State): void {
  state.metrics.highestIntegrity = Math.max(state.metrics.highestIntegrity, state.player.integrity);
  state.metrics.lowestIntegrity = Math.min(state.metrics.lowestIntegrity, state.player.integrity);
}

function countStressors(state: EnvelopeV3State, eventId: StressEventId): number {
  return state.entities.stressors.filter((entity) => entity.eventId === eventId).length;
}

function getPhase(state: EnvelopeV3State): PhaseDefinition {
  return PHASES[state.phaseIndex] || PHASES[0];
}

function createPhysics(collider: ColliderShape, collisionGroup: PhysicsSnapshot["collisionGroup"], sensor: boolean): PhysicsSnapshot {
  return { bodyKind: sensor ? "sensor" : "dynamic", collider, collisionGroup, linearDamping: 8, angularDamping: 8, sensor };
}

function createRender(key: string, label: string, tint: string, emissive: string, opacity: number): RenderSnapshot {
  return { key, label, tint, emissive, opacity, hidden: false };
}

function createTransform(x: number, z: number, y = 0): TransformSnapshot {
  return { position: { x, y, z }, rotation: createVec3(), scale: { x: 1, y: 1, z: 1 } };
}

function createVec3(x = 0, y = 0, z = 0): Vec3 {
  return { x, y, z };
}

function makeSegmentCollider(transform: TransformSnapshot, length: number, width: number): ColliderShape {
  const half = length * 0.5;
  const dx = Math.sin(transform.rotation.y) * half;
  const dz = Math.cos(transform.rotation.y) * half;
  return {
    kind: "segment",
    a: { x: transform.position.x - dx, y: 0, z: transform.position.z - dz },
    b: { x: transform.position.x + dx, y: 0, z: transform.position.z + dz },
    radius: width
  };
}

function updateStressPhysics(entity: StressEntityState): void {
  if (entity.kind === "crack") entity.physics.collider = makeSegmentCollider(entity.transform, entity.length, entity.width);
  else if (entity.kind === "zone" || entity.kind === "storm" || entity.kind === "seeker") entity.physics.collider = { kind: "sphere", radius: entity.radius };
}

function edgePosition(owner: MutableRngState, offset: number): { x: number; z: number; axis: "x" | "z" } {
  const edge = Math.floor(randomFloat(owner) * 4);
  if (edge === 0) return { x: -offset, z: randomRange(owner, 80, WORLD.depth - 80), axis: "x" };
  if (edge === 1) return { x: WORLD.width + offset, z: randomRange(owner, 80, WORLD.depth - 80), axis: "x" };
  if (edge === 2) return { x: randomRange(owner, 80, WORLD.width - 80), z: -offset, axis: "z" };
  return { x: randomRange(owner, 80, WORLD.width - 80), z: WORLD.depth + offset, axis: "z" };
}

function stressorDistanceToPlayer(state: EnvelopeV3State, entity: StressEntityState): number {
  if (entity.kind === "crack" && entity.physics.collider.kind === "segment") {
    const player = state.player.transform.position;
    return pointSegmentDistance(player.x, player.z, entity.physics.collider.a.x, entity.physics.collider.a.z, entity.physics.collider.b.x, entity.physics.collider.b.z);
  }
  if (entity.kind === "front" && entity.physics.collider.kind === "cuboid") {
    const player = state.player.transform.position;
    const half = entity.physics.collider.halfExtents;
    return Math.max(Math.abs(player.x - entity.transform.position.x) - half.x, Math.abs(player.z - entity.transform.position.z) - half.z, 0);
  }
  return distanceToPlayer(state, entity.transform.position);
}

function distanceToPlayer(state: EnvelopeV3State, position: Vec3): number {
  return Math.hypot(position.x - state.player.transform.position.x, position.z - state.player.transform.position.z);
}

function stressorOutside(entity: StressEntityState): boolean {
  const margin = Math.max(220, entity.radius * 2);
  return entity.transform.position.x < -margin || entity.transform.position.x > WORLD.width + margin || entity.transform.position.z < -margin || entity.transform.position.z > WORLD.depth + margin;
}

function pointSegmentDistance(px: number, pz: number, ax: number, az: number, bx: number, bz: number): number {
  const abx = bx - ax;
  const abz = bz - az;
  const lengthSquared = abx * abx + abz * abz || 1;
  const t = clamp(((px - ax) * abx + (pz - az) * abz) / lengthSquared, 0, 1);
  return Math.hypot(px - (ax + abx * t), pz - (az + abz * t));
}

function radiusFromCollider(collider: ColliderShape): number {
  if (collider.kind === "sphere") return collider.radius;
  if (collider.kind === "capsule") return collider.radius + collider.halfHeight * 0.4;
  if (collider.kind === "cuboid") return Math.max(collider.halfExtents.x, collider.halfExtents.z);
  return collider.radius;
}

function normalizeVec2(vector: Vec2): Vec2 {
  const x = Number(vector.x) || 0;
  const y = Number(vector.y) || 0;
  const length = Math.hypot(x, y);
  if (length <= 0.0001) return { x: 0, y: 0 };
  return { x: x / Math.max(1, length), y: y / Math.max(1, length) };
}

function cleanName(value: unknown): string {
  return String(value || "").replace(/[^A-Za-z0-9 ._'-]/g, "").replace(/\s+/g, " ").trim().slice(0, 24);
}

function makeId(state: EnvelopeV3State, prefix: string): string {
  const id = `${prefix}-${state.nextEntitySeq}`;
  state.nextEntitySeq += 1;
  return id;
}

function pushEvent(state: EnvelopeV3State, event: Omit<SimulationEvent, "at">): void {
  state.recentEvents.push({ at: state.elapsed, ...event });
}

function computeRank(entries: readonly LeaderboardEntry[], entry: LeaderboardEntry): number {
  const exact = entries.findIndex((candidate) => candidate.name === entry.name && candidate.score === entry.score && candidate.playedAt === entry.playedAt && candidate.board === entry.board);
  if (exact >= 0) return exact + 1;
  return entries.filter((candidate) => candidate.score > entry.score || (candidate.score === entry.score && candidate.playedAt <= entry.playedAt)).length + 1;
}

function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function roundTo(value: number, places: number): number {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}
