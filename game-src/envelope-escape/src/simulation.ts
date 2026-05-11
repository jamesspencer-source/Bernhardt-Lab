import { OBJECTIVES, PHASES, PICKUPS, RESPONSES, SPECIES, WORLD, ZONES } from "./content";
import { buildDailyChallenge, createSeededRandom, hashString, pick, randomRange } from "./rng";
import type {
  CrackEntity,
  EntityStore,
  GameEvent,
  GameState,
  HazardKind,
  HudSnapshot,
  InputState,
  ModeModifiers,
  ObjectiveId,
  ObjectiveState,
  PhageEntity,
  PickupEntity,
  PickupId,
  ResponseId,
  RuptureEntity,
  RunReport,
  ScoreEntry,
  ShockEntity,
  SpeciesId,
  ZoneDefinition,
  ZoneId
} from "./types";

const BOARD_PATTERN = /^(classic|daily-\d{4}-\d{2}-\d{2})$/;
const BASE_MODIFIERS: ModeModifiers = { pickup: 1, phage: 1, shock: 1, crack: 1, rupture: 1, storm: 1, response: 1, score: 1, repairNeeded: 4 };
const PICKUP_IDS = Object.keys(PICKUPS) as PickupId[];
const ACTIVE_ZONES = ZONES.filter((zone) => !zone.safe);
let nextEntityId = 1;

export function normalizeSpeciesId(value: unknown): SpeciesId {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(SPECIES, value) ? (value as SpeciesId) : "ecoli";
}

export function normalizeBoard(value: unknown): string {
  const board = String(value || "").trim().toLowerCase();
  return BOARD_PATTERN.test(board) ? board : "classic";
}

export function createInputState(): InputState {
  return { up: false, down: false, left: false, right: false, dash: false, pointerActive: false, pointerX: WORLD.width * 0.22, pointerY: WORLD.height * 0.72 };
}

export function createGameState(): GameState {
  const dailyChallenge = buildDailyChallenge();
  return {
    status: "menu",
    mode: "classic",
    board: "classic",
    boardLabel: "Classic board",
    playerName: "Anonymous",
    selectedSpeciesId: "ecoli",
    speciesId: "ecoli",
    dailyChallenge,
    runSeed: 1,
    rng: createSeededRandom(1),
    elapsed: 0,
    score: 0,
    integrity: 100,
    repairProgress: 0,
    repairNeeded: 4,
    responseCharge: 0,
    assemblyCycles: 0,
    dashCooldown: 0,
    dashTimer: 0,
    boostTimer: 0,
    invulnerableTimer: 0,
    pressureReliefTimer: 0,
    phaseIndex: 0,
    objective: createObjective("assemble"),
    zoneId: "slide",
    nearMissChain: 0,
    lysisCause: "",
    lastEvents: [],
    player: createPlayer(),
    spawnTimers: createSpawnTimers(),
    entities: createEntityStore()
  };
}

export function startRun(state: GameState, options: { mode?: string; speciesId?: string; playerName?: string } = {}): GameState {
  const mode = options.mode === "daily" ? "daily" : "classic";
  state.dailyChallenge = buildDailyChallenge();
  state.mode = mode;
  state.board = mode === "daily" ? state.dailyChallenge.board : "classic";
  state.boardLabel = mode === "daily" ? `Daily challenge: ${state.dailyChallenge.profile.name}` : "Classic board";
  state.selectedSpeciesId = normalizeSpeciesId(options.speciesId || state.selectedSpeciesId);
  state.speciesId = mode === "daily" ? state.dailyChallenge.speciesId : state.selectedSpeciesId;
  state.playerName = cleanName(options.playerName) || "Anonymous";
  state.runSeed = mode === "daily"
    ? hashString(`envelope-v2-${state.board}-${state.speciesId}`)
    : hashString(`envelope-v2-classic-${state.speciesId}-${Date.now()}-${Math.floor(Math.random() * 1e9)}`);
  state.rng = createSeededRandom(state.runSeed);
  state.status = "running";
  state.elapsed = 0;
  state.score = 0;
  state.integrity = 100;
  state.repairProgress = 0;
  state.repairNeeded = Math.max(4, Math.floor(getModeModifiers(state).repairNeeded || 4));
  state.responseCharge = 0;
  state.assemblyCycles = 0;
  state.dashCooldown = 0;
  state.dashTimer = 0;
  state.boostTimer = 0;
  state.invulnerableTimer = 1.2;
  state.pressureReliefTimer = 0;
  state.phaseIndex = 0;
  state.objective = createObjective(PHASES[0].objectiveId);
  state.zoneId = "slide";
  state.nearMissChain = 0;
  state.lysisCause = "";
  state.player = createPlayer();
  state.entities = createEntityStore();
  state.spawnTimers = createSpawnTimers();
  state.lastEvents = [
    { type: "run-start", title: state.boardLabel, label: SPECIES[state.speciesId].shortLabel },
    { type: "phase", title: PHASES[0].title, copy: PHASES[0].note }
  ];
  for (let index = 0; index < 12; index += 1) spawnPickup(state);
  return state;
}

export function setPlayerName(state: GameState, value: unknown): void {
  state.playerName = cleanName(value) || "Anonymous";
}

export function setPaused(state: GameState, paused: boolean): void {
  if (state.status === "running" || state.status === "paused") state.status = paused ? "paused" : "running";
}

export function updateSimulation(state: GameState, input: InputState, dt: number): GameEvent[] {
  state.lastEvents = [];
  if (state.status !== "running") return state.lastEvents;
  const step = Math.min(0.034, Math.max(0, Number(dt) || 0));
  state.elapsed += step;
  state.objective.timeInObjective += step;
  state.score += step * 40 * getModeModifiers(state).score;
  state.responseCharge = clamp(state.responseCharge + step * 4.4 * getSpecies(state).responseGain * getModeModifiers(state).response, 0, 100);
  updatePhase(state);
  updateTimers(state, step);
  updatePlayer(state, input, step);
  updateZoneState(state, step);
  updateSpawns(state, step);
  updatePickups(state, step);
  updatePhages(state, step);
  updateShocks(state, step);
  updateCracks(state, step);
  updateRuptures(state, step);
  updateStorms(state, step);
  return state.lastEvents;
}

export function triggerResponse(state: GameState, choiceId: string): boolean {
  if (state.status !== "running" || state.responseCharge < 100) return false;
  const choice = Object.prototype.hasOwnProperty.call(RESPONSES, choiceId) ? (choiceId as ResponseId) : "patch";
  const species = getSpecies(state);
  state.responseCharge = 0;
  state.invulnerableTimer = Math.max(state.invulnerableTimer, 0.75);
  let cleared = 0;
  if (choice === "patch") {
    state.integrity = clamp(state.integrity + 34 + species.repairBonus, 0, 100);
    state.invulnerableTimer = Math.max(state.invulnerableTimer, 1.35);
    cleared = clearHazardsAroundPlayer(state, 280, { phages: false, shocks: true, cracks: true, ruptures: true, storms: false });
    state.score += 180 + cleared * 34;
  } else if (choice === "repair") {
    state.integrity = clamp(state.integrity + 26 + species.repairBonus, 0, 100);
    state.pressureReliefTimer = 4.2;
    state.invulnerableTimer = Math.max(state.invulnerableTimer, 0.95);
    cleared = clearHazardsAroundPlayer(state, 360, { phages: false, shocks: true, cracks: false, ruptures: true, storms: true });
    state.score += 165 + cleared * 42;
  } else if (choice === "purge") {
    cleared = clearHazardsAroundPlayer(state, 540, { phages: true, shocks: false, cracks: false, ruptures: true, storms: false });
    state.pressureReliefTimer = 6.2;
    state.integrity = clamp(state.integrity + 12 + species.repairBonus, 0, 100);
    state.score += 145 + cleared * 58;
    advanceObjective(state, "adsorption", Math.max(1, cleared));
  } else {
    state.boostTimer = 3.2;
    state.invulnerableTimer = Math.max(state.invulnerableTimer, 1.05);
    state.integrity = clamp(state.integrity + 14 + species.repairBonus, 0, 100);
    state.score += 155;
  }
  state.lastEvents.push({ type: "response", choice, label: RESPONSES[choice].label, cleared, x: state.player.x, y: state.player.y });
  return true;
}

export function getHudSnapshot(state: GameState): HudSnapshot {
  const phase = PHASES[state.phaseIndex] || PHASES[0];
  const species = getSpecies(state);
  return {
    status: state.status,
    board: state.board,
    boardLabel: state.boardLabel,
    speciesId: state.speciesId,
    speciesLabel: species.label,
    traitTitle: species.traitTitle,
    traitCopy: species.traitCopy,
    score: Math.max(0, Math.round(state.score)),
    timeLabel: formatDuration(state.elapsed),
    integrity: Math.round(state.integrity),
    repairProgress: state.repairProgress,
    repairNeeded: state.repairNeeded,
    responseCharge: Math.round(state.responseCharge),
    dashCooldown: state.dashCooldown,
    phaseTitle: phase.title,
    phaseNote: phase.note,
    pressure: phase.pressure,
    zoneLabel: zoneForId(state.zoneId).label,
    objectiveTitle: state.objective.title,
    objectiveBrief: state.objective.brief,
    objectiveProgress: Math.min(state.objective.progress, state.objective.target),
    objectiveTarget: state.objective.target,
    objectiveTargetLabel: state.objective.targetLabel,
    assemblyCycles: state.assemblyCycles,
    dailyChallenge: state.dailyChallenge,
    responseReady: state.responseCharge >= 100
  };
}

export function getRunReport(state: GameState, placement: RunReport["placement"] = null): RunReport {
  const phase = PHASES[state.phaseIndex] || PHASES[0];
  return {
    score: Math.max(0, Math.round(state.score)),
    speciesId: state.speciesId,
    speciesLabel: getSpecies(state).label,
    board: state.board,
    boardLabel: state.boardLabel,
    survived: formatDuration(state.elapsed),
    phaseReached: phase.title,
    objectiveTitle: state.objective.title,
    zoneLabel: zoneForId(state.zoneId).label,
    assemblyCycles: state.assemblyCycles,
    lysisCause: state.lysisCause || "cumulative envelope stress",
    placement
  };
}

export function serializeScoreEntry(state: GameState): ScoreEntry {
  return {
    name: state.playerName || "Anonymous",
    score: Math.max(0, Math.round(state.score)),
    species: normalizeSpeciesId(state.speciesId),
    playedAt: Date.now(),
    board: normalizeBoard(state.board)
  };
}

function createPlayer() {
  const slide = zoneForId("slide");
  return { x: slide.x + slide.width * 0.42, y: slide.y + slide.height * 0.52, vx: 0, vy: 0, angle: -Math.PI / 2, radius: 25 };
}

function createEntityStore(): EntityStore {
  return { pickups: [], phages: [], shocks: [], cracks: [], ruptures: [], storms: [] };
}

function createSpawnTimers(): GameState["spawnTimers"] {
  return { pickup: 0.2, phage: 1.2, shock: 4.4, crack: 6.2, rupture: 11.5, storm: 16, pattern: 3.2 };
}

function createObjective(id: ObjectiveId): ObjectiveState {
  const definition = OBJECTIVES[id];
  return { ...definition, progress: 0, completed: false, timeInObjective: 0 };
}

function getSpecies(state: GameState) {
  return SPECIES[state.speciesId];
}

function getModeModifiers(state: GameState): ModeModifiers {
  return state.mode === "daily" ? { ...BASE_MODIFIERS, ...state.dailyChallenge.profile.modifiers } : BASE_MODIFIERS;
}

function updatePhase(state: GameState): void {
  let nextIndex = 0;
  for (let index = 0; index < PHASES.length; index += 1) {
    if (state.elapsed >= PHASES[index].start) nextIndex = index;
  }
  if (nextIndex !== state.phaseIndex) {
    state.phaseIndex = nextIndex;
    const phase = PHASES[nextIndex];
    state.objective = createObjective(phase.objectiveId);
    state.lastEvents.push({ type: "phase", title: phase.title, copy: phase.note });
  }
}

function updateTimers(state: GameState, dt: number): void {
  state.dashCooldown = Math.max(0, state.dashCooldown - dt);
  state.dashTimer = Math.max(0, state.dashTimer - dt);
  state.boostTimer = Math.max(0, state.boostTimer - dt);
  state.invulnerableTimer = Math.max(0, state.invulnerableTimer - dt);
  state.pressureReliefTimer = Math.max(0, state.pressureReliefTimer - dt);
}

function updatePlayer(state: GameState, input: InputState, dt: number): void {
  const species = getSpecies(state);
  let moveX = 0;
  let moveY = 0;
  if (input.pointerActive) {
    moveX = input.pointerX - state.player.x;
    moveY = input.pointerY - state.player.y;
  } else {
    if (input.left) moveX -= 1;
    if (input.right) moveX += 1;
    if (input.up) moveY -= 1;
    if (input.down) moveY += 1;
  }
  const length = Math.hypot(moveX, moveY);
  if (length > 0) {
    moveX /= length;
    moveY /= length;
  }
  if (input.dash && state.dashCooldown <= 0 && length > 0.05) {
    state.dashTimer = 0.18;
    state.dashCooldown = 2.05;
    state.invulnerableTimer = Math.max(state.invulnerableTimer, 0.28);
    state.lastEvents.push({ type: "dash", x: state.player.x, y: state.player.y });
  }
  const dashMul = state.dashTimer > 0 ? species.dashSpeed / species.speed : 1;
  const boostMul = state.boostTimer > 0 ? 1.28 : 1;
  const speed = species.speed * dashMul * boostMul;
  state.player.vx = moveX * speed;
  state.player.vy = moveY * speed;
  state.player.x = clamp(state.player.x + state.player.vx * dt, WORLD.safeMargin, WORLD.width - WORLD.safeMargin);
  state.player.y = clamp(state.player.y + state.player.vy * dt, WORLD.safeMargin, WORLD.height - WORLD.safeMargin);
  if (Math.hypot(state.player.vx, state.player.vy) > 8) state.player.angle = Math.atan2(state.player.vy, state.player.vx);
}

function updateZoneState(state: GameState, dt: number): void {
  const previousZone = state.zoneId;
  state.zoneId = zoneAtPoint(state.player.x, state.player.y).id;
  if (state.zoneId !== previousZone) {
    state.lastEvents.push({ type: "phase", title: zoneForId(state.zoneId).label, copy: PHASES[state.phaseIndex]?.pressure || "" });
  }
  if (state.zoneId === "flask" && state.status === "running") {
    const current = Math.sin(state.elapsed * 1.4) * 58;
    state.player.x = clamp(state.player.x + current * dt, WORLD.safeMargin, WORLD.width - WORLD.safeMargin);
  }
  if (state.zoneId === "slide") {
    state.responseCharge = clamp(state.responseCharge + dt * 1.8 * getSpecies(state).responseGain, 0, 100);
  }
}

function updateSpawns(state: GameState, dt: number): void {
  const phase = PHASES[state.phaseIndex] || PHASES[0];
  const modifiers = getModeModifiers(state);
  const difficulty = clamp(state.elapsed / 300, 0, 1);
  const relief = state.pressureReliefTimer > 0 ? 0.68 : 1;
  tickSpawn(state, "pickup", dt, phase.rates.pickup * modifiers.pickup, () => {
    if (state.entities.pickups.length < 14) spawnPickup(state);
    return randomRange(state.rng, 1.05, 1.85);
  });
  tickSpawn(state, "phage", dt, phase.rates.phage * modifiers.phage * relief * (0.76 + difficulty * 0.78), () => {
    spawnPhageArc(state, 1);
    return randomRange(state.rng, 1.0, 1.65);
  });
  tickSpawn(state, "shock", dt, phase.rates.shock * modifiers.shock * (0.72 + difficulty * 0.62), () => {
    spawnShockLane(state, pickShockVariant(state));
    return randomRange(state.rng, 4.0, 6.4);
  });
  tickSpawn(state, "crack", dt, phase.rates.crack * modifiers.crack * (0.66 + difficulty * 0.72), () => {
    spawnCrackPattern(state, 1);
    return randomRange(state.rng, 4.8, 7.0);
  });
  tickSpawn(state, "rupture", dt, phase.rates.rupture * modifiers.rupture * (0.72 + difficulty * 0.78), () => {
    spawnRupture(state, "rupture");
    return randomRange(state.rng, 8.0, 12.0);
  });
  tickSpawn(state, "storm", dt, phase.rates.storm * modifiers.storm * (0.72 + difficulty * 0.86), () => {
    spawnRupture(state, "storm");
    return randomRange(state.rng, 7.4, 10.8);
  });
  tickSpawn(state, "pattern", dt, 1 + difficulty * 0.85, () => {
    spawnBenchPattern(state);
    return randomRange(state.rng, 5.2, 7.6);
  });
}

function tickSpawn(state: GameState, key: keyof GameState["spawnTimers"], dt: number, rate: number, spawn: () => number): void {
  state.spawnTimers[key] -= dt * Math.max(0.05, rate);
  if (state.spawnTimers[key] <= 0) state.spawnTimers[key] = spawn();
}

function spawnBenchPattern(state: GameState): void {
  const phase = PHASES[state.phaseIndex]?.id || "calibration";
  if (phase === "droplet") {
    spawnShockLane(state, "droplet", zoneForId("pipette"));
    spawnShockLane(state, "droplet", zoneForId("pipette"));
  } else if (phase === "phage") {
    spawnPhageArc(state, 4, zoneForId("petri"));
    spawnRupture(state, "rupture", "plaque", zoneForId("petri"));
  } else if (phase === "antibiotic") {
    spawnShockLane(state, "antibiotic", pick(state.rng, [zoneForId("petri"), zoneForId("slide"), undefined]));
    spawnCrackPattern(state, 2, zoneForId("rack"));
  } else if (phase === "rotor") {
    spawnShockLane(state, "rotor", zoneForId("centrifuge"));
    spawnRupture(state, "rupture", "spill", zoneForId("flask"));
    spawnCrackPattern(state, 2, zoneForId("rack"));
  } else if (phase === "lysis") {
    spawnPhageArc(state, 3);
    spawnShockLane(state, pickShockVariant(state));
    spawnRupture(state, "storm", "storm");
  } else {
    for (let index = 0; index < 3; index += 1) spawnPickup(state);
    spawnShockLane(state, "droplet", zoneForId("pipette"));
  }
}

function spawnPickup(state: GameState): void {
  const type = pick(state.rng, PICKUP_IDS);
  const zone = pick(state.rng, [zoneForId("slide"), ...ACTIVE_ZONES, zoneForId(state.zoneId)]);
  const entity: PickupEntity = {
    id: makeId("pickup"),
    type,
    x: randomRange(state.rng, zone.x + 60, zone.x + zone.width - 60),
    y: randomRange(state.rng, zone.y + 60, zone.y + zone.height - 60),
    radius: type === "repair" ? 27 : 24,
    age: 0
  };
  state.entities.pickups.push(entity);
}

function spawnPhageArc(state: GameState, count: number, zone?: ZoneDefinition): void {
  const edge = Math.floor(state.rng() * 4);
  const base = zone ? edgePositionForZone(state, zone, edge, 72) : edgePosition(state, edge, 88);
  for (let index = 0; index < count; index += 1) {
    const spread = (index - (count - 1) / 2) * 58;
    const entity: PhageEntity = {
      id: makeId("phage"),
      kind: "phage",
      x: edge < 2 ? base.x : base.x + spread,
      y: edge < 2 ? base.y + spread : base.y,
      vx: 0,
      vy: 0,
      radius: 23,
      speed: randomRange(state.rng, 122, 194) * (1 + clamp(state.elapsed / 320, 0, 0.38)),
      warning: 0.82,
      age: 0,
      nearMiss: false,
      attachTimer: 0
    };
    state.entities.phages.push(entity);
  }
}

function spawnShockLane(state: GameState, variant: ShockEntity["variant"] = "antibiotic", zone?: ZoneDefinition): void {
  const axis = state.rng() > 0.5 ? "x" : "y";
  const fromStart = state.rng() > 0.5;
  const thickness = variant === "rotor" ? randomRange(state.rng, 62, 86) : randomRange(state.rng, 84, 122);
  const limit = axis === "x" ? (zone ? zone.x + zone.width : WORLD.width) : (zone ? zone.y + zone.height : WORLD.height);
  const start = axis === "x" ? (zone?.x || 0) : (zone?.y || 0);
  const spanStart = axis === "x" ? (zone?.y || 0) : (zone?.x || 0);
  const spanEnd = axis === "x" ? (zone ? zone.y + zone.height : WORLD.height) : (zone ? zone.x + zone.width : WORLD.width);
  const entity: ShockEntity = {
    id: makeId("shock"),
    kind: "shock",
    variant,
    axis,
    position: fromStart ? start - thickness : limit + thickness,
    velocity: (fromStart ? 1 : -1) * randomRange(state.rng, variant === "rotor" ? 260 : 196, variant === "rotor" ? 380 : 284),
    thickness,
    spanStart,
    spanEnd,
    warning: variant === "rotor" ? 1.18 : 1.08
  };
  state.entities.shocks.push(entity);
}

function spawnCrackPattern(state: GameState, count: number, zone?: ZoneDefinition): void {
  const baseAngle = pick(state.rng, [Math.PI / 4, -Math.PI / 4, (3 * Math.PI) / 4, (-3 * Math.PI) / 4]);
  for (let index = 0; index < count; index += 1) {
    const angle = baseAngle + randomRange(state.rng, -0.24, 0.24);
    const length = randomRange(state.rng, 320, 500);
    const center = zone ? randomPointInZone(state, zone, 70) : edgePosition(state, Math.floor(state.rng() * 4), 130);
    const half = length / 2;
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    state.entities.cracks.push({
      id: makeId("crack"),
      kind: "crack",
      x1: center.x - dx * half,
      y1: center.y - dy * half,
      x2: center.x + dx * half,
      y2: center.y + dy * half,
      vx: -dy * randomRange(state.rng, 135, 230),
      vy: dx * randomRange(state.rng, 135, 230),
      width: randomRange(state.rng, 16, 25),
      warning: 1.12,
      life: 6.4
    });
  }
}

function spawnRupture(state: GameState, kind: "rupture" | "storm", variant: RuptureEntity["variant"] = kind === "storm" ? "storm" : "rupture", zone?: ZoneDefinition): void {
  const targetZone = zone || pick(state.rng, ACTIVE_ZONES);
  const point = randomPointInZone(state, targetZone, 90);
  state.entities[kind === "storm" ? "storms" : "ruptures"].push({
    id: makeId(kind),
    kind,
    variant,
    x: point.x,
    y: point.y,
    radius: kind === "storm" ? 34 : variant === "plaque" ? randomRange(state.rng, 72, 110) : randomRange(state.rng, 62, 102),
    maxRadius: kind === "storm" ? randomRange(state.rng, 150, 240) : variant === "plaque" ? randomRange(state.rng, 130, 185) : randomRange(state.rng, 88, 132),
    warning: kind === "storm" ? 0.9 : 1.18,
    life: kind === "storm" ? 3.4 : 4.4,
    hit: false
  });
}

function updatePickups(state: GameState, dt: number): void {
  const species = getSpecies(state);
  const magnet = 118 + species.pickupMagnet;
  for (let index = state.entities.pickups.length - 1; index >= 0; index -= 1) {
    const item = state.entities.pickups[index];
    item.age += dt;
    const distance = distanceToPlayer(state, item);
    if (distance < magnet && distance > 0.1) {
      const pull = (magnet - distance) / magnet;
      item.x += ((state.player.x - item.x) / distance) * pull * 126 * dt;
      item.y += ((state.player.y - item.y) / distance) * pull * 126 * dt;
    }
    if (distance <= state.player.radius + item.radius) {
      state.entities.pickups.splice(index, 1);
      collectPickup(state, item);
    }
  }
}

function collectPickup(state: GameState, item: PickupEntity): void {
  const pickup = PICKUPS[item.type];
  const species = getSpecies(state);
  const modifiers = getModeModifiers(state);
  state.score += pickup.score * modifiers.score;
  state.repairProgress += pickup.repair;
  state.responseCharge = clamp(state.responseCharge + pickup.response * species.responseGain * modifiers.response, 0, 100);
  if (item.type === "restraint") clearHazardsAroundPlayer(state, 220, { phages: false, shocks: false, cracks: true, ruptures: true, storms: false });
  advanceObjective(state, "assemble", pickup.repair);
  state.lastEvents.push({ type: "pickup", label: pickup.label, x: item.x, y: item.y });
  if (state.repairProgress >= state.repairNeeded) completeAssemblyCycle(state);
}

function completeAssemblyCycle(state: GameState): void {
  const species = getSpecies(state);
  state.repairProgress = 0;
  state.assemblyCycles += 1;
  state.integrity = clamp(state.integrity + 15 + species.repairBonus, 0, 100);
  state.responseCharge = clamp(state.responseCharge + 17 * species.responseGain, 0, 100);
  const cleared = clearHazardsAroundPlayer(state, 240, { phages: true, shocks: true, cracks: true, ruptures: true, storms: false });
  state.score += 390 + state.elapsed * 0.52 + cleared * 28;
  state.invulnerableTimer = Math.max(state.invulnerableTimer, 0.8);
  advanceObjective(state, "breach", 1);
  state.lastEvents.push({ type: "assembly", cleared, x: state.player.x, y: state.player.y, label: "Assembly complete" });
}

function updatePhages(state: GameState, dt: number): void {
  for (let index = state.entities.phages.length - 1; index >= 0; index -= 1) {
    const phage = state.entities.phages[index];
    phage.age += dt;
    if (phage.warning > 0) {
      phage.warning = Math.max(0, phage.warning - dt);
      continue;
    }
    const dx = state.player.x - phage.x;
    const dy = state.player.y - phage.y;
    const distance = Math.hypot(dx, dy) || 1;
    phage.vx = lerp(phage.vx, (dx / distance) * phage.speed, clamp(dt * 2.25, 0, 1));
    phage.vy = lerp(phage.vy, (dy / distance) * phage.speed, clamp(dt * 2.25, 0, 1));
    phage.x += phage.vx * dt;
    phage.y += phage.vy * dt;
    if (!phage.nearMiss && distance < state.player.radius + phage.radius + 48 && state.invulnerableTimer <= 0) {
      phage.nearMiss = true;
      state.nearMissChain = Math.min(12, state.nearMissChain + 1);
      state.responseCharge = clamp(state.responseCharge + 4.4 * getSpecies(state).responseGain, 0, 100);
      state.score += 44 + state.nearMissChain * 8;
      advanceObjective(state, "storm", 1);
      state.lastEvents.push({ type: "near-miss", x: phage.x, y: phage.y, label: "Near miss" });
    }
    if (distance < state.player.radius + phage.radius) {
      state.entities.phages.splice(index, 1);
      applyDamage(state, 13, "phage adsorption", phage.x, phage.y);
    } else if (outsidePoint(phage.x, phage.y, 190)) {
      state.entities.phages.splice(index, 1);
    }
  }
}

function updateShocks(state: GameState, dt: number): void {
  for (let index = state.entities.shocks.length - 1; index >= 0; index -= 1) {
    const shock = state.entities.shocks[index];
    if (shock.warning > 0) {
      shock.warning = Math.max(0, shock.warning - dt);
      continue;
    }
    shock.position += shock.velocity * dt;
    const distance = shock.axis === "x" ? Math.abs(state.player.x - shock.position) : Math.abs(state.player.y - shock.position);
    const along = shock.axis === "x" ? state.player.y : state.player.x;
    const inSpan = along >= shock.spanStart - state.player.radius && along <= shock.spanEnd + state.player.radius;
    if (inSpan && distance < shock.thickness * 0.5 + state.player.radius * 0.72) {
      state.entities.shocks.splice(index, 1);
      applyDamage(state, shock.variant === "droplet" ? 12 : shock.variant === "rotor" ? 20 : 17, shockCause(shock), state.player.x, state.player.y);
      continue;
    }
    const limit = shock.axis === "x" ? WORLD.width : WORLD.height;
    if (shock.position < -shock.thickness * 2 || shock.position > limit + shock.thickness * 2) state.entities.shocks.splice(index, 1);
  }
}

function updateCracks(state: GameState, dt: number): void {
  for (let index = state.entities.cracks.length - 1; index >= 0; index -= 1) {
    const crack = state.entities.cracks[index];
    if (crack.warning > 0) {
      crack.warning = Math.max(0, crack.warning - dt);
      continue;
    }
    crack.x1 += crack.vx * dt;
    crack.x2 += crack.vx * dt;
    crack.y1 += crack.vy * dt;
    crack.y2 += crack.vy * dt;
    crack.life -= dt;
    const distance = pointSegmentDistance(state.player.x, state.player.y, crack.x1, crack.y1, crack.x2, crack.y2);
    if (distance < crack.width + state.player.radius * 0.55) {
      state.entities.cracks.splice(index, 1);
      applyDamage(state, 16, "autolysin crack", state.player.x, state.player.y);
      continue;
    }
    if (crack.life <= 0 || (outsidePoint(crack.x1, crack.y1, 280) && outsidePoint(crack.x2, crack.y2, 280))) state.entities.cracks.splice(index, 1);
  }
}

function updateRuptures(state: GameState, dt: number): void {
  updateCircularHazards(state, dt, "ruptures", 20, "osmotic rupture zone", "rupture");
}

function updateStorms(state: GameState, dt: number): void {
  updateCircularHazards(state, dt, "storms", 22, "late-run lysis storm", "storm");
}

function updateCircularHazards(state: GameState, dt: number, key: "ruptures" | "storms", damage: number, cause: string, objective: ObjectiveId): void {
  const hazards = state.entities[key];
  for (let index = hazards.length - 1; index >= 0; index -= 1) {
    const hazard = hazards[index];
    if (hazard.warning > 0) {
      hazard.warning = Math.max(0, hazard.warning - dt);
      continue;
    }
    hazard.life -= dt;
    hazard.radius = lerp(hazard.radius, hazard.maxRadius, clamp(dt * 1.35, 0, 1));
    const distance = distanceToPlayer(state, hazard);
    if (!hazard.hit && distance < hazard.radius + state.player.radius * 0.42) {
      hazard.hit = true;
      applyDamage(state, hazard.variant === "plaque" ? 15 : hazard.variant === "spill" ? 13 : damage, ruptureCause(hazard, cause), state.player.x, state.player.y);
    }
    if (!hazard.hit && distance > hazard.radius + state.player.radius + 18 && hazard.life < 1.1) advanceObjective(state, objective, 1);
    if (hazard.life <= 0) hazards.splice(index, 1);
  }
}

function applyDamage(state: GameState, amount: number, cause: string, x: number, y: number): boolean {
  if (state.invulnerableTimer > 0 || state.status !== "running") return false;
  const species = getSpecies(state);
  let adjusted = amount * species.damageTaken;
  if ((cause.includes("rupture") || cause.includes("crack")) && species.ruptureDamageTaken) adjusted *= species.ruptureDamageTaken;
  state.integrity = clamp(state.integrity - adjusted, 0, 100);
  state.nearMissChain = 0;
  state.invulnerableTimer = 0.56;
  state.lysisCause = cause;
  state.lastEvents.push({ type: "damage", damage: adjusted, cause, x, y });
  if (state.integrity <= 0) {
    state.status = "ended";
    state.lastEvents.push({ type: "end", title: "Cell lysis", copy: cause });
  }
  return true;
}

function advanceObjective(state: GameState, id: ObjectiveId, amount: number): void {
  if (state.objective.id !== id || state.objective.completed) return;
  state.objective.progress = Math.min(state.objective.target, state.objective.progress + amount);
  if (state.objective.progress >= state.objective.target) {
    state.objective.completed = true;
    state.score += state.objective.reward * getModeModifiers(state).score;
    state.integrity = clamp(state.integrity + 8, 0, 100);
    state.responseCharge = clamp(state.responseCharge + 18, 0, 100);
  }
}

function clearHazardsAroundPlayer(state: GameState, radius: number, kinds: Record<"phages" | "shocks" | "cracks" | "ruptures" | "storms", boolean>): number {
  let cleared = 0;
  if (kinds.phages) {
    state.entities.phages = state.entities.phages.filter((entity) => {
      const keep = distanceToPlayer(state, entity) > radius + entity.radius;
      if (!keep) cleared += 1;
      return keep;
    });
  }
  if (kinds.shocks) {
    state.entities.shocks = state.entities.shocks.filter((entity) => {
      const distance = entity.axis === "x" ? Math.abs(state.player.x - entity.position) : Math.abs(state.player.y - entity.position);
      const keep = distance > radius + entity.thickness * 0.5;
      if (!keep) cleared += 1;
      return keep;
    });
  }
  if (kinds.cracks) {
    state.entities.cracks = state.entities.cracks.filter((entity) => {
      const keep = pointSegmentDistance(state.player.x, state.player.y, entity.x1, entity.y1, entity.x2, entity.y2) > radius + entity.width;
      if (!keep) cleared += 1;
      return keep;
    });
  }
  if (kinds.ruptures) cleared += filterCircular(state, "ruptures", radius);
  if (kinds.storms) cleared += filterCircular(state, "storms", radius);
  return cleared;
}

function filterCircular(state: GameState, key: "ruptures" | "storms", radius: number): number {
  let cleared = 0;
  state.entities[key] = state.entities[key].filter((entity) => {
    const keep = distanceToPlayer(state, entity) > radius + entity.radius;
    if (!keep) cleared += 1;
    return keep;
  });
  return cleared;
}

function edgePosition(state: GameState, edge: number, offset: number): { x: number; y: number } {
  if (edge === 0) return { x: -offset, y: randomRange(state.rng, 80, WORLD.height - 80) };
  if (edge === 1) return { x: WORLD.width + offset, y: randomRange(state.rng, 80, WORLD.height - 80) };
  if (edge === 2) return { x: randomRange(state.rng, 80, WORLD.width - 80), y: -offset };
  return { x: randomRange(state.rng, 80, WORLD.width - 80), y: WORLD.height + offset };
}

function edgePositionForZone(state: GameState, zone: ZoneDefinition, edge: number, offset: number): { x: number; y: number } {
  if (edge === 0) return { x: zone.x - offset, y: randomRange(state.rng, zone.y + 40, zone.y + zone.height - 40) };
  if (edge === 1) return { x: zone.x + zone.width + offset, y: randomRange(state.rng, zone.y + 40, zone.y + zone.height - 40) };
  if (edge === 2) return { x: randomRange(state.rng, zone.x + 40, zone.x + zone.width - 40), y: zone.y - offset };
  return { x: randomRange(state.rng, zone.x + 40, zone.x + zone.width - 40), y: zone.y + zone.height + offset };
}

function randomPointInZone(state: GameState, zone: ZoneDefinition, margin = 60): { x: number; y: number } {
  return {
    x: randomRange(state.rng, zone.x + margin, zone.x + zone.width - margin),
    y: randomRange(state.rng, zone.y + margin, zone.y + zone.height - margin)
  };
}

function zoneAtPoint(x: number, y: number): ZoneDefinition {
  return ZONES.find((zone) => x >= zone.x && x <= zone.x + zone.width && y >= zone.y && y <= zone.y + zone.height) || zoneForId("slide");
}

function zoneForId(id: ZoneId): ZoneDefinition {
  return ZONES.find((zone) => zone.id === id) || ZONES[0];
}

function pickShockVariant(state: GameState): ShockEntity["variant"] {
  const phase = PHASES[state.phaseIndex]?.id || "";
  if (phase === "droplet") return "droplet";
  if (phase === "rotor" && state.rng() > 0.35) return "rotor";
  if (phase === "lysis") return pick(state.rng, ["antibiotic", "droplet", "rotor"]);
  return state.rng() > 0.72 ? "droplet" : "antibiotic";
}

function shockCause(shock: ShockEntity): string {
  if (shock.variant === "droplet") return "pipette droplet pulse";
  if (shock.variant === "rotor") return "centrifuge rotor sweep";
  return "beta-lactam shock front";
}

function ruptureCause(hazard: RuptureEntity, fallback: string): string {
  if (hazard.variant === "plaque") return "expanding phage plaque";
  if (hazard.variant === "spill") return "media spill rupture";
  return fallback;
}

function cleanName(value: unknown): string {
  return String(value || "").replace(/[^A-Za-z0-9 ._'-]/g, "").replace(/\s+/g, " ").trim().slice(0, 24);
}

function distanceToPlayer(state: GameState, entity: { x: number; y: number }): number {
  return Math.hypot(entity.x - state.player.x, entity.y - state.player.y);
}

function outsidePoint(x: number, y: number, margin: number): boolean {
  return x < -margin || x > WORLD.width + margin || y < -margin || y > WORLD.height + margin;
}

function pointSegmentDistance(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
  const abx = bx - ax;
  const aby = by - ay;
  const lengthSquared = abx * abx + aby * aby || 1;
  const t = clamp(((px - ax) * abx + (py - ay) * aby) / lengthSquared, 0, 1);
  return Math.hypot(px - (ax + abx * t), py - (ay + aby * t));
}

function makeId(prefix: string): string {
  nextEntityId += 1;
  return `${prefix}-${nextEntityId}`;
}

function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}
