import { CHAMBER, COMMANDS, LAB_PROPS, PHASES, SPECIES, UPGRADES, WORLD_ZONES } from "./content";
import { createSeededRandom, hashString, pick, randomRange, type RandomFn } from "./rng";
import type {
  CollisionProxy,
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
  UpgradeId,
  WorldZone,
  WorldZoneId
} from "./types";

const BOARD_PATTERN = /^(classic|daily-\d{4}-\d{2}-\d{2})$/;
const UPGRADE_IDS = Object.keys(UPGRADES) as UpgradeId[];
const LAB_TIMEZONE = "America/New_York";
const FINAL_PHASE_INDEX = PHASES.length - 1;

const ZONES_BY_ID = Object.fromEntries(WORLD_ZONES.map((zone) => [zone.id, zone])) as Record<WorldZoneId, WorldZone>;
const PICKUP_LABELS: Record<PickupEntity["kind"], string> = {
  pipetteTip: "sterile tip",
  reagentDroplet: "reagent droplet",
  agarPlug: "agar plug",
  mediaBead: "media bead"
};
const PICKUPS_BY_ZONE: Record<WorldZoneId, PickupEntity["kind"][]> = {
  microscopeSlide: ["mediaBead", "agarPlug"],
  pipetteZone: ["pipetteTip", "reagentDroplet"],
  petriDish: ["agarPlug", "mediaBead"],
  fernbachFlask: ["reagentDroplet", "mediaBead"],
  centrifuge: ["pipetteTip", "mediaBead"],
  tubeRack: ["pipetteTip", "reagentDroplet"]
};

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
    const seed = mode === "daily" ? hashString(`envelope-v3-lab-bench-${board}-${speciesId}`) : hashString(`envelope-v3-lab-bench-${speciesId}-${Date.now()}-${Math.random()}`);
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
    this.state.effects.push(effect("phase", this.state.player.x, this.state.player.z, "Lab bench online"));
    for (let index = 0; index < 10; index += 1) this.spawnPickup(pick(this.random, ["microscopeSlide", "pipetteZone", "fernbachFlask"] as WorldZoneId[]));
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
    this.state.phaseTime = 0;
    this.state.assembly = 0;
    this.state.carriedPickup = "";
    this.state.combo = 0;
    this.state.jobStage = 0;
    this.state.jobStep = "";
    this.state.phaseIndex = Math.min(this.state.phaseIndex + 1, FINAL_PHASE_INDEX);
    this.state.status = "running";
    this.state.previousStatus = "running";
    this.state.effects.push(effect("upgrade", this.state.player.x, this.state.player.z, UPGRADES[upgradeId].title));
    for (let index = 0; index < 4; index += 1) this.spawnPickup(PHASES[this.state.phaseIndex].targetZone);
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
      cleared = clearHazards(state, state.player, 9.5, ["shock"]);
      state.score += 260 + cleared * 115;
      if (PHASES[state.phaseIndex].id === "rackSeal") this.sealNearbyBreaks(["rupture", "crack"], "PG patch");
      if (PHASES[state.phaseIndex].id === "lysisStorm") advanceObjective(state, 0.4 + cleared * 0.2);
    } else if (commandId === "membrane") {
      state.integrity = clamp(state.integrity + 30 * species.repairGain, 0, species.integrity + 20);
      cleared = clearHazards(state, state.player, upgraded("omp-buffer") ? 12 : 9.2, ["rupture", "crack", "spill"]);
      state.score += 240 + cleared * 100;
      if (PHASES[state.phaseIndex].id === "fernbachCurrent" || PHASES[state.phaseIndex].id === "rackSeal") this.sealNearbyBreaks(["rupture", "crack", "spill"], "membrane seal");
      if (PHASES[state.phaseIndex].id === "lysisStorm") advanceObjective(state, 0.5 + cleared * 0.25);
    } else if (commandId === "phage") {
      cleared = clearHazards(state, state.player, upgraded("restriction-burst") ? 14.5 : 10.8, ["phage", "plaque"]);
      state.score += 200 + cleared * 160;
      if (PHASES[state.phaseIndex].id === "petriBloom") advanceObjective(state, Math.max(1, cleared) * 0.8);
      if (PHASES[state.phaseIndex].id === "lysisStorm") advanceObjective(state, Math.max(0.4, cleared * 0.25));
    } else {
      state.player.dashTimer = upgraded("chemoreflex") ? 1.45 : 0.95;
      state.player.dashCooldown = 0;
      state.score += 260 + (state.zoneId === "centrifuge" ? 160 : 0);
      if (PHASES[state.phaseIndex].id === "centrifugeSweep" && state.zoneId === "centrifuge") advanceObjective(state, 0.75);
    }
    state.effects.push(effect("command", state.player.x, state.player.z, COMMANDS[commandId].shortLabel));
    return true;
  }

  update(input: InputState, dt: number): void {
    if (this.state.status !== "running" && this.state.status !== "command") return;
    const step = Math.min(0.05, Math.max(0, dt)) * (this.state.status === "command" ? 0.22 : 1);
    this.state.elapsed += step;
    this.state.phaseTime += step;
    this.state.score += step * (36 + this.state.phaseIndex * 14);
    this.state.commandCharge = clamp(this.state.commandCharge + step * 6.8 * SPECIES[this.state.speciesId].commandGain * upgradeCommandGain(this.state), 0, 100);
    this.updatePlayer(input, step);
    this.state.zoneId = zoneAt(this.state.player) || this.state.zoneId;
    this.updateObjective(step);
    this.updateSpawns(step);
    this.updatePickups(step);
    this.updateHazards(step);
    this.updateEffects(step);
    if (this.state.integrity <= 0) this.endRun("envelope lysis");
  }

  hud(): HudSnapshot {
    const phase = PHASES[this.state.phaseIndex];
    const zone = ZONES_BY_ID[this.state.zoneId];
    return {
      status: this.state.status,
      score: Math.max(0, Math.round(this.state.score)),
      timeLabel: formatDuration(this.state.elapsed),
      integrity: Math.max(0, Math.round(this.state.integrity)),
      commandCharge: Math.round(this.state.commandCharge),
      phaseTitle: phase.title,
      phasePressure: `${phase.pressure} | ${zone.shortLabel}`,
      zoneLabel: zone.label,
      objective: phase.objective,
      objectiveProgress: Math.min(Math.floor(this.state.phaseProgress), phase.target),
      objectiveTarget: phase.target,
      board: this.state.board,
      speciesLabel: SPECIES[this.state.speciesId].label,
      upgradeCount: this.state.upgrades.length,
      carriedLabel: this.state.carriedPickup ? PICKUP_LABELS[this.state.carriedPickup] : "empty",
      comboLabel: this.state.combo > 1 ? `x${this.state.combo}` : "ready",
      nextHazardLabel: this.state.nextHazardLabel || "watch telegraphs",
      jobStep: this.state.jobStep || stationStep(this.state)
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
      lysisCause: this.state.lysisCause || "cumulative lab-bench stress",
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
      state.player.dashTimer = 0.24;
      state.player.dashCooldown = 1.15;
      state.effects.push(effect("dash", state.player.x, state.player.z, "Dash"));
    }
    state.player.vx = lerp(state.player.vx, moveX * speed, 1 - Math.pow(0.001, dt));
    state.player.vz = lerp(state.player.vz, moveZ * speed, 1 - Math.pow(0.001, dt));
    state.player.x = clamp(state.player.x + state.player.vx * dt, -CHAMBER.width / 2 + CHAMBER.safeMargin, CHAMBER.width / 2 - CHAMBER.safeMargin);
    state.player.z = clamp(state.player.z + state.player.vz * dt, -CHAMBER.depth / 2 + CHAMBER.safeMargin, CHAMBER.depth / 2 - CHAMBER.safeMargin);
    resolveStaticCollisions(state);
  }

  private updateObjective(dt: number): void {
    const phase = PHASES[this.state.phaseIndex];
    this.state.jobStep = stationStep(this.state);
    this.tryDepositCarriedResource();
    if (phase.id === "petriBloom") this.tagNearbyPlaques();
    if (phase.id === "centrifugeSweep") this.updateRotorCrossing();
    if (phase.id === "lysisStorm") this.state.score += dt * (8 + this.state.combo * 2);
    if (this.state.phaseIndex === FINAL_PHASE_INDEX && this.state.phaseProgress >= phase.target) {
      this.state.score += 700;
      this.state.phaseProgress = phase.target * 0.55;
      this.state.effects.push(effect("phase", this.state.player.x, this.state.player.z, "Storm held"));
    }
  }

  private updateSpawns(dt: number): void {
    const phase = PHASES[this.state.phaseIndex];
    const pressure = 1 + this.state.phaseIndex * 0.22 + Math.min(0.45, this.state.phaseTime / 160);
    this.tickTimer("pickup", dt, Math.max(0.65, 1.9 - this.state.phaseIndex * 0.1), () => this.spawnPickup(this.random() > 0.65 ? this.state.zoneId : phase.targetZone));
    if (phase.id === "slideTraining") {
      this.state.nextHazardLabel = "light slide pulses";
      this.tickTimer("droplet", dt, 3.1, () => this.spawnHazard("droplet", "microscopeSlide"));
    } else if (phase.id === "pipettePulse") {
      this.state.nextHazardLabel = "droplet lane incoming";
      this.tickTimer("droplet", dt, Math.max(0.74, 1.9 / pressure), () => this.spawnHazard(pick(this.random, ["droplet", "shock"] as HazardKind[]), "pipetteZone"));
    } else if (phase.id === "petriBloom") {
      this.state.nextHazardLabel = "plaque seam expanding";
      this.tickTimer("phage", dt, Math.max(0.85, 2.0 / pressure), () => this.spawnHazard(pick(this.random, ["phage", "plaque"] as HazardKind[]), "petriDish"));
    } else if (phase.id === "fernbachCurrent") {
      this.state.nextHazardLabel = "media current swelling";
      this.tickTimer("spill", dt, Math.max(1.15, 2.8 / pressure), () => this.spawnHazard(pick(this.random, ["spill", "droplet", "rupture"] as HazardKind[]), "fernbachFlask"));
    } else if (phase.id === "centrifugeSweep") {
      this.state.nextHazardLabel = "rotor sweep window";
      this.tickTimer("rotor", dt, Math.max(0.9, 2.5 / pressure), () => this.spawnHazard("rotor", "centrifuge"));
      this.tickTimer("shock", dt, Math.max(1.3, 3.4 / pressure), () => this.spawnHazard("shock", "centrifuge"));
    } else if (phase.id === "rackSeal") {
      this.state.nextHazardLabel = "rupture site growing";
      this.tickTimer("crack", dt, Math.max(0.92, 2.7 / pressure), () => this.spawnHazard(pick(this.random, ["crack", "rupture", "spill"] as HazardKind[]), "tubeRack"));
    } else {
      this.state.nextHazardLabel = "full bench collapse";
      this.tickTimer("phage", dt, Math.max(0.7, 2.0 / pressure), () => this.spawnHazard(pick(this.random, ["phage", "plaque", "shock"] as HazardKind[]), pick(this.random, WORLD_ZONES).id));
      this.tickTimer("rupture", dt, Math.max(0.85, 2.5 / pressure), () => this.spawnHazard(pick(this.random, ["rupture", "shock", "phage", "spill", "rotor"] as HazardKind[]), pick(this.random, WORLD_ZONES).id));
    }
    this.tickTimer("boss", dt, Math.max(10, 22 - this.state.phaseIndex * 1.8), () => {
      this.state.effects.push(effect("phase", this.state.player.x, this.state.player.z, phase.boss));
      const bossHazards = this.phaseHazards();
      for (let i = 0; i < 2 + this.state.phaseIndex; i += 1) this.spawnHazard(pick(this.random, bossHazards), phase.targetZone);
    });
  }

  private phaseHazards(): HazardKind[] {
    const phaseId = PHASES[this.state.phaseIndex].id;
    if (phaseId === "slideTraining") return ["phage", "droplet"];
    if (phaseId === "pipettePulse") return ["droplet", "shock"];
    if (phaseId === "petriBloom") return ["phage", "plaque"];
    if (phaseId === "fernbachCurrent") return ["spill", "droplet", "rupture"];
    if (phaseId === "centrifugeSweep") return ["rotor", "shock"];
    if (phaseId === "rackSeal") return ["crack", "rupture", "spill"];
    return ["phage", "shock", "rupture", "plaque", "spill"];
  }

  private tickTimer(key: keyof GameState["timers"], dt: number, reset: number, action: () => void): void {
    this.state.timers[key] -= dt;
    if (this.state.timers[key] <= 0) {
      this.state.timers[key] = reset * randomRange(this.random, 0.72, 1.18);
      action();
    }
  }

  private spawnPickup(zoneId: WorldZoneId = PHASES[this.state.phaseIndex].targetZone): void {
    const zone = ZONES_BY_ID[zoneId];
    const kinds = PICKUPS_BY_ZONE[zoneId];
    const spawn = this.randomOpenPoint(zone);
    this.state.pickups.push({
      id: nextId++,
      kind: pick(this.random, kinds),
      x: spawn.x,
      z: spawn.z,
      radius: 0.72,
      age: 0
    });
  }

  private randomOpenPoint(zone: WorldZone): { x: number; z: number } {
    for (let attempt = 0; attempt < 24; attempt += 1) {
      const point = {
        x: randomRange(this.random, zone.bounds.x - zone.bounds.width / 2 + 3, zone.bounds.x + zone.bounds.width / 2 - 3),
        z: randomRange(this.random, zone.bounds.z - zone.bounds.depth / 2 + 3, zone.bounds.z + zone.bounds.depth / 2 - 3)
      };
      if (!hitsStaticProxy(point, 1.4)) return point;
    }
    return { x: zone.bounds.x, z: zone.bounds.z };
  }

  private spawnHazard(kind: HazardKind, zoneId: WorldZoneId = PHASES[this.state.phaseIndex].targetZone): void {
    const zone = ZONES_BY_ID[zoneId];
    const point = this.randomOpenPoint(zone);
    let x = point.x;
    let z = point.z;
    let vx = 0;
    let vz = 0;
    let radius = 1.1;
    let width = 1.2;
    let angle = randomRange(this.random, -Math.PI, Math.PI);
    let telegraph = 1;
    let duration = 6;
    let damage = 12;
    let angularSpeed: number | undefined;

    if (kind === "phage" || kind === "droplet") {
      const fromHorizontalEdge = this.random() > 0.5;
      const side = this.random() > 0.5 ? 1 : -1;
      x = fromHorizontalEdge ? zone.bounds.x + side * zone.bounds.width * 0.58 : randomRange(this.random, zone.bounds.x - zone.bounds.width / 2, zone.bounds.x + zone.bounds.width / 2);
      z = fromHorizontalEdge ? randomRange(this.random, zone.bounds.z - zone.bounds.depth / 2, zone.bounds.z + zone.bounds.depth / 2) : zone.bounds.z + side * zone.bounds.depth * 0.58;
      const toPlayerX = this.state.player.x - x;
      const toPlayerZ = this.state.player.z - z;
      const len = Math.hypot(toPlayerX, toPlayerZ) || 1;
      const base = kind === "phage" ? 6.1 : 4.8;
      vx = (toPlayerX / len) * base;
      vz = (toPlayerZ / len) * base;
      radius = kind === "phage" ? 0.7 : 0.95;
      telegraph = kind === "phage" ? 0.62 : 0.95;
      duration = 6.6;
      damage = kind === "phage" ? 12 : 15;
      angle = Math.atan2(vz, vx);
    } else if (kind === "shock") {
      width = 1.35;
      radius = 14;
      telegraph = 1.15;
      duration = 6.3;
      damage = 18;
      const moveAngle = angle + Math.PI / 2;
      vx = Math.cos(moveAngle) * 1.5;
      vz = Math.sin(moveAngle) * 1.5;
    } else if (kind === "rotor") {
      const rotor = LAB_PROPS.find((prop) => prop.id === "bench-centrifuge");
      x = rotor?.x ?? zone.bounds.x;
      z = rotor?.z ?? zone.bounds.z;
      radius = 13.2;
      width = 1.4;
      telegraph = 0.8;
      duration = 5.4;
      damage = 19;
      angularSpeed = (this.random() > 0.5 ? 1 : -1) * randomRange(this.random, 1.8, 2.8);
    } else if (kind === "crack") {
      width = randomRange(this.random, 9, 16);
      radius = 8;
      telegraph = 1.25;
      duration = 7;
      damage = 16;
    } else if (kind === "rupture" || kind === "plaque" || kind === "spill") {
      radius = kind === "plaque" ? 1.9 : kind === "spill" ? 2.2 : 1.5;
      width = radius * 2;
      telegraph = kind === "spill" ? 0.75 : 1.15;
      duration = kind === "spill" ? 9 : 8;
      damage = kind === "plaque" ? 14 : kind === "spill" ? 13 : 21;
    }

    this.state.hazards.push({ id: nextId++, kind, zoneId, x, z, vx, vz, radius, width, angle, age: 0, telegraph, duration, damage, angularSpeed });
  }

  private updatePickups(dt: number): void {
    const magnet = this.state.speciesId === "kpneumoniae" || this.state.upgrades.includes("bactoprenol-flow") ? 6.8 : 3.2;
    this.state.pickups = this.state.pickups.filter((pickup) => {
      pickup.age += dt;
      const dx = this.state.player.x - pickup.x;
      const dz = this.state.player.z - pickup.z;
      const distance = Math.hypot(dx, dz);
      if (distance < magnet) {
        pickup.x += (dx / Math.max(0.01, distance)) * dt * 4.2;
        pickup.z += (dz / Math.max(0.01, distance)) * dt * 4.2;
      }
      if (distance < pickup.radius + this.state.player.radius) {
        this.collectPickup(pickup);
        return false;
      }
      return pickup.age < 28;
    });
    while (this.state.pickups.length < 9) this.spawnPickup(this.random() > 0.6 ? this.state.zoneId : PHASES[this.state.phaseIndex].targetZone);
  }

  private collectPickup(pickup: PickupEntity): void {
    const commandBonus = this.state.upgrades.includes("bactoprenol-flow") ? 1.25 : 1;
    const species = SPECIES[this.state.speciesId];
    const repair = pickup.kind === "reagentDroplet" ? 2 : pickup.kind === "agarPlug" ? 1.6 : 1;
    this.state.assembly += repair;
    this.state.commandCharge = clamp(this.state.commandCharge + (pickup.kind === "pipetteTip" ? 24 : 15) * species.commandGain * commandBonus, 0, 100);
    if (pickup.kind === "reagentDroplet") this.state.integrity = clamp(this.state.integrity + 5 * species.repairGain, 0, species.integrity + 18);
    this.state.score += pickup.kind === "mediaBead" ? 135 : 105;
    if (!this.state.carriedPickup) this.state.carriedPickup = pickup.kind;
    this.state.effects.push(effect("pickup", pickup.x, pickup.z, `carry ${PICKUP_LABELS[pickup.kind]}`));
    if (this.state.assembly >= this.state.assemblyTarget) {
      this.state.assembly = 0;
      this.state.integrity = clamp(this.state.integrity + 13 * species.repairGain, 0, species.integrity + 16);
      this.state.score += 440;
      this.state.effects.push(effect("command", this.state.player.x, this.state.player.z, "wall cycle"));
    }
  }

  private tryDepositCarriedResource(): void {
    const state = this.state;
    if (!state.carriedPickup) return;
    const point = depositPointForPhase(state);
    const distance = Math.hypot(state.player.x - point.x, state.player.z - point.z);
    if (distance > 4.2) return;
    const phase = PHASES[state.phaseIndex];
    const label = PICKUP_LABELS[state.carriedPickup];
    const fastBonus = Math.max(0, 18 - state.phaseTime) * 8;
    state.combo = Math.min(12, state.combo + 1);
    state.score += 340 + state.combo * 70 + fastBonus;
    state.commandCharge = clamp(state.commandCharge + 18, 0, 100);
    state.integrity = clamp(state.integrity + (state.carriedPickup === "reagentDroplet" ? 8 : 4), 0, SPECIES[state.speciesId].integrity + 20);
    state.effects.push(effect("pickup", point.x, point.z, `deposited ${label}`));
    state.carriedPickup = "";
    if (phase.id === "slideTraining" || phase.id === "pipettePulse" || phase.id === "fernbachCurrent" || phase.id === "lysisStorm") advanceObjective(state, 1);
  }

  private tagNearbyPlaques(): void {
    const state = this.state;
    state.hazards.forEach((hazard) => {
      if (hazard.kind !== "plaque" || hazard.tagged) return;
      if (Math.hypot(state.player.x - hazard.x, state.player.z - hazard.z) > hazard.radius + 2.2) return;
      hazard.tagged = true;
      state.combo = Math.min(12, state.combo + 1);
      state.score += 240 + state.combo * 60;
      state.effects.push(effect("command", hazard.x, hazard.z, "plaque tagged"));
      advanceObjective(state, 1);
    });
  }

  private updateRotorCrossing(): void {
    const state = this.state;
    if (state.zoneId !== "centrifuge") return;
    if (state.player.x < 32 && (state.jobStage < 1 || state.jobStage >= 3)) {
      state.jobStage = 1;
      state.score += 90;
      state.effects.push(effect("phase", state.player.x, state.player.z, "entry pocket"));
    } else if (state.player.x > 42 && state.jobStage === 1) {
      state.jobStage = 2;
      state.combo = Math.min(12, state.combo + 1);
      state.score += 420 + state.combo * 55;
      state.effects.push(effect("phase", state.player.x, state.player.z, "sample crossed"));
      advanceObjective(state, 1);
    } else if (state.player.x > 52 && state.jobStage === 2) {
      state.jobStage = 3;
      state.combo = Math.min(12, state.combo + 1);
      state.score += 520 + state.combo * 60;
      state.effects.push(effect("phase", state.player.x, state.player.z, "escape lane"));
      advanceObjective(state, 1);
    }
  }

  private sealNearbyBreaks(kinds: HazardKind[], label: string): void {
    const state = this.state;
    let sealed = 0;
    state.hazards = state.hazards.filter((hazard) => {
      if (!kinds.includes(hazard.kind) || Math.hypot(state.player.x - hazard.x, state.player.z - hazard.z) > hazard.radius + 5.5) return true;
      sealed += 1;
      state.effects.push(effect("command", hazard.x, hazard.z, label));
      return false;
    });
    if (!sealed) return;
    state.combo = Math.min(12, state.combo + sealed);
    state.score += sealed * (360 + state.combo * 45);
    advanceObjective(state, sealed);
  }

  private updateHazards(dt: number): void {
    this.state.hazards = this.state.hazards.filter((hazard) => {
      hazard.age += dt;
      if (hazard.age > hazard.telegraph) {
        hazard.x += hazard.vx * dt;
        hazard.z += hazard.vz * dt;
        if (hazard.angularSpeed) hazard.angle += hazard.angularSpeed * dt;
      }
      if (hazard.kind === "rupture") hazard.radius += dt * 0.72;
      if (hazard.kind === "plaque") hazard.radius += dt * 0.48;
      if (hazard.kind === "spill") hazard.radius += dt * 0.22;
      if (this.hazardHitsPlayer(hazard)) {
        this.damage(hazard);
        return false;
      }
      return hazard.age < hazard.duration && Math.abs(hazard.x) < CHAMBER.width * 0.66 && Math.abs(hazard.z) < CHAMBER.depth * 0.66;
    });
  }

  private hazardHitsPlayer(hazard: HazardEntity): boolean {
    if (hazard.age < hazard.telegraph) return false;
    if (hazard.kind === "crack" || hazard.kind === "shock" || hazard.kind === "rotor") {
      const dx = this.state.player.x - hazard.x;
      const dz = this.state.player.z - hazard.z;
      const normal = Math.abs(Math.sin(hazard.angle) * dx - Math.cos(hazard.angle) * dz);
      const along = Math.abs(Math.cos(hazard.angle) * dx + Math.sin(hazard.angle) * dz);
      const length = hazard.kind === "rotor" ? hazard.radius : hazard.kind === "shock" ? 15 : hazard.width;
      return normal < (hazard.kind === "rotor" ? 0.8 : hazard.kind === "shock" ? 0.9 : 0.7) + this.state.player.radius * 0.45 && along < length;
    }
    return Math.hypot(this.state.player.x - hazard.x, this.state.player.z - hazard.z) < hazard.radius + this.state.player.radius;
  }

  private damage(hazard: HazardEntity): void {
    const state = this.state;
    const species = SPECIES[state.speciesId];
    let amount = hazard.damage * species.damageTaken;
    if (state.upgrades.includes("capsule-surge") && state.commandCharge >= 50) amount *= 0.78;
    if (state.upgrades.includes("autolysin-brake") && (hazard.kind === "crack" || hazard.kind === "rupture" || hazard.kind === "spill")) amount *= 0.72;
    if (state.upgrades.includes("omp-buffer") && (hazard.kind === "rupture" || hazard.kind === "spill")) amount *= 0.68;
    state.integrity = clamp(state.integrity - amount, 0, 140);
    state.lysisCause = `${hazard.kind} stress near ${ZONES_BY_ID[hazard.zoneId].shortLabel}`;
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
    carriedPickup: "",
    combo: 0,
    jobStage: 0,
    jobStep: "",
    nextHazardLabel: "watch telegraphs",
    phaseIndex: 0,
    phaseTime: 0,
    phaseProgress: 0,
    zoneId: "microscopeSlide",
    upgrades: [],
    upgradeChoices: [],
    lysisCause: "",
    player: { x: -46, z: 22, vx: 0, vz: 0, radius: 0.75, dashCooldown: 0, dashTimer: 0 },
    hazards: [],
    pickups: [],
    effects: [],
    timers: { pickup: 0.2, phage: 1.2, shock: 3.2, crack: 6, rupture: 8.5, droplet: 1.8, rotor: 4.5, plaque: 4.2, spill: 6.6, boss: 13 }
  };
}

function depositPointForPhase(state: GameState): { x: number; z: number } {
  const phase = PHASES[state.phaseIndex];
  if (phase.id === "fernbachCurrent") return { x: 6, z: 10 };
  if (phase.id === "centrifugeSweep") return { x: 52, z: 8 };
  if (phase.id === "rackSeal") return { x: 15, z: 26 };
  return { x: -44, z: 22 };
}

function stationStep(state: GameState): string {
  const phase = PHASES[state.phaseIndex];
  if (state.carriedPickup) return `Carry ${PICKUP_LABELS[state.carriedPickup]} to ${phase.id === "fernbachCurrent" ? "the spill" : "the slide checkpoint"}.`;
  if (phase.id === "slideTraining") return "Pick up a bead or agar plug, then deposit it on the slide.";
  if (phase.id === "pipettePulse") return "Collect sterile pipette tips, dodge reagent lanes, and return tips to the slide.";
  if (phase.id === "petriBloom") return "Skim plaque edges to tag them; use Phage Defense for clustered clears.";
  if (phase.id === "fernbachCurrent") return "Collect reagent droplets and use Membrane Repair near media spills.";
  if (phase.id === "centrifugeSweep") {
    if (state.jobStage < 1) return "Enter the left safe pocket before the rotor sweep.";
    if (state.jobStage < 2) return "Cross through the center pocket during the opening.";
    if (state.jobStage < 3) return "Escape to the far pocket before spin-up.";
    return "Collect another sample or use Motility for a high-risk crossing.";
  }
  if (phase.id === "rackSeal") return "Find rupture sites in the rack and seal them with PG or Membrane commands.";
  return "Chain deposits and command clears while the full bench collapses.";
}

function advanceObjective(state: GameState, amount: number): void {
  if (state.status === "upgrade") return;
  const phase = PHASES[state.phaseIndex];
  state.phaseProgress = clamp(state.phaseProgress + amount, 0, phase.target);
  if (state.phaseProgress >= phase.target && state.phaseIndex < FINAL_PHASE_INDEX) {
    state.score += 980 + state.phaseIndex * 300;
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

function resolveStaticCollisions(state: GameState): void {
  LAB_PROPS.forEach((prop) => {
    prop.collision?.forEach((proxy) => resolveProxyCollision(state.player, proxy));
  });
}

function resolveProxyCollision(player: GameState["player"], proxy: CollisionProxy): void {
  if (proxy.type === "circle") {
    const dx = player.x - proxy.x;
    const dz = player.z - proxy.z;
    const distance = Math.hypot(dx, dz) || 0.001;
    const overlap = proxy.radius + player.radius - distance;
    if (overlap > 0) {
      player.x += (dx / distance) * overlap;
      player.z += (dz / distance) * overlap;
    }
    return;
  }

  const halfWidth = proxy.width / 2;
  const halfDepth = proxy.depth / 2;
  const closestX = clamp(player.x, proxy.x - halfWidth, proxy.x + halfWidth);
  const closestZ = clamp(player.z, proxy.z - halfDepth, proxy.z + halfDepth);
  const dx = player.x - closestX;
  const dz = player.z - closestZ;
  const distance = Math.hypot(dx, dz);
  if (distance > 0 && distance < player.radius) {
    const overlap = player.radius - distance;
    player.x += (dx / distance) * overlap;
    player.z += (dz / distance) * overlap;
  } else if (distance === 0 && player.x > proxy.x - halfWidth && player.x < proxy.x + halfWidth && player.z > proxy.z - halfDepth && player.z < proxy.z + halfDepth) {
    const pushX = halfWidth - Math.abs(player.x - proxy.x);
    const pushZ = halfDepth - Math.abs(player.z - proxy.z);
    if (pushX < pushZ) player.x += player.x < proxy.x ? -pushX - player.radius : pushX + player.radius;
    else player.z += player.z < proxy.z ? -pushZ - player.radius : pushZ + player.radius;
  }
}

function hitsStaticProxy(point: { x: number; z: number }, radius: number): boolean {
  return LAB_PROPS.some((prop) =>
    prop.collision?.some((proxy) => {
      if (proxy.type === "circle") return Math.hypot(point.x - proxy.x, point.z - proxy.z) < proxy.radius + radius;
      const closestX = clamp(point.x, proxy.x - proxy.width / 2, proxy.x + proxy.width / 2);
      const closestZ = clamp(point.z, proxy.z - proxy.depth / 2, proxy.z + proxy.depth / 2);
      return Math.hypot(point.x - closestX, point.z - closestZ) < radius;
    })
  );
}

function zoneAt(point: { x: number; z: number }): WorldZoneId | null {
  const zone = WORLD_ZONES.find((item) => {
    const bounds = item.bounds;
    return point.x >= bounds.x - bounds.width / 2 && point.x <= bounds.x + bounds.width / 2 && point.z >= bounds.z - bounds.depth / 2 && point.z <= bounds.z + bounds.depth / 2;
  });
  return zone?.id ?? null;
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
