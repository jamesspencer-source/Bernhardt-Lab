import { createAudioController } from "./audio";
import { SPECIES, SPECIES_ORDER } from "./content";
import { createEnvelopeGame, type EnvelopeGameController } from "./scenes";
import type { GameState, HudSnapshot, LeaderboardPayload, RunReport } from "./types";

declare global {
  interface Window {
    ENVELOPE_LEADERBOARD_URL?: string;
  }
}

let shell: ReturnType<typeof createShell> | null = null;
let controller: EnvelopeGameController | null = null;

interface ShellRefs {
  close: HTMLButtonElement;
  gameRoot: HTMLElement;
  species: HTMLSelectElement;
  name: HTMLInputElement;
  motion: HTMLSelectElement;
  audioButton: HTMLButtonElement;
  menu: HTMLElement;
  report: HTMLElement;
  scoresPanel: HTMLElement;
  scoresButton: HTMLButtonElement;
  pauseButton: HTMLButtonElement;
  toast: HTMLElement;
  scoreList: HTMLOListElement;
}

export async function openEnvelopeEscapeV2(options: { autostart?: boolean; mode?: string; speciesId?: string } = {}): Promise<{ ok: true; controller: EnvelopeGameController }> {
  shell = shell || createShell();
  if (!controller) {
    controller = createEnvelopeGame({
      parent: shell.gameRoot,
      ui: shell.ui,
      leaderboardUrl: String(window.ENVELOPE_LEADERBOARD_URL || ""),
      reducedMotion: shell.motionValue() !== "full" || window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches || false,
      audio: shell.audio
    });
    shell.bindController(controller);
  }
  if (!shell.dialog.open) shell.dialog.showModal();
  shell.ui.showMenu(controller.state);
  if (options.autostart) controller.startRun(options.mode || "classic", options.speciesId || shell.getSpeciesId(), shell.getPlayerName());
  return { ok: true, controller };
}

export function destroyEnvelopeEscapeV2(): void {
  const activeController = controller;
  const activeShell = shell;
  controller = null;
  shell = null;
  activeController?.destroy();
  if (activeShell?.dialog.open) activeShell.dialog.close();
  activeShell?.dialog.remove();
}

export function isEnvelopeEscapeV2Ready(): boolean {
  return Boolean(controller);
}

function createShell() {
  const audio = createAudioController();
  const dialog = document.createElement("dialog");
  dialog.className = "envelope-v2-modal";
  dialog.setAttribute("aria-labelledby", "envelope-v2-title");
  dialog.innerHTML = `
    <div class="envelope-v2-shell">
      <header class="envelope-v2-header">
        <div>
          <p class="envelope-v2-eyebrow">Hidden Lab Arcade</p>
          <h2 id="envelope-v2-title">Envelope Escape: Stress Test Chamber</h2>
        </div>
        <div class="envelope-v2-header-actions">
          <button class="envelope-v2-secondary" data-action="audio" type="button" aria-pressed="false">Sound Off</button>
          <label class="envelope-v2-motion">Motion <select data-control="motion"><option value="full">Full</option><option value="calm">Calm</option><option value="off">Off</option></select></label>
          <button class="envelope-v2-close" type="button" aria-label="Close game">Close</button>
        </div>
      </header>
      <div class="envelope-v2-stage">
        <div class="envelope-v2-game-root" aria-label="Envelope Escape Phaser game canvas"></div>
        <section class="envelope-v2-hud" aria-label="Run status">
          <div class="envelope-v2-hud-primary">
            <article><span>Score</span><strong data-hud="score">0</strong></article>
            <article><span>Time</span><strong data-hud="time">0:00</strong></article>
            <article><span>Integrity</span><strong data-hud="integrity">100%</strong></article>
          </div>
          <div class="envelope-v2-hud-meters">
            <label><span>Assembly</span><b data-hud="assembly-label">0 / 4</b><i><em data-hud="assembly-bar"></em></i></label>
            <label><span>Response</span><b data-hud="response-label">0%</b><i><em data-hud="response-bar"></em></i></label>
            <label><span>Objective</span><b data-hud="objective-label">0 / 5</b><i><em data-hud="objective-bar"></em></i></label>
          </div>
          <div class="envelope-v2-pressure">
            <span>Dominant Pressure</span>
            <strong data-hud="phase">Homeostatic Load</strong>
            <p data-hud="phase-note">Collect modules and learn the chamber rhythm.</p>
          </div>
        </section>
        <section class="envelope-v2-menu" data-panel="menu">
          <p class="envelope-v2-kicker">Top-down arcade survival</p>
          <h3>Keep the envelope intact.</h3>
          <p>Move, dash, collect envelope modules, dodge telegraphed hazards, and trigger the right response before lysis.</p>
          <div class="envelope-v2-tutorial">
            <strong>10-second briefing</strong>
            <span>WASD/arrows move. Shift dashes. 1/2/3 trigger Patch Wall, Purge Phages, or Boost Motility when response is full.</span>
          </div>
          <div class="envelope-v2-fields">
            <label>Model bacterium <select data-control="species"></select></label>
            <label>Leaderboard name <input data-control="name" maxlength="24" autocomplete="nickname" placeholder="Anonymous" /></label>
          </div>
          <div class="envelope-v2-trait">
            <span>Species trait</span>
            <strong data-hud="trait-title">Envelope homeostasis</strong>
            <p data-hud="trait-copy">Balanced handling and faster response charging from envelope modules.</p>
          </div>
          <div class="envelope-v2-actions">
            <button class="envelope-v2-primary" data-action="classic" type="button">Start Classic Run</button>
            <button class="envelope-v2-secondary" data-action="daily" type="button">Play Daily Challenge</button>
          </div>
          <p class="envelope-v2-note" data-hud="daily-note"></p>
        </section>
        <section class="envelope-v2-report" data-panel="report" hidden></section>
        <div class="envelope-v2-toast" data-hud="toast" hidden></div>
        <div class="envelope-v2-thumbpad" data-control="thumbpad" aria-hidden="true"><span></span></div>
      </div>
      <footer class="envelope-v2-footer">
        <div class="envelope-v2-controls">
          <button class="envelope-v2-secondary" data-action="pause" type="button">Pause</button>
          <button class="envelope-v2-secondary" data-action="restart" type="button">Restart</button>
          <button class="envelope-v2-secondary" data-action="scores" type="button" aria-expanded="false">Scores</button>
        </div>
        <div class="envelope-v2-responses" aria-label="Stress response choices">
          <button data-response="patch" type="button">1 Patch Wall</button>
          <button data-response="purge" type="button">2 Purge Phages</button>
          <button data-response="boost" type="button">3 Boost Motility</button>
        </div>
      </footer>
      <aside class="envelope-v2-score-drawer" data-panel="scores" hidden>
        <div>
          <strong data-hud="score-mode">Local board</strong>
          <p data-hud="score-meta">Finish a run to record a score.</p>
        </div>
        <ol data-hud="scores"></ol>
      </aside>
    </div>
  `;
  document.body.append(dialog);

  const refs = {
    close: requireElement<HTMLButtonElement>(dialog, ".envelope-v2-close"),
    gameRoot: requireElement<HTMLElement>(dialog, ".envelope-v2-game-root"),
    species: requireElement<HTMLSelectElement>(dialog, '[data-control="species"]'),
    name: requireElement<HTMLInputElement>(dialog, '[data-control="name"]'),
    motion: requireElement<HTMLSelectElement>(dialog, '[data-control="motion"]'),
    audioButton: requireElement<HTMLButtonElement>(dialog, '[data-action="audio"]'),
    menu: requireElement<HTMLElement>(dialog, '[data-panel="menu"]'),
    report: requireElement<HTMLElement>(dialog, '[data-panel="report"]'),
    scoresPanel: requireElement<HTMLElement>(dialog, '[data-panel="scores"]'),
    scoresButton: requireElement<HTMLButtonElement>(dialog, '[data-action="scores"]'),
    pauseButton: requireElement<HTMLButtonElement>(dialog, '[data-action="pause"]'),
    toast: requireElement<HTMLElement>(dialog, '[data-hud="toast"]'),
    scoreList: requireElement<HTMLOListElement>(dialog, '[data-hud="scores"]')
  };

  SPECIES_ORDER.forEach((id) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = SPECIES[id].label;
    refs.species.append(option);
  });
  refs.name.value = readStorageText("bernhardt-envelope-escape-name-v3");
  refs.motion.value = readStorageText("bernhardt-envelope-escape-motion-v3") || "full";
  refs.audioButton.textContent = audio.enabled ? "Sound On" : "Sound Off";
  refs.audioButton.setAttribute("aria-pressed", String(audio.enabled));

  const ui = createUi(dialog, refs);
  return {
    dialog,
    gameRoot: refs.gameRoot,
    audio,
    ui,
    motionValue: () => refs.motion.value,
    getSpeciesId: () => refs.species.value || "ecoli",
    getPlayerName: () => refs.name.value || "Anonymous",
    bindController(nextController: EnvelopeGameController) {
      refs.close.addEventListener("click", () => dialog.close());
      dialog.addEventListener("close", () => {
        if (controller === nextController) {
          nextController.destroy();
          controller = null;
        }
        if (shell?.dialog === dialog) shell = null;
        dialog.remove();
      });
      refs.name.addEventListener("input", () => writeStorageText("bernhardt-envelope-escape-name-v3", refs.name.value));
      refs.species.addEventListener("change", () => ui.updateTrait(refs.species.value));
      refs.motion.addEventListener("change", () => {
        writeStorageText("bernhardt-envelope-escape-motion-v3", refs.motion.value);
        dialog.classList.toggle("is-calm-motion", refs.motion.value !== "full");
      });
      refs.audioButton.addEventListener("click", () => {
        audio.setEnabled(!audio.enabled);
        refs.audioButton.textContent = audio.enabled ? "Sound On" : "Sound Off";
        refs.audioButton.setAttribute("aria-pressed", String(audio.enabled));
      });
      dialog.querySelector('[data-action="classic"]')?.addEventListener("click", () => nextController.startRun("classic", refs.species.value, refs.name.value));
      dialog.querySelector('[data-action="daily"]')?.addEventListener("click", () => nextController.startRun("daily", refs.species.value, refs.name.value));
      refs.pauseButton.addEventListener("click", () => nextController.togglePause());
      dialog.querySelector('[data-action="restart"]')?.addEventListener("click", () => nextController.restart());
      refs.scoresButton.addEventListener("click", () => {
        const open = refs.scoresPanel.hidden;
        refs.scoresPanel.hidden = !open;
        refs.scoresButton.setAttribute("aria-expanded", String(open));
        if (open) void nextController.refreshScores();
      });
      dialog.querySelectorAll<HTMLButtonElement>("[data-response]").forEach((button) => {
        button.addEventListener("click", () => nextController.triggerResponse(button.dataset.response || "patch"));
      });
    }
  };
}

function createUi(dialog: HTMLDialogElement, refs: ShellRefs) {
  const hud = (name: string) => requireElement<HTMLElement>(dialog, `[data-hud="${name}"]`);
  const responseButtons = Array.from(dialog.querySelectorAll<HTMLButtonElement>("[data-response]"));
  let toastTimer = 0;

  function showMenu(state: GameState): void {
    refs.menu.hidden = false;
    refs.report.hidden = true;
    dialog.classList.remove("is-playing", "is-paused", "is-ended");
    const daily = state.dailyChallenge;
    hud("daily-note").textContent = `Daily challenge: ${daily.profile.name} with ${SPECIES[daily.speciesId].label}. ${daily.profile.subtitle}`;
    updateTrait(refs.species.value);
    updateHud({
      status: "menu",
      board: "classic",
      boardLabel: "Classic board",
      speciesId: "ecoli",
      speciesLabel: SPECIES.ecoli.label,
      traitTitle: SPECIES.ecoli.traitTitle,
      traitCopy: SPECIES.ecoli.traitCopy,
      score: 0,
      timeLabel: "0:00",
      integrity: 100,
      repairProgress: 0,
      repairNeeded: 4,
      responseCharge: 0,
      dashCooldown: 0,
      phaseTitle: "Homeostatic Load",
      phaseNote: "Collect modules and learn the chamber rhythm.",
      pressure: "Balanced stress",
      objectiveTitle: "Assemble Wall",
      objectiveBrief: "Collect enough PG and Lipid II modules to complete a wall cycle.",
      objectiveProgress: 0,
      objectiveTarget: 5,
      objectiveTargetLabel: "modules",
      assemblyCycles: 0,
      dailyChallenge: daily,
      responseReady: false
    });
  }

  function showPlaying(): void {
    refs.menu.hidden = true;
    refs.report.hidden = true;
    dialog.classList.add("is-playing");
    dialog.classList.remove("is-paused", "is-ended");
    refs.pauseButton.textContent = "Pause";
  }

  function showPaused(snapshot: HudSnapshot): void {
    dialog.classList.add("is-paused");
    refs.pauseButton.textContent = "Resume";
    showToast("Paused", `${snapshot.boardLabel}. Resume when ready.`);
  }

  function showGameOver(report: RunReport): void {
    refs.menu.hidden = true;
    refs.report.hidden = false;
    dialog.classList.add("is-ended");
    refs.report.innerHTML = `
      <p class="envelope-v2-kicker">Run report</p>
      <h3>Cell lysis</h3>
      <p>${escapeHtml(report.boardLabel)}. Survived ${escapeHtml(report.survived)} with ${Number(report.score).toLocaleString()} points.</p>
      <dl>
        <div><dt>Species</dt><dd>${escapeHtml(report.speciesLabel)}</dd></div>
        <div><dt>Phase</dt><dd>${escapeHtml(report.phaseReached)}</dd></div>
        <div><dt>Objective</dt><dd>${escapeHtml(report.objectiveTitle)}</dd></div>
        <div><dt>Cause</dt><dd>${escapeHtml(report.lysisCause)}</dd></div>
        <div><dt>Assembly cycles</dt><dd>${report.assemblyCycles}</dd></div>
        ${report.placement?.rank ? `<div><dt>Board rank</dt><dd>#${report.placement.rank} (${escapeHtml(report.placement.mode || "local")})</dd></div>` : ""}
      </dl>
    `;
  }

  function updateHud(snapshot: HudSnapshot): void {
    hud("score").textContent = String(snapshot.score || 0);
    hud("time").textContent = snapshot.timeLabel || "0:00";
    hud("integrity").textContent = `${snapshot.integrity ?? 100}%`;
    hud("assembly-label").textContent = `${snapshot.repairProgress || 0} / ${snapshot.repairNeeded || 4}`;
    hud("assembly-bar").style.width = `${percent((snapshot.repairProgress || 0) / (snapshot.repairNeeded || 4))}%`;
    hud("response-label").textContent = `${snapshot.responseCharge || 0}%`;
    hud("response-bar").style.width = `${percent((snapshot.responseCharge || 0) / 100)}%`;
    hud("objective-label").textContent = `${snapshot.objectiveProgress || 0} / ${snapshot.objectiveTarget || 1}`;
    hud("objective-bar").style.width = `${percent((snapshot.objectiveProgress || 0) / (snapshot.objectiveTarget || 1))}%`;
    hud("phase").textContent = snapshot.phaseTitle || "Homeostatic Load";
    hud("phase-note").textContent = `${snapshot.objectiveTitle}: ${snapshot.objectiveBrief}`;
    responseButtons.forEach((button) => {
      button.disabled = !snapshot.responseReady;
      button.classList.toggle("is-ready", Boolean(snapshot.responseReady));
    });
  }

  function renderScores(payload: LeaderboardPayload): void {
    const modeLabel = payload.mode === "global" ? "Shared board" : payload.mode === "fallback" ? "Local fallback" : "Local board";
    hud("score-mode").textContent = modeLabel;
    hud("score-meta").textContent = `${payload.totalEntries || 0} recorded ${payload.totalEntries === 1 ? "run" : "runs"} on ${payload.board || "classic"}`;
    refs.scoreList.innerHTML = "";
    if (!payload.entries.length) {
      const empty = document.createElement("li");
      empty.textContent = "No scores recorded on this board yet.";
      refs.scoreList.append(empty);
      return;
    }
    payload.entries.forEach((entry, index) => {
      const li = document.createElement("li");
      li.innerHTML = `<span>#${index + 1}</span><strong>${escapeHtml(entry.name)}</strong><em>${Number(entry.score).toLocaleString()} pts - ${escapeHtml(SPECIES[entry.species]?.shortLabel || entry.species)}</em>`;
      refs.scoreList.append(li);
    });
  }

  function showToast(title: string, copy = ""): void {
    window.clearTimeout(toastTimer);
    refs.toast.hidden = false;
    refs.toast.innerHTML = `<strong>${escapeHtml(title)}</strong><span>${escapeHtml(copy)}</span>`;
    toastTimer = window.setTimeout(() => {
      refs.toast.hidden = true;
    }, 2700);
  }

  function updateTrait(speciesId: string): void {
    const species = SPECIES[speciesId as keyof typeof SPECIES] || SPECIES.ecoli;
    hud("trait-title").textContent = species.traitTitle;
    hud("trait-copy").textContent = species.traitCopy;
  }

  return { showMenu, showPlaying, showPaused, showGameOver, updateHud, renderScores, showToast, updateTrait };
}

function requireElement<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector(selector);
  if (!element) throw new Error(`Envelope Escape V2 missing required element: ${selector}`);
  return element as T;
}

function percent(value: number): number {
  return Math.max(0, Math.min(100, value * 100));
}

function readStorageText(key: string): string {
  try {
    return window.localStorage.getItem(key) || "";
  } catch {
    return "";
  }
}

function writeStorageText(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, String(value || ""));
  } catch {
    /* no-op */
  }
}

function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const map: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return map[character];
  });
}
