import RAPIER from "@dimforge/rapier3d-compat";
import { COMMANDS, SPECIES, SPECIES_ORDER, UPGRADES } from "./content";
import { createAudioController } from "./audio";
import { createLeaderboardClient } from "./leaderboard";
import { createV3Renderer, type V3Renderer } from "./render";
import { detectEnvelopeV3WebGLSupport } from "./render/webgl-support";
import { V3Simulation, createInputState } from "./simulation";
import type { CommandId, HudSnapshot, InputState, LeaderboardPayload, RunReport, RunStatus, UpgradeId } from "./types";
import { ensureEnvelopeV3Stylesheet, openEnvelopeV3Fallback } from "./ui/fallbackNotice";

declare global {
  interface Window {
    ENVELOPE_LEADERBOARD_URL?: string;
  }
}

const LAB_TIMEZONE = "America/New_York";
const NAME_KEY = "bernhardt-envelope-escape-v3-name";
const MOTION_KEY = "bernhardt-envelope-escape-v3-motion";
const RAPIER_WASM_FILE = "rapier_wasm3d_bg.wasm";
const RAPIER_WASM_URL = new URL(RAPIER_WASM_FILE, import.meta.url).href;

let active: EnvelopeV3Controller | null = null;

interface OpenOptions {
  force?: boolean;
  mode?: "classic" | "daily";
  speciesId?: string;
}

export async function openEnvelopeEscapeV3(options: OpenOptions = {}): Promise<{ ok: boolean; reason?: string; controller?: EnvelopeV3Controller }> {
  ensureEnvelopeV3Stylesheet();
  const support = detectEnvelopeV3WebGLSupport();
  if (!options.force && !support.ok) {
    openEnvelopeV3Fallback(support.reason);
    return { ok: false, reason: support.reason };
  }
  if (active) {
    active.open();
    return { ok: true, controller: active };
  }
  try {
    await (RAPIER.init as (options?: { module_or_path?: string }) => Promise<void>)({ module_or_path: RAPIER_WASM_URL });
  } catch {
    const reason = "Rapier physics failed to initialize in this browser.";
    openEnvelopeV3Fallback(reason);
    return { ok: false, reason };
  }
  active = new EnvelopeV3Controller(options);
  active.open();
  return { ok: true, controller: active };
}

export function destroyEnvelopeEscapeV3(): void {
  active?.destroy();
  active = null;
}

class EnvelopeV3Controller {
  private readonly dialog: HTMLDialogElement;
  private readonly refs: ReturnType<typeof collectRefs>;
  private readonly sim = new V3Simulation();
  private readonly input = createInputState();
  private readonly audio = createAudioController();
  private readonly leaderboard = createLeaderboardClient({ url: String(window.ENVELOPE_LEADERBOARD_URL || "") });
  private readonly renderer: V3Renderer;
  private readonly resizeObserver: ResizeObserver;
  private readonly seenEffects = new Set<number>();
  private frame = 0;
  private lastTime = performance.now();
  private reportRendered = false;

  constructor(options: OpenOptions) {
    this.dialog = createDialog();
    this.refs = collectRefs(this.dialog);
    this.renderer = createV3Renderer(this.refs.gameRoot);
    this.resizeObserver = new ResizeObserver(() => this.renderer.resize());
    this.resizeObserver.observe(this.refs.gameRoot);
    populateSpecies(this.refs.species);
    this.refs.name.value = readText(NAME_KEY);
    this.refs.motion.value = readText(MOTION_KEY) || "full";
    this.bind();
    this.renderMenu();
    if (options.mode) this.startRun(options.mode, options.speciesId || this.refs.species.value);
  }

  open(): void {
    if (!this.dialog.open) this.dialog.showModal();
    this.renderer.resize();
    this.loop();
    void this.refreshScores("classic");
  }

  destroy(): void {
    cancelAnimationFrame(this.frame);
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    this.resizeObserver.disconnect();
    this.renderer.dispose();
    this.dialog.remove();
    if (active === this) active = null;
  }

  private bind(): void {
    this.refs.close.addEventListener("click", () => this.dialog.close());
    this.dialog.addEventListener("close", () => this.destroy());
    this.refs.name.addEventListener("input", () => writeText(NAME_KEY, this.refs.name.value));
    this.refs.motion.addEventListener("change", () => {
      writeText(MOTION_KEY, this.refs.motion.value);
      this.dialog.classList.toggle("is-calm-motion", this.refs.motion.value !== "full");
    });
    this.refs.sound.addEventListener("click", () => {
      this.audio.setEnabled(!this.audio.enabled);
      this.refs.sound.textContent = this.audio.enabled ? "Sound On" : "Sound Off";
      this.refs.sound.setAttribute("aria-pressed", String(this.audio.enabled));
    });
    this.refs.classic.addEventListener("click", () => this.startRun("classic", this.refs.species.value));
    this.refs.daily.addEventListener("click", () => this.startRun("daily", this.refs.species.value));
    this.refs.pause.addEventListener("click", () => {
      this.sim.togglePause();
      this.renderState();
    });
    this.refs.restart.addEventListener("click", () => this.startRun(this.sim.state.mode, this.sim.state.selectedSpeciesId));
    this.refs.refreshScores.addEventListener("click", () => void this.refreshScores(this.sim.state.board));
    this.refs.submitScore.addEventListener("click", () => void this.submitScore());
    this.refs.commandButtons.forEach((button) => {
      button.addEventListener("click", () => this.triggerCommand(button.dataset.command as CommandId));
    });
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
  }

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    if (!this.dialog.open || event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) return;
    if (applyKey(this.input, event, true)) event.preventDefault();
    if (event.key === "1") this.triggerCommand("pg");
    if (event.key === "2") this.triggerCommand("membrane");
    if (event.key === "3") this.triggerCommand("phage");
    if (event.key === "4") this.triggerCommand("motility");
    if (event.key.toLowerCase() === "p" || event.key === "Escape") {
      event.preventDefault();
      this.sim.togglePause();
      this.renderState();
    }
  };

  private readonly onKeyUp = (event: KeyboardEvent): void => {
    if (applyKey(this.input, event, false)) event.preventDefault();
  };

  private startRun(mode: "classic" | "daily", speciesId: string): void {
    this.reportRendered = false;
    this.seenEffects.clear();
    this.sim.start({ mode, speciesId, playerName: this.refs.name.value });
    this.sim.beginRun();
    this.dialog.classList.add("is-playing");
    this.dialog.classList.remove("is-ended", "is-upgrade");
    hide(this.refs.menu);
    hide(this.refs.report);
    hide(this.refs.upgrades);
    this.audio.play("phase");
    void this.refreshScores(this.sim.state.board);
    this.renderState();
  }

  private triggerCommand(command: CommandId): void {
    if (this.sim.triggerCommand(command)) {
      this.input.commandWheel = false;
      this.audio.play("command");
      this.renderState();
    }
  }

  private loop = (): void => {
    const now = performance.now();
    const dt = Math.min(0.05, Math.max(0, (now - this.lastTime) / 1000));
    this.lastTime = now;
    this.sim.setCommandWheel(this.input.commandWheel);
    this.sim.update(this.input, dt);
    this.renderer.update(this.sim.state, dt);
    this.playNewEffects();
    this.renderState();
    this.frame = requestAnimationFrame(this.loop);
  };

  private renderState(): void {
    const snapshot = this.sim.hud();
    renderHud(this.refs, snapshot);
    this.dialog.classList.toggle("is-commanding", this.sim.state.status === "command");
    this.dialog.classList.toggle("is-upgrade", this.sim.state.status === "upgrade");
    this.dialog.classList.toggle("is-paused", this.sim.state.status === "paused");
    this.refs.pause.textContent = this.sim.state.status === "paused" ? "Resume" : "Pause";
    this.refs.commandButtons.forEach((button) => {
      const ready = this.sim.state.commandCharge >= 100 && (this.sim.state.status === "running" || this.sim.state.status === "command");
      button.disabled = !ready;
      button.classList.toggle("is-ready", ready);
    });
    if (this.sim.state.status === "upgrade") this.renderUpgrades();
    if (this.sim.state.status === "ended" && !this.reportRendered) this.renderReport(this.sim.report());
  }

  private renderMenu(): void {
    this.dialog.classList.remove("is-playing", "is-ended", "is-upgrade", "is-paused");
    show(this.refs.menu);
    hide(this.refs.upgrades);
    hide(this.refs.report);
    renderSpeciesTrait(this.refs, this.refs.species.value);
    this.refs.species.addEventListener("change", () => renderSpeciesTrait(this.refs, this.refs.species.value));
  }

  private renderUpgrades(): void {
    show(this.refs.upgrades);
    this.refs.upgradesList.innerHTML = "";
    this.sim.state.upgradeChoices.forEach((id) => {
      const upgrade = UPGRADES[id];
      const button = document.createElement("button");
      button.type = "button";
      button.className = "envelope-v3-upgrade-card";
      button.innerHTML = `<span>${escapeHtml(upgrade.command || "system")}</span><strong>${escapeHtml(upgrade.title)}</strong><p>${escapeHtml(upgrade.copy)}</p>`;
      button.addEventListener("click", () => {
        this.sim.chooseUpgrade(id);
        hide(this.refs.upgrades);
        this.audio.play("upgrade");
        this.renderState();
      });
      this.refs.upgradesList.append(button);
    });
  }

  private renderReport(report: RunReport): void {
    this.reportRendered = true;
    this.dialog.classList.add("is-ended");
    show(this.refs.report);
    this.refs.reportSummary.innerHTML = `
      <strong>${Number(report.score).toLocaleString()} points</strong>
      <span>${escapeHtml(report.speciesLabel)} | ${escapeHtml(report.phaseReached)} | ${escapeHtml(report.survived)}</span>
      <span>${escapeHtml(formatTimestamp(report.completedAt))}</span>
      <span>Lysis cause: ${escapeHtml(report.lysisCause)}</span>
      <span>Upgrades: ${escapeHtml(report.upgrades.join(", ") || "none")}</span>
    `;
    this.refs.submitName.value = this.refs.name.value || "Anonymous";
    this.audio.play("lysis");
  }

  private async submitScore(): Promise<void> {
    this.refs.submitStatus.textContent = "Submitting score...";
    const payload = await this.leaderboard.submit(this.sim.scoreEntry(this.refs.submitName.value));
    this.refs.submitStatus.textContent = payload.mode === "global" ? `Score saved to shared board${payload.rank ? ` at rank #${payload.rank}` : ""}.` : "Score saved locally. Shared board was unavailable.";
    renderScores(this.refs, payload);
  }

  private async refreshScores(board: string): Promise<void> {
    renderScores(this.refs, await this.leaderboard.refresh(board));
  }

  private playNewEffects(): void {
    this.sim.state.effects.forEach((effect) => {
      if (this.seenEffects.has(effect.id)) return;
      this.seenEffects.add(effect.id);
      if (effect.type === "pickup") this.audio.play("pickup");
      else if (effect.type === "damage") this.audio.play("damage");
      else if (effect.type === "dash") this.audio.play("dash");
      else if (effect.type === "phase") this.audio.play("phase");
    });
  }
}

function createDialog(): HTMLDialogElement {
  const dialog = document.createElement("dialog");
  dialog.className = "envelope-v3-modal";
  dialog.setAttribute("aria-labelledby", "envelope-v3-title");
  dialog.innerHTML = `
    <div class="envelope-v3-shell">
      <header class="envelope-v3-topbar">
        <div>
          <p class="envelope-v3-eyebrow">Hidden Lab Arcade</p>
          <h2 id="envelope-v3-title">Envelope Escape V3: Stress Command Chamber</h2>
        </div>
        <div class="envelope-v3-actions">
          <button data-v3="sound" type="button" aria-pressed="false">Sound Off</button>
          <label>Motion <select data-v3="motion"><option value="full">Full</option><option value="calm">Calm</option><option value="off">Off</option></select></label>
          <button data-v3="close" type="button" aria-label="Close game">Close</button>
        </div>
      </header>
      <main class="envelope-v3-layout">
        <section class="envelope-v3-stage">
          <div class="envelope-v3-game-root"></div>
          <section class="envelope-v3-hud" aria-label="Run status">
            <div><span>Score</span><strong data-v3-hud="score">0</strong></div>
            <div><span>Time</span><strong data-v3-hud="time">0:00</strong></div>
            <div><span>Integrity</span><strong data-v3-hud="integrity">100%</strong></div>
            <div><span>Command</span><strong data-v3-hud="charge">0%</strong></div>
          </section>
          <section class="envelope-v3-objective">
            <span data-v3-hud="phase">Homeostasis</span>
            <strong data-v3-hud="objective">Collect envelope modules.</strong>
            <em data-v3-hud="pressure">Balanced load</em>
          </section>
          <section class="envelope-v3-radial" aria-label="Command wheel">
            <button data-command="pg" type="button">1 <strong>PG synthesis</strong><span>Build wall</span></button>
            <button data-command="membrane" type="button">2 <strong>Membrane repair</strong><span>Seal failure</span></button>
            <button data-command="phage" type="button">3 <strong>Phage defense</strong><span>Purge bloom</span></button>
            <button data-command="motility" type="button">4 <strong>Motility</strong><span>Evade</span></button>
          </section>
          <section class="envelope-v3-menu">
            <p class="envelope-v3-kicker">3D microscope survival</p>
            <h3>Command the envelope before it fails.</h3>
            <p>Move through the chamber, read stress telegraphs, hold Space for slow-time commands, and draft upgrades between assay events.</p>
            <div class="envelope-v3-fields">
              <label>Model bacterium <select data-v3="species"></select></label>
              <label>Leaderboard name <input data-v3="name" maxlength="24" autocomplete="nickname" placeholder="Anonymous" /></label>
            </div>
            <article class="envelope-v3-trait">
              <span>Species trait</span>
              <strong data-v3-hud="trait-title">Envelope homeostasis</strong>
              <p data-v3-hud="trait-copy">Balanced handling and faster command charging.</p>
            </article>
            <div class="envelope-v3-starts">
              <button data-v3="classic" type="button">Start Classic Run</button>
              <button data-v3="daily" type="button">Daily Challenge</button>
            </div>
          </section>
          <section class="envelope-v3-upgrades" hidden>
            <p class="envelope-v3-kicker">Upgrade draft</p>
            <h3>Choose one envelope system.</h3>
            <div data-v3="upgrades"></div>
          </section>
          <section class="envelope-v3-report" hidden>
            <p class="envelope-v3-kicker">Run report</p>
            <h3>Cell lysis</h3>
            <p data-v3="report-summary"></p>
            <label>Log this score as <input data-v3="submit-name" maxlength="24" autocomplete="nickname" placeholder="Anonymous" /></label>
            <div class="envelope-v3-starts">
              <button data-v3="submit-score" type="button">Submit Score</button>
            </div>
            <p data-v3="submit-status" aria-live="polite"></p>
          </section>
        </section>
        <aside class="envelope-v3-scores">
          <div>
            <span>Leaderboard</span>
            <strong data-v3-hud="score-mode">Classic board</strong>
            <p data-v3-hud="score-meta">Finish a run to record a score.</p>
          </div>
          <ol data-v3-hud="scores"></ol>
        </aside>
      </main>
      <footer class="envelope-v3-controls">
        <span>WASD/arrows move | Shift dash | Hold Space command wheel | 1-4 command | P pause</span>
        <button data-v3="pause" type="button">Pause</button>
        <button data-v3="restart" type="button">Restart</button>
        <button data-v3="refresh-scores" type="button">Refresh Scores</button>
      </footer>
    </div>
  `;
  document.body.append(dialog);
  return dialog;
}

function collectRefs(dialog: HTMLDialogElement) {
  return {
    close: required<HTMLButtonElement>(dialog, '[data-v3="close"]'),
    sound: required<HTMLButtonElement>(dialog, '[data-v3="sound"]'),
    motion: required<HTMLSelectElement>(dialog, '[data-v3="motion"]'),
    gameRoot: required<HTMLElement>(dialog, ".envelope-v3-game-root"),
    menu: required<HTMLElement>(dialog, ".envelope-v3-menu"),
    upgrades: required<HTMLElement>(dialog, ".envelope-v3-upgrades"),
    upgradesList: required<HTMLElement>(dialog, '[data-v3="upgrades"]'),
    report: required<HTMLElement>(dialog, ".envelope-v3-report"),
    reportSummary: required<HTMLElement>(dialog, '[data-v3="report-summary"]'),
    submitName: required<HTMLInputElement>(dialog, '[data-v3="submit-name"]'),
    submitScore: required<HTMLButtonElement>(dialog, '[data-v3="submit-score"]'),
    submitStatus: required<HTMLElement>(dialog, '[data-v3="submit-status"]'),
    species: required<HTMLSelectElement>(dialog, '[data-v3="species"]'),
    name: required<HTMLInputElement>(dialog, '[data-v3="name"]'),
    classic: required<HTMLButtonElement>(dialog, '[data-v3="classic"]'),
    daily: required<HTMLButtonElement>(dialog, '[data-v3="daily"]'),
    pause: required<HTMLButtonElement>(dialog, '[data-v3="pause"]'),
    restart: required<HTMLButtonElement>(dialog, '[data-v3="restart"]'),
    refreshScores: required<HTMLButtonElement>(dialog, '[data-v3="refresh-scores"]'),
    commandButtons: Array.from(dialog.querySelectorAll<HTMLButtonElement>("[data-command]")),
    hud: (name: string) => required<HTMLElement>(dialog, `[data-v3-hud="${name}"]`)
  };
}

function populateSpecies(select: HTMLSelectElement): void {
  SPECIES_ORDER.forEach((id) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = SPECIES[id].label;
    select.append(option);
  });
}

function renderHud(refs: ReturnType<typeof collectRefs>, snapshot: HudSnapshot): void {
  refs.hud("score").textContent = Number(snapshot.score).toLocaleString();
  refs.hud("time").textContent = snapshot.timeLabel;
  refs.hud("integrity").textContent = `${snapshot.integrity}%`;
  refs.hud("charge").textContent = `${snapshot.commandCharge}%`;
  refs.hud("phase").textContent = snapshot.phaseTitle;
  refs.hud("objective").textContent = `${snapshot.objective} (${snapshot.objectiveProgress}/${snapshot.objectiveTarget})`;
  refs.hud("pressure").textContent = snapshot.phasePressure;
}

function renderScores(refs: ReturnType<typeof collectRefs>, payload: LeaderboardPayload): void {
  refs.hud("score-mode").textContent = payload.mode === "global" ? "Shared board" : payload.mode === "fallback" ? "Local fallback" : "Local board";
  refs.hud("score-meta").textContent = `${payload.totalEntries} recorded ${payload.totalEntries === 1 ? "run" : "runs"} on ${payload.board}`;
  const list = refs.hud("scores") as HTMLOListElement;
  list.innerHTML = "";
  if (!payload.entries.length) {
    const empty = document.createElement("li");
    empty.textContent = "No scores recorded yet.";
    list.append(empty);
    return;
  }
  payload.entries.forEach((entry, index) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>#${index + 1}</span><strong>${escapeHtml(entry.name)}</strong><em>${Number(entry.score).toLocaleString()} pts | ${escapeHtml(SPECIES[entry.species]?.shortLabel || entry.species)}</em><small>${escapeHtml(formatTimestamp(entry.playedAt))}</small>`;
    list.append(li);
  });
}

function renderSpeciesTrait(refs: ReturnType<typeof collectRefs>, speciesId: string): void {
  const species = SPECIES[speciesId as keyof typeof SPECIES] || SPECIES.ecoli;
  refs.hud("trait-title").textContent = species.traitTitle;
  refs.hud("trait-copy").textContent = species.traitCopy;
}

function applyKey(input: InputState, event: KeyboardEvent, pressed: boolean): boolean {
  const key = event.key.toLowerCase();
  if (key === "w" || key === "arrowup") input.moveZ = pressed ? -1 : input.moveZ === -1 ? 0 : input.moveZ;
  else if (key === "s" || key === "arrowdown") input.moveZ = pressed ? 1 : input.moveZ === 1 ? 0 : input.moveZ;
  else if (key === "a" || key === "arrowleft") input.moveX = pressed ? -1 : input.moveX === -1 ? 0 : input.moveX;
  else if (key === "d" || key === "arrowright") input.moveX = pressed ? 1 : input.moveX === 1 ? 0 : input.moveX;
  else if (key === "shift") input.dash = pressed;
  else if (key === " ") input.commandWheel = pressed;
  else return false;
  return true;
}

function canRunV3(): boolean {
  const coarse = window.matchMedia?.("(pointer: coarse)")?.matches || window.innerWidth < 900;
  if (coarse) return false;
  const canvas = document.createElement("canvas");
  return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
}

function show(element: HTMLElement): void {
  element.hidden = false;
}

function hide(element: HTMLElement): void {
  element.hidden = true;
}

function required<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector(selector);
  if (!element) throw new Error(`Envelope Escape V3 missing ${selector}`);
  return element as T;
}

function readText(key: string): string {
  try {
    return window.localStorage.getItem(key) || "";
  } catch {
    return "";
  }
}

function writeText(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* no-op */
  }
}

function formatTimestamp(value: number): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Completion time unavailable";
  return new Intl.DateTimeFormat("en-US", {
    timeZone: LAB_TIMEZONE,
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short"
  })
    .format(date)
    .replace(/\bE[DS]T\b/, "ET");
}

function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const map: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return map[character];
  });
}
