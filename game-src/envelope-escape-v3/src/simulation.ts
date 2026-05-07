import { CHAMBER, COMMANDS, PHASES, SPECIES, UPGRADES } from "./content";
import { createSeededRandom, hashString, pick, randomRange, type RandomFn } from "./rng";
import type {
  CommandId,
  EffectEvent,
  GameState,
  HazardEntity,
  HazardKind,
  HudSnapshot,
  InputState,
  PickupEntity,
  RunMode,
  RunReport,
  ScoreEntry,
  SpeciesId,
  UpgradeId
} from "./types";

const BOARD_PATTERN = /^(classic|daily-\d{4}-\d{2}-\d{2})$/;
const PICKUPS: PickupEntity["kind"][] = ["pg", "lipid", "restraint", "capsule"];
const UPGRADE_IDS = Object.keys(UPGRADES) as UpgradeId[];
const LAB_TIMEZONE = "America/New_York";

let nextId = 1;

export function createInputState(): InputState {
  return { moveX: 0, moveZ: 0, dash: false, commandWheel: false };
}

export function normalizeSpeciesId(value: unknown): SpeciesId {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(SPECIES, value) ? (value as SpeciesId) : "ecoli";
}

export function normalizeBoard(value: unknown): string {
  const board = String(value || "").trim().toLowerCase();
  return BOARD_PATTERN.test(board) ? board : "classic";
}

export function cleanPlayerName(value: unknown): string {
  const clean = String(value || "")
    .replace(/[^\w .'-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 24);
  return clean || "Anonymous";
}

export class V3Simulation {
  readonly state: GameState;
  private random: RandomFn;

  constructor() {
    this.random = createSeededRandom(1);
    this.state = createInitialState();
  }

  start(options: { mode?: RunMode | string; speciesId?: string; playerName?: string } = {}): void {
    const mode: RunMode = options.mode === "daily" ? "daily" : "classic";
    const speciesId = normalizeSpeciesId(options.speciesId || this.state.selectedSpeciesId);
    const board = mode === "daily" ? dailyBoard() : "classic";
    const seed = mode === "daily" ? hashString(`envelope-v3-${board}-${speciesId}`) : hashString(`envelope-v3-${speciesId}-${Date.now()}-${Math.random()}`);
    this.random = createSeededRandom(seed);
    const species = SPECIES[speciesId];
    Object.assign(this.state, createInitialState(), {
      status: "briefing",
      previousStatus: "briefing",
      mode,
      board,
      selectedSpeciesId: speciesId,
      speciesId,
      playerName: cleanPlayerName(options.playerName),
      seed,
      integrity: species.integrity
    });
    this.state.effects.push(effect("phase", 0, 0, "Stress chamber online"));
    for (let index = 0; index < 6; index += 1) this.spawnPickup();
  }

  beginRun(): void {
    if (this.state.status === "briefing" || this.state.status === "menu") {
      this.state.status = "running";
      this.state.previousStatus = "running";
    }
  }

  togglePause(): void {
    if (this.state.status === "running" || this.state.status === "command") {
      this.state.previousStatus = this.state.status;
      this.state.status = "paused";
    } else if (this.state.status === "paused") {
      this.state.status = this.state.previousStatus === "command" ? "command" : "running";
    }
  }

  setCommandWheel(open: boolean): void {
    if (open && this.state.status === "running") {
      this.state.status = "command";
      return;
    }
    if (!open && this.state.status === "command") {
      this.state.status = "running";
    }
  }

  chooseUpgrade(upgradeId: UpgradeId): void {
    if (this.state.status !== "upgrade" || !this.state.upgradeChoices.includes(upgradeId)) return;
    this.state.upgrades.push(upgradeId);
    this.state.upgradeChoices = [];
    this.state.phaseProgress = 0;
    this.state.assembly = 0;
    this.state.phaseIndex = Math.min(this.state.phaseIndex + 1, PHASES.length - 1);
    this.state.elapsed = Math.max(this.state.elapsed, PHASES[this.state.phaseIndex].startsAt);
    this.state.status = "running";
    this.state.previousStatus = "running";
    this.state.effects.push(effect("upgrade", this.state.player.x, this.state.player.z, UPGRADES[upgradeId].title));
  }

  triggerCommand(commandId: CommandId): boolean {
    if ((this.state.status !== "running" && this.state.status !== "command") || this.state.commandCharge < 100) return false;
    const state = this.state;
    const species = SPECIES[state.speciesId];
    state.commandCharge = 0;
    state.status = "running";
    state.previousStatus = "running";
    const upgraded = (id: UpgradeId) => state.upgrades.includes(id);
    let cleared = 0;
    if (commandId === "pg") {
      const bonus = upgraded("ponA-overdrive") ? 1.45 : 1;
      state.assembly += upgraded("lpoB-tether") ? 2 : 1;
      state.integrity = clamp(state.integrity + 15 * species.repairGain * bonus, 0, species.integrity + 18);
      cleared = clearHazards(state, state.player, 4.3, ["shock"]);
      state.score += 260 + cleared * 90;
      advanceObjective(state, 2);
    } else if (commandId === "membrane") {
      state.integrity = clamp(state.integrity + 28 * species.repairGain, 0, species.integrity + 20);
      cleared = clearHazards(state, state.player, upgraded("omp-buffer") ? 6.8 : 5.2, ["rupture", "crack"]);
      state.score += 220 + cleared * 80;
      advanceObjective(state, 1);
    } else if (commandId === "phage") {
      cleared = clearHazards(state, state.player, upgraded("restriction-burst") ? 9.8 : 7.2, ["phage"]);
      state.score += 180 + cleared * 140;
      advanceObjective(state, Math.max(1, cleared));
    } else {
      state.player.dashTimer = upgraded("chemoreflex") ? 1.35 : 0.9;
      state.player.dashCooldown = 0;
      state.score += 220;
      advanceObjective(state, 1);
    }
    state.effects.push(effect("command", state.player.x, state.player.z, COMMANDS[commandId].shortLabel));
    return true;
  }

  update(input: InputState, dt: number): void {
    if (this.state.status !== "running" && this.state.status !== "command") return;
    const step = Math.min(0.05, Math.max(0, dt)) * (this.state.status === "command" ? 0.22 : 1);
    this.state.elapsed += step;
    this.state.score += step * (44 + this.state.phaseIndex * 10);
    this.state.commandCharge = clamp(this.state.commandCharge + step * 6.4 * SPECIES[this.state.speciesId].commandGain * upgradeCommandGain(this.state), 0, 100);
    this.syncPhaseByTime();
    this.updatePlayer(input, step);
    this.updateSpawns(step);
    this.updatePickups(step);
    this.updateHazards(step);
    this.updateEffects(step);
    if (this.state.integrity <= 0) this.endRun("envelope lysis");
  }

  hud(): HudSnapshot {
    const phase = PHASES[this.state.phaseIndex];
    return {
      status: this.state.status,
      score: Math.max(0, Math.round(this.state.score)),
      timeLabel: formatDuration(this.state.elapsed),
      integrity: Math.max(0, Math.round(this.state.integrity)),
      commandCharge: Math.round(this.state.commandCharge),
      phaseTitle: phase.title,
      phasePressure: phase.pressure,
      objective: phase.objective,
      objectiveProgress: Math.min(this.state.phaseProgress, phase.target),
      objectiveTarget: phase.target,
      board: this.state.board,
      speciesLabel: SPECIES[this.state.speciesId].label,
      upgradeCount: this.state.upgrades.length
    };
  }

  report(): RunReport {
    const phase = PHASES[this.state.phaseIndex];
    return {
      score: Math.max(0, Math.round(this.state.score)),
      speciesId: this.state.speciesId,
      speciesLabel: SPECIES[this.state.speciesId].label,
      board: this.state.board,
      survived: formatDuration(this.state.elapsed),
      phaseReached: phase.title,
      lysisCause: this.state.lysisCause || "cumulative envelope stress",
      upgrades: this.state.upgrades.map((id) => UPGRADES[id].title),
      completedAt: Date.now()
    };
  }

  scoreEntry(nameOverride?: string): ScoreEntry {
    return {
      name: cleanPlayerName(nameOverride || this.state.playerName),
      score: Math.max(0, Math.round(this.state.score)),
      species: this.state.speciesId,
      playedAt: Date.now(),
      board: normalizeBoard(this.state.board)
    };
  }

  private syncPhaseByTime(): void {
    const current = this.state.phaseIndex;
    let next = current;
    for (let index = 0; index < PHASES.length; index += 1) {
      if (this.state.elapsed >= PHASES[index].startsAt) next = index;
    }
    if (next !== current) {
      this.state.phaseIndex = next;
      this.state.phaseProgress = 0;
      this.state.effects.push(effect("phase", this.state.player.x, this.state.player.z, PHASES[next].title));
    }
  }

  private updatePlayer(input: InputState, dt: number): void {
    const state = this.state;
    const species = SPECIES[state.speciesId];
    const len = Math.hypot(input.moveX, input.moveZ) || 1;
    const moveX = input.moveX / len;
    const moveZ = input.moveZ / len;
    state.player.dashCooldown = Math.max(0, state.player.dashCooldown - dt * (state.upgrades.includes("chemoreflex") ? 1.45 : 1));
    state.player.dashTimer = Math.max(0, state.player.dashTimer - dt);
    const speed = state.player.dashTimer > 0 ? species.dashSpeed : species.speed;
    if (input.dash && state.player.dashCooldown <= 0 && (Math.abs(input.moveX) + Math.abs(input.moveZ) > 0.1)) {
      state.player.dashTimer = 0.22;
      state.player.dashCooldown = 1.3;
      state.effects.push(effect("dash", state.player.x, state.player.z, "Dash"));
    }
    state.player.vx = lerp(state.player.vx, moveX * speed, 1 - Math.pow(0.001, dt));
    state.player.vz = lerp(state.player.vz, moveZ * speed, 1 - Math.pow(0.001, dt));
    state.player.x = clamp(state.player.x + state.player.vx * dt, -CHAMBER.width / 2 + CHAMBER.safeMargin, CHAMBER.width / 2 - CHAMBER.safeMargin);
    state.player.z = clamp(state.player.z + state.player.vz * dt, -CHAMBER.depth / 2 + CHAMBER.safeMargin, CHAMBER.depth / 2 - CHAMBER.safeMargin);
  }

  private updateSpawns(dt: number): void {
    const phase = PHASES[this.state.phaseIndex];
    const pressure = 1 + this.state.phaseIndex * 0.18;
    this.tickTimer("pickup", dt, Math.max(0.7, 2.3 - this.state.phaseIndex * 0.12), () => this.spawnPickup());
    this.tickTimer("phage", dt, Math.max(0.62, 2.2 / pressure), () => this.spawnHazard("phage"));
    if (this.state.phaseIndex >= 1) this.tickTimer("shock", dt, Math.max(1.4, 4.5 / pressure), () => this.spawnHazard("shock"));
    if (this.state.phaseIndex >= 2) this.tickTimer("crack", dt, Math.max(1.7, 5.2 / pressure), () => this.spawnHazard("crack"));
    if (this.state.phaseIndex >= 3) this.tickTimer("rupture", dt, Math.max(1.9, 6.4 / pressure), () => this.spawnHazard("rupture"));
    this.tickTimer("boss", dt, Math.max(12, 22 - this.state.phaseIndex * 1.8), () => {
      this.state.effects.push(effect("phase", this.state.player.x, this.state.player.z, phase.boss));
      for (let i = 0; i < 2 + this.state.phaseIndex; i += 1) this.spawnHazard(pick(this.random, ["phage", "shock", "crack", "rupture"] as HazardKind[]));
    });
  }

  private tickTimer(key: keyof GameState["timers"], dt: number, reset: number, action: () => void): void {
    this.state.timers[key] -= dt;
    if (this.state.timers[key] <= 0) {
      this.state.timers[key] = reset * randomRange(this.random, 0.72, 1.18);
      action();
    }
  }

  private spawnPickup(): void {
    this.state.pickups.push({
      id: nextId++,
      kind: pick(this.random, PICKUPS),
      x: randomRange(this.random, -CHAMBER.width / 2 + 2, CHAMBER.width / 2 - 2),
      z: randomRange(this.random, -CHAMBER.depth / 2 + 2, CHAMBER.depth / 2 - 2),
      radius: 0.55,
      age: 0
    });
  }

  private spawnHazard(kind: HazardKind): void {
    const fromHorizontalEdge = this.random() > 0.5;
    const side = this.random() > 0.5 ? 1 : -1;
    const x = fromHorizontalEdge ? side * CHAMBER.width * 0.56 : randomRange(this.random, -CHAMBER.width / 2, CHAMBER.width / 2);
    const z = fromHorizontalEdge ? randomRange(this.random, -CHAMBER.depth / 2, CHAMBER.depth / 2) : side * CHAMBER.depth * 0.56;
    const toPlayerX = this.state.player.x - x;
    const toPlayerZ = this.state.player.z - z;
    const len = Math.hypot(toPlayerX, toPlayerZ) || 1;
    const base = kind === "phage" ? 5.2 : kind === "shock" ? 3.2 : 2.2;
    this.state.hazards.push({
      id: nextId++,
      kind,
      x,
      z,
      vx: (toPlayerX / len) * base,
      vz: (toPlayerZ / len) * base,
      radius: kind === "rupture" ? 1.6 : kind === "phage" ? 0.55 : 0.8,
      width: kind === "crack" ? randomRange(this.random, 5.8, 9.5) : kind === "shock" ? 1.2 : 0.7,
      angle: Math.atan2(toPlayerZ, toPlayerX),
      age: 0,
      telegraph: kind === "phage" ? 0.65 : kind === "shock" ? 1.05 : 1.2,
      duration: kind === "rupture" ? 8 : kind === "crack" ? 6.2 : 5.4,
      damage: kind === "phage" ? 12 : kind === "shock" ? 18 : kind === "crack" ? 16 : 22
    });
  }

  private updatePickups(dt: number): void {
    const magnet = this.state.speciesId === "kpneumoniae" || this.state.upgrades.includes("bactoprenol-flow") ? 5.4 : 2.2;
    this.state.pickups = this.state.pickups.filter((pickup) => {
      pickup.age += dt;
      const dx = this.state.player.x - pickup.x;
      const dz = this.state.player.z - pickup.z;
      const distance = Math.hypot(dx, dz);
      if (distance < magnet) {
        pickup.x += (dx / Math.max(0.01, distance)) * dt * 3.8;
        pickup.z += (dz / Math.max(0.01, distance)) * dt * 3.8;
      }
      if (distance < pickup.radius + this.state.player.radius) {
        this.collectPickup(pickup);
        return false;
      }
      return pickup.age < 16;
    });
    while (this.state.pickups.length < 5) this.spawnPickup();
  }

  private collectPickup(pickup: PickupEntity): void {
    const commandBonus = this.state.upgrades.includes("bactoprenol-flow") ? 1.25 : 1;
    const repair = pickup.kind === "lipid" ? 2 : 1;
    this.state.assembly += repair;
    this.state.commandCharge = clamp(this.state.commandCharge + 16 * SPECIES[this.state.speciesId].commandGain * commandBonus, 0, 100);
    this.state.score += pickup.kind === "restraint" ? 130 : 95;
    this.state.effects.push(effect("pickup", pickup.x, pickup.z, pickup.kind));
    advanceObjective(this.state, repair);
    if (this.state.assembly >= this.state.assemblyTarget) {
      this.state.assembly = 0;
      this.state.integrity = clamp(this.state.integrity + 12 * SPECIES[this.state.speciesId].repairGain, 0, SPECIES[this.state.speciesId].integrity + 16);
      this.state.score += 420;
    }
  }

  private updateHazards(dt: number): void {
    this.state.hazards = this.state.hazards.filter((hazard) => {
      hazard.age += dt;
      if (hazard.age > hazard.telegraph) {
        hazard.x += hazard.vx * dt;
        hazard.z += hazard.vz * dt;
      }
      if (hazard.kind === "rupture") hazard.radius += dt * 0.42;
      if (this.hazardHitsPlayer(hazard)) {
        this.damage(hazard);
        return false;
      }
      return hazard.age < hazard.duration && Math.abs(hazard.x) < CHAMBER.width && Math.abs(hazard.z) < CHAMBER.depth;
    });
  }

  private hazardHitsPlayer(hazard: HazardEntity): boolean {
    if (hazard.age < hazard.telegraph) return false;
    if (hazard.kind === "crack" || hazard.kind === "shock") {
      const dx = this.state.player.x - hazard.x;
      const dz = this.state.player.z - hazard.z;
      const normal = Math.abs(Math.sin(hazard.angle) * dx - Math.cos(hazard.angle) * dz);
      return normal < hazard.width * 0.5 && Math.hypot(dx, dz) < 8.2;
    }
    return Math.hypot(this.state.player.x - hazard.x, this.state.player.z - hazard.z) < hazard.radius + this.state.player.radius;
  }

  private damage(hazard: HazardEntity): void {
    const state = this.state;
    const species = SPECIES[state.speciesId];
    let amount = hazard.damage * species.damageTaken;
    if (state.upgrades.includes("capsule-surge") && state.commandCharge >= 50) amount *= 0.78;
    if (state.upgrades.includes("autolysin-brake") && (hazard.kind === "crack" || hazard.kind === "rupture")) amount *= 0.72;
    if (state.upgrades.includes("omp-buffer") && hazard.kind === "rupture") amount *= 0.7;
    state.integrity = clamp(state.integrity - amount, 0, 140);
    state.lysisCause = `${hazard.kind} stress`;
    state.effects.push(effect("damage", state.player.x, state.player.z, `-${Math.round(amount)}`));
  }

  private updateEffects(dt: number): void {
    this.state.effects = this.state.effects.filter((item) => {
      item.age += dt;
      return item.age < 1.8;
    });
  }

  private endRun(cause: string): void {
    this.state.status = "ended";
    this.state.previousStatus = "ended";
    this.state.lysisCause = cause;
    this.state.effects.push(effect("lysis", this.state.player.x, this.state.player.z, "Lysis"));
  }
}

function createInitialState(): GameState {
  return {
    status: "menu",
    previousStatus: "menu",
    mode: "classic",
    board: "classic",
    playerName: "Anonymous",
    selectedSpeciesId: "ecoli",
    speciesId: "ecoli",
    seed: 1,
    elapsed: 0,
    score: 0,
    integrity: 100,
    commandCharge: 0,
    assembly: 0,
    assemblyTarget: 5,
    phaseIndex: 0,
    phaseProgress: 0,
    upgrades: [],
    upgradeChoices: [],
    lysisCause: "",
    player: { x: 0, z: 1.5, vx: 0, vz: 0, radius: 0.68, dashCooldown: 0, dashTimer: 0 },
    hazards: [],
    pickups: [],
    effects: [],
    timers: { pickup: 0.2, phage: 1.2, shock: 3.8, crack: 5.3, rupture: 8.5, boss: 15 }
  };
}

function advanceObjective(state: GameState, amount: number): void {
  const phase = PHASES[state.phaseIndex];
  state.phaseProgress += amount;
  if (state.phaseProgress >= phase.target && state.status !== "upgrade" && state.phaseIndex < PHASES.length - 1) {
    state.score += 900 + state.phaseIndex * 260;
    state.upgradeChoices = chooseUpgradeDraft(state);
    state.status = "upgrade";
    state.previousStatus = "upgrade";
  }
}

function chooseUpgradeDraft(state: GameState): UpgradeId[] {
  const random = createSeededRandom(hashString(`${state.seed}-${state.phaseIndex}-${state.upgrades.join(",")}`));
  const available = UPGRADE_IDS.filter((id) => !state.upgrades.includes(id));
  const draft: UpgradeId[] = [];
  while (draft.length < 3 && available.length > 0) {
    const chosen = pick(random, available);
    draft.push(chosen);
    available.splice(available.indexOf(chosen), 1);
  }
  return draft;
}

function clearHazards(state: GameState, center: { x: number; z: number }, radius: number, kinds: HazardKind[]): number {
  let cleared = 0;
  state.hazards = state.hazards.filter((hazard) => {
    if (!kinds.includes(hazard.kind) || Math.hypot(hazard.x - center.x, hazard.z - center.z) > radius) return true;
    cleared += 1;
    state.effects.push(effect("command", hazard.x, hazard.z, "clear"));
    return false;
  });
  return cleared;
}

function upgradeCommandGain(state: GameState): number {
  let value = 1;
  if (state.upgrades.includes("bactoprenol-flow")) value += 0.08;
  if (state.upgrades.includes("mreB-alignment")) value += 0.06;
  return value;
}

function dailyBoard(): string {
  return `daily-${new Intl.DateTimeFormat("en-CA", { timeZone: LAB_TIMEZONE }).format(new Date())}`;
}

function effect(type: EffectEvent["type"], x: number, z: number, label: string): EffectEvent {
  return { id: nextId++, type, x, z, label, age: 0 };
}

function formatDuration(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function lerp(start: number, end: number, alpha: number): number {
  return start + (end - start) * clamp(alpha, 0, 1);
}
