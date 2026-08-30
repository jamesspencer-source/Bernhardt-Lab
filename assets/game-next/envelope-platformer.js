(() => {
  "use strict";

  const Phaser = window.Phaser;
  const level = window.ENVELOPE_RUNNER_LEVEL;

  if (!Phaser || !level) {
    const root = document.getElementById("envelope-next-game");
    if (root) root.textContent = "The game preview could not be loaded.";
    return;
  }

  const WORLD_HEIGHT = 720;
  const MAX_INTEGRITY = 5;
  const BOARD_KEY = "bernhardt-envelope-runner-preview-board-v3";
  const PLAYER_KEY = "bernhardt-envelope-platformer-preview-player";
  const REDUCED_MOTION = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

  const ui = {
    root: document.getElementById("envelope-next-game"),
    startScreen: document.getElementById("game-start-screen"),
    startForm: document.getElementById("game-start-form"),
    playerName: document.getElementById("game-player-name"),
    nameFeedback: document.getElementById("game-name-feedback"),
    score: document.getElementById("game-score"),
    combo: document.getElementById("game-combo"),
    comboBar: document.getElementById("game-combo-bar"),
    time: document.getElementById("game-time"),
    healthShell: document.getElementById("game-health-shell"),
    integrityPips: Array.from(document.querySelectorAll("#game-integrity-pips i")),
    integrityGroup: document.getElementById("game-integrity-pips"),
    speedPips: Array.from(document.querySelectorAll("#game-speed-pips i")),
    speedGroup: document.getElementById("game-speed-pips"),
    zoneName: document.getElementById("game-zone-name"),
    zoneCopy: document.getElementById("game-zone-copy"),
    progressBar: document.getElementById("game-progress-bar"),
    callout: document.getElementById("game-callout"),
    calloutKicker: document.getElementById("game-callout-kicker"),
    calloutTitle: document.getElementById("game-callout-title"),
    calloutCopy: document.getElementById("game-callout-copy"),
    coach: document.getElementById("game-coach"),
    coachKicker: document.getElementById("game-coach-kicker"),
    coachTitle: document.getElementById("game-coach-title"),
    coachCopy: document.getElementById("game-coach-copy"),
    toast: document.getElementById("game-toast"),
    sound: document.getElementById("game-sound"),
    pause: document.getElementById("game-pause"),
    pauseScreen: document.getElementById("game-pause-screen"),
    resume: document.getElementById("game-resume"),
    resultScreen: document.getElementById("game-result-screen"),
    resultKicker: document.getElementById("game-result-kicker"),
    resultTitle: document.getElementById("game-result-title"),
    finalScore: document.getElementById("game-final-score"),
    resultTime: document.getElementById("game-result-time"),
    resultHealth: document.getElementById("game-result-health"),
    resultPickups: document.getElementById("game-result-pickups"),
    resultCombo: document.getElementById("game-result-combo"),
    resultBonus: document.getElementById("game-result-bonus"),
    restart: document.getElementById("game-restart"),
    localBoard: document.getElementById("game-local-board"),
    liveStatus: document.getElementById("game-live-status"),
    touchControls: document.getElementById("game-touch-controls")
  };

  const touchInput = {
    jump: false,
    jumpPressed: false,
    duck: false,
    duckPressed: false
  };

  let activeScene = null;
  let currentPlayerName = "";
  let calloutTimer = 0;
  let coachTimer = 0;
  let toastTimer = 0;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function formatTime(ms) {
    const totalSeconds = Math.max(0, ms) / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const tenths = Math.floor((totalSeconds % 1) * 10);
    return `${minutes}:${String(seconds).padStart(2, "0")}.${tenths}`;
  }

  function formatScore(value) {
    return Math.max(0, Math.floor(value)).toLocaleString("en-US");
  }

  function normalizePlayerName(value) {
    return String(value ?? "")
      .replace(/[\u0000-\u001f\u007f]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 24);
  }

  function readBoard() {
    try {
      const parsed = JSON.parse(localStorage.getItem(BOARD_KEY) || "[]");
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map((entry) => ({
          name: normalizePlayerName(entry?.name) || "Anonymous",
          score: Math.max(0, Number(entry?.score) || 0),
          elapsedMs: Math.max(0, Number(entry?.elapsedMs) || 0),
          playedAt: String(entry?.playedAt || "")
        }))
        .sort((a, b) => b.score - a.score || a.elapsedMs - b.elapsedMs)
        .slice(0, 10);
    } catch {
      return [];
    }
  }

  function writeBoard(entries) {
    try {
      localStorage.setItem(BOARD_KEY, JSON.stringify(entries.slice(0, 10)));
    } catch {
      // Local score storage is optional in the preview.
    }
  }

  function addBoardEntry(entry) {
    const entries = readBoard();
    entries.push(entry);
    entries.sort((a, b) => b.score - a.score || a.elapsedMs - b.elapsedMs);
    writeBoard(entries);
    renderBoard(entries);
  }

  function formatBoardDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Playtest";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    }).format(date);
  }

  function renderBoard(entries = readBoard()) {
    if (!ui.localBoard) return;
    ui.localBoard.replaceChildren();
    if (!entries.length) {
      const empty = document.createElement("li");
      empty.className = "score-empty";
      empty.textContent = "Complete a run to set the first score on this device.";
      ui.localBoard.append(empty);
      return;
    }

    entries.slice(0, 5).forEach((entry, index) => {
      const item = document.createElement("li");
      const rank = document.createElement("span");
      const player = document.createElement("span");
      const name = document.createElement("strong");
      const meta = document.createElement("small");
      const points = document.createElement("span");

      rank.className = "score-rank";
      rank.textContent = `#${index + 1}`;
      player.className = "score-player";
      name.textContent = entry.name;
      meta.textContent = `${formatTime(entry.elapsedMs)} | ${formatBoardDate(entry.playedAt)}`;
      points.className = "score-points";
      points.textContent = formatScore(entry.score);
      player.append(name, meta);
      item.append(rank, player, points);
      ui.localBoard.append(item);
    });
  }

  function announce(kicker, title, copy, tone = "good", duration = 2300) {
    if (!ui.callout) return;
    window.clearTimeout(calloutTimer);
    ui.callout.dataset.tone = tone;
    ui.calloutKicker.textContent = kicker;
    ui.calloutTitle.textContent = title;
    ui.calloutCopy.textContent = copy;
    ui.callout.hidden = false;
    calloutTimer = window.setTimeout(() => {
      ui.callout.hidden = true;
    }, duration);
  }

  function showCoach(kicker, title, copy, tone = "neutral", duration = 3200) {
    if (!ui.coach) return;
    window.clearTimeout(coachTimer);
    ui.coach.dataset.tone = tone;
    ui.coachKicker.textContent = kicker;
    ui.coachTitle.textContent = title;
    ui.coachCopy.textContent = copy;
    ui.coach.hidden = false;
    coachTimer = window.setTimeout(() => {
      ui.coach.hidden = true;
    }, duration);
  }

  function hideCoach() {
    window.clearTimeout(coachTimer);
    if (ui.coach) ui.coach.hidden = true;
  }

  function showToast(message, duration = 1700) {
    if (!ui.toast) return;
    window.clearTimeout(toastTimer);
    ui.toast.textContent = message;
    ui.toast.hidden = false;
    toastTimer = window.setTimeout(() => {
      ui.toast.hidden = true;
    }, duration);
  }

  function setLiveStatus(message) {
    if (ui.liveStatus) ui.liveStatus.textContent = message;
  }

  function updateHud(state) {
    const multiplier = Math.max(1, state.multiplier || 1);
    const speedLevel = clamp(Math.ceil((state.speedRatio || 0) * 6), 1, 6);
    const comboStep = state.streak % 4;

    if (ui.score) ui.score.textContent = formatScore(state.score);
    if (ui.combo) ui.combo.textContent = `x${multiplier}`;
    if (ui.comboBar) ui.comboBar.style.width = `${comboStep === 0 && state.streak ? 100 : comboStep * 25}%`;
    if (ui.time) ui.time.textContent = formatTime(state.elapsedMs);
    if (ui.progressBar) ui.progressBar.style.width = `${state.progress}%`;

    ui.integrityPips.forEach((pip, index) => pip.classList.toggle("is-lost", index >= state.integrity));
    ui.speedPips.forEach((pip, index) => pip.classList.toggle("is-active", index < speedLevel));

    ui.integrityGroup?.setAttribute("aria-label", `${state.integrity} of ${MAX_INTEGRITY} integrity`);
    ui.speedGroup?.setAttribute("aria-label", `Speed ${speedLevel} of 6`);
    ui.healthShell?.classList.toggle("is-warning", state.integrity <= 2);
  }

  class AudioRack {
    constructor() {
      this.context = null;
      this.enabled = true;
      this.musicTimer = 0;
      this.musicStep = 0;
    }

    unlock() {
      if (!this.context) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) this.context = new AudioContext();
      }
      if (this.context?.state === "suspended") this.context.resume().catch(() => {});
    }

    setEnabled(enabled) {
      this.enabled = enabled;
      if (!enabled) this.stopMusic();
      else if (activeScene?.runStarted && !activeScene?.runFinished && !activeScene?.runPaused) this.startMusic();
    }

    tone(startFrequency, endFrequency, duration, type = "sine", volume = 0.025, delay = 0) {
      if (!this.enabled || !this.context) return;
      const now = this.context.currentTime + delay;
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(Math.max(20, startFrequency), now);
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency), now + duration);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(volume, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      oscillator.connect(gain);
      gain.connect(this.context.destination);
      oscillator.start(now);
      oscillator.stop(now + duration + 0.03);
    }

    noise(duration = 0.12, volume = 0.03) {
      if (!this.enabled || !this.context) return;
      const frames = Math.floor(this.context.sampleRate * duration);
      const buffer = this.context.createBuffer(1, frames, this.context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let index = 0; index < frames; index += 1) data[index] = Math.random() * 2 - 1;
      const source = this.context.createBufferSource();
      const filter = this.context.createBiquadFilter();
      const gain = this.context.createGain();
      filter.type = "bandpass";
      filter.frequency.value = 720;
      gain.gain.setValueAtTime(volume, this.context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);
      source.buffer = buffer;
      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.context.destination);
      source.start();
    }

    jump() {
      this.tone(240, 520, 0.12, "triangle", 0.028);
    }

    pickup(multiplier) {
      const base = 430 + multiplier * 60;
      this.tone(base, base * 1.28, 0.1, "sine", 0.03);
    }

    combo() {
      [520, 660, 820].forEach((frequency, index) => this.tone(frequency, frequency * 1.05, 0.18, "triangle", 0.025, index * 0.055));
    }

    hurt() {
      this.noise(0.15, 0.045);
      this.tone(180, 70, 0.24, "sawtooth", 0.04);
    }

    pbp() {
      [392, 494, 659].forEach((frequency, index) => this.tone(frequency, frequency * 1.08, 0.24, "triangle", 0.03, index * 0.08));
    }

    finish() {
      [392, 494, 587, 784].forEach((frequency, index) => this.tone(frequency, frequency * 1.08, 0.32, "triangle", 0.032, index * 0.1));
    }

    startMusic() {
      if (!this.enabled || !this.context || this.musicTimer) return;
      const sequence = [110, 147, 165, 147, 123, 165, 196, 165];
      this.musicTimer = window.setInterval(() => {
        if (!this.enabled || !activeScene?.runStarted || activeScene?.runPaused || activeScene?.runFinished) return;
        const note = sequence[this.musicStep % sequence.length];
        this.tone(note, note, 0.14, "triangle", 0.008);
        if (this.musicStep % 2 === 0) this.tone(note * 2, note * 2, 0.08, "sine", 0.005);
        this.musicStep += 1;
      }, 330);
    }

    stopMusic() {
      window.clearInterval(this.musicTimer);
      this.musicTimer = 0;
      this.musicStep = 0;
    }
  }

  const audio = new AudioRack();

  class RunnerScene extends Phaser.Scene {
    constructor() {
      super("RunnerScene");
      this.runStarted = false;
      this.runFinished = false;
      this.runPaused = false;
      this.isDucking = false;
      this.integrity = MAX_INTEGRITY;
      this.score = 0;
      this.streak = 0;
      this.multiplier = 1;
      this.bestMultiplier = 1;
      this.pickups = 0;
      this.elapsedMs = 0;
      this.pausedTotal = 0;
      this.pauseStartedAt = 0;
      this.currentSpeed = level.baseSpeed;
      this.lastGroundedAt = 0;
      this.jumpBufferedUntil = 0;
      this.jumpStartedAt = 0;
      this.jumpCutApplied = false;
      this.duckAssistUntil = 0;
      this.invulnerableUntil = 0;
      this.speedBoostUntil = 0;
      this.currentZoneIndex = 0;
      this.lastCheckpointX = level.spawnX;
      this.hasActed = false;
      this.coachShown = new Set();
      this.hazardRecords = [];
    }

    preload() {
      const base = "../assets/game-next/images/";
      this.load.image("runner-player", `${base}runner-player-v3.png`);
      this.load.image("runner-track", `${base}runner-track-v3.png`);
      this.load.image("runner-precursor", `${base}runner-precursor-v3.png`);
      this.load.image("runner-antibiotic", `${base}runner-antibiotic-v3.png`);
      this.load.image("runner-autolysin", `${base}runner-autolysin-v3.png`);
      this.load.image("runner-pbp", `${base}runner-pbp-v3.png`);
    }

    create() {
      activeScene = this;
      this.physics.world.setBounds(0, 0, level.worldWidth, WORLD_HEIGHT + 160);
      this.cameras.main.setBounds(0, 0, level.worldWidth, WORLD_HEIGHT);
      this.cameras.main.roundPixels = true;

      this.solids = this.physics.add.staticGroup();
      this.tokens = this.physics.add.staticGroup();
      this.hazards = this.physics.add.staticGroup();
      this.bonuses = this.physics.add.staticGroup();

      this.createCourse();
      this.createPlayer();
      this.createInput();
      this.createCollisions();
      this.resizeCamera(this.scale.gameSize);
      this.scale.on("resize", this.resizeCamera, this);
      this.events.once("shutdown", () => this.scale.off("resize", this.resizeCamera, this));

      this.input.keyboard.enabled = false;
      this.updateInterface();
    }

    createCourse() {
      const sortedGaps = [...level.gaps].sort((a, b) => a.x - b.x);
      let cursor = 0;
      sortedGaps.forEach((gap) => {
        this.addTrack(cursor, gap.x - gap.width / 2);
        cursor = gap.x + gap.width / 2;
      });
      this.addTrack(cursor, level.worldWidth);

      level.platforms.forEach((platform) => this.addPlatform(platform));
      level.hazards.forEach((hazard) => this.addHazard(hazard));
      level.tokenRuns.forEach((run) => this.addTokenRun(run));
      level.pbpBonuses.forEach((bonus) => this.addPbpBonus(bonus));

      const goal = this.bonuses.create(level.goalX, level.floorY - 54, "runner-pbp");
      goal.setDisplaySize(102, 106).refreshBody();
      goal.setData("goal", true);
      goal.setDepth(8);

      this.add
        .text(level.goalX, level.floorY - 137, "PBP GATE", {
          fontFamily: "Manrope, Arial, sans-serif",
          fontSize: "18px",
          fontStyle: "bold",
          color: "#f6cf68",
          backgroundColor: "rgba(4, 17, 29, 0.86)",
          padding: { x: 10, y: 6 }
        })
        .setOrigin(0.5)
        .setDepth(10);

      this.add
        .text(15240, 354, "GOLD PBP ROUTE", {
          fontFamily: "Manrope, Arial, sans-serif",
          fontSize: "17px",
          fontStyle: "bold",
          color: "#f6cf68",
          backgroundColor: "rgba(4, 17, 29, 0.8)",
          padding: { x: 11, y: 6 }
        })
        .setOrigin(0.5)
        .setDepth(9);
    }

    addTrack(start, end) {
      const width = end - start;
      if (width < 8) return;
      const center = start + width / 2;
      const visual = this.add.tileSprite(center, level.floorY + 5, width + 4, 52, "runner-track");
      visual.setTileScale(0.32, 0.68).setDepth(4);

      const zone = this.add.zone(center, level.floorY + 38, width, 76);
      this.physics.add.existing(zone, true);
      this.solids.add(zone);
    }

    addPlatform(platform) {
      const visual = this.add.tileSprite(platform.x, platform.y + 5, platform.width, 50, "runner-track");
      visual.setTileScale(0.3, 0.66).setTint(0xf5c965).setDepth(5);

      const zone = this.add.zone(platform.x, platform.y + 32, platform.width, 64);
      this.physics.add.existing(zone, true);
      this.solids.add(zone);
    }

    addHazard(definition) {
      const isCapsule = definition.type === "antibiotic";
      const visual = this.add.image(
        definition.x,
        isCapsule ? level.floorY - 28 : level.floorY - 98,
        isCapsule ? "runner-antibiotic" : "runner-autolysin"
      );
      visual.setDisplaySize(isCapsule ? 86 : 76, isCapsule ? 54 : 154).setDepth(7);

      const zone = this.add.zone(
        definition.x,
        isCapsule ? level.floorY - 13 : level.floorY - 40,
        isCapsule ? 72 : 70,
        isCapsule ? 26 : 30
      );
      this.physics.add.existing(zone, true);
      zone.setData({ type: definition.type, coach: definition.coach || "", visual });
      this.hazards.add(zone);
      this.hazardRecords.push({ ...definition, zone, visual, prompted: false });

      if (definition.coach) {
        const label = isCapsule ? "ANTIBIOTIC | JUMP" : "AUTOLYSIN | DUCK";
        this.add
          .text(definition.x, isCapsule ? level.floorY - 93 : level.floorY - 202, label, {
            fontFamily: "Manrope, Arial, sans-serif",
            fontSize: "16px",
            fontStyle: "bold",
            color: "#ffb8bd",
            backgroundColor: "rgba(54, 9, 20, 0.88)",
            padding: { x: 10, y: 6 }
          })
          .setOrigin(0.5)
          .setDepth(10);
      }
    }

    addTokenRun(run) {
      const count = run.count;
      for (let index = 0; index < count; index += 1) {
        const progress = count === 1 ? 0.5 : index / (count - 1);
        const x = run.x + index * run.spacing;
        let y = level.floorY - 54;

        if (run.shape === "arc" || run.shape === "gap") {
          y -= Math.sin(progress * Math.PI) * (run.lift || 90);
        } else if (run.shape === "wave") {
          y -= Math.abs(Math.sin(index * 0.88)) * (run.lift || 84);
        } else if (run.shape === "low") {
          y = level.floorY - 20;
        } else if (run.shape === "platform") {
          y = run.y;
        }

        const token = this.tokens.create(x, y, "runner-precursor");
        token.setDisplaySize(run.bonus ? 48 : 42, run.bonus ? 50 : 44).refreshBody();
        token.setData("bonus", Boolean(run.bonus));
        token.setDepth(8);
      }
    }

    addPbpBonus(definition) {
      const bonus = this.bonuses.create(definition.x, definition.y, "runner-pbp");
      bonus.setDisplaySize(70, 74).refreshBody();
      bonus.setData("pbp", true);
      bonus.setDepth(8);
    }

    createPlayer() {
      this.player = this.physics.add.sprite(level.spawnX, level.floorY - 21, "runner-player");
      this.player.setDisplaySize(132, 44).setAlpha(0).setDepth(12);
      this.player.setCollideWorldBounds(false);
      this.player.body.setMaxVelocity(level.maxSpeed + 80, 1100);

      const frameWidth = this.player.frame.realWidth;
      const frameHeight = this.player.frame.realHeight;
      this.playerBody = {
        width: frameWidth * 0.82,
        standHeight: frameHeight * 0.8,
        standOffsetX: frameWidth * 0.13,
        standOffsetY: frameHeight * 0.12,
        duckHeight: frameHeight * 0.4,
        duckOffsetY: frameHeight * 0.52
      };
      this.applyPlayerBody(false);

      this.playerVisual = this.add.image(this.player.x, this.player.y, "runner-player");
      this.playerVisual.setDisplaySize(132, 44).setDepth(13).setVisible(false);
      this.playerVisualBaseScale = { x: this.playerVisual.scaleX, y: this.playerVisual.scaleY };

      this.playerGhosts = [0, 1].map((index) => {
        const ghost = this.add.image(this.player.x - 26 - index * 24, this.player.y, "runner-player");
        ghost.setDisplaySize(132, 44).setAlpha(0).setTint(0x45d6e6).setDepth(11).setVisible(false);
        return ghost;
      });
    }

    createInput() {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.keys = this.input.keyboard.addKeys({
        jump: Phaser.Input.Keyboard.KeyCodes.W,
        jumpAlt: Phaser.Input.Keyboard.KeyCodes.SPACE,
        duck: Phaser.Input.Keyboard.KeyCodes.S
      });
      this.input.keyboard.removeCapture([
        Phaser.Input.Keyboard.KeyCodes.W,
        Phaser.Input.Keyboard.KeyCodes.S,
        Phaser.Input.Keyboard.KeyCodes.SPACE,
        Phaser.Input.Keyboard.KeyCodes.UP,
        Phaser.Input.Keyboard.KeyCodes.DOWN
      ]);
    }

    createCollisions() {
      this.physics.add.collider(this.player, this.solids);
      this.physics.add.overlap(this.player, this.tokens, this.collectToken, undefined, this);
      this.physics.add.overlap(this.player, this.hazards, this.hitHazard, undefined, this);
      this.physics.add.overlap(this.player, this.bonuses, this.collectBonus, undefined, this);
    }

    applyPlayerBody(ducking) {
      const metrics = this.playerBody;
      const height = ducking ? metrics.duckHeight : metrics.standHeight;
      const offsetY = ducking ? metrics.duckOffsetY : metrics.standOffsetY;
      this.player.body.setSize(metrics.width, height, false);
      this.player.body.setOffset(metrics.standOffsetX, offsetY);
    }

    resizeCamera(gameSize) {
      const zoom = Math.max(0.62, gameSize.height / WORLD_HEIGHT);
      this.cameras.main.setZoom(zoom);
    }

    startRun() {
      if (this.runStarted && !this.runFinished) return;
      this.runStarted = true;
      this.runFinished = false;
      this.runPaused = false;
      this.integrity = MAX_INTEGRITY;
      this.score = 0;
      this.streak = 0;
      this.multiplier = 1;
      this.bestMultiplier = 1;
      this.pickups = 0;
      this.elapsedMs = 0;
      this.pausedTotal = 0;
      this.pauseStartedAt = 0;
      this.currentZoneIndex = 0;
      this.runStartTime = this.time.now;
      this.lastGroundedAt = this.time.now;
      this.lastCheckpointX = level.spawnX;
      this.hasActed = false;
      this.player.setPosition(level.spawnX, level.floorY - 21).setVelocity(0, 0).setActive(true);
      this.playerVisual.setVisible(true).clearTint().setAlpha(1);
      this.playerGhosts.forEach((ghost) => ghost.setVisible(true));
      this.input.keyboard.enabled = true;
      ui.startScreen.hidden = true;
      ui.resultScreen.hidden = true;
      ui.pauseScreen.hidden = true;
      ui.pause.disabled = false;
      document.querySelector(".game-stage")?.classList.add("is-running");
      audio.startMusic();
      setLiveStatus("Run started. The cell moves automatically. Collect green precursors and avoid coral hazards.");

      this.time.delayedCall(850, () => {
        if (this.runStarted && !this.runFinished && !this.hasActed) {
          showCoach("You run automatically", "Jump the coral capsule", "Press Space, W, or the Up arrow.", "jump", 4200);
        }
      });
    }

    update(time, delta) {
      if (!this.player || !this.playerVisual) return;

      if (!this.runStarted || this.runFinished || this.runPaused) {
        this.syncPlayerVisual(time, false);
        touchInput.jumpPressed = false;
        touchInput.duckPressed = false;
        return;
      }

      const grounded = this.player.body.blocked.down || this.player.body.touching.down;
      if (grounded) this.lastGroundedAt = time;

      const jumpPressed =
        Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
        Phaser.Input.Keyboard.JustDown(this.keys.jump) ||
        Phaser.Input.Keyboard.JustDown(this.keys.jumpAlt) ||
        touchInput.jumpPressed;
      const jumpHeld = this.cursors.up.isDown || this.keys.jump.isDown || this.keys.jumpAlt.isDown || touchInput.jump;
      const duckPressed = Phaser.Input.Keyboard.JustDown(this.cursors.down) || Phaser.Input.Keyboard.JustDown(this.keys.duck) || touchInput.duckPressed;
      if (duckPressed) this.duckAssistUntil = time + 1100;
      const duckHeld = this.cursors.down.isDown || this.keys.duck.isDown || touchInput.duck || time < this.duckAssistUntil;

      if (jumpPressed) {
        this.jumpBufferedUntil = time + 170;
        this.hasActed = true;
        hideCoach();
      }
      if (duckHeld) this.hasActed = true;

      this.setDucking(duckHeld && grounded && this.jumpBufferedUntil < time);

      const jumpAvailable = time - this.lastGroundedAt <= 145;
      if (this.jumpBufferedUntil >= time && jumpAvailable) {
        this.setDucking(false);
        this.player.setVelocityY(-690);
        this.jumpStartedAt = time;
        this.jumpCutApplied = false;
        this.jumpBufferedUntil = 0;
        audio.jump();
      }

      const minimumJumpActive = !grounded && time - this.jumpStartedAt < 190;
      if (!grounded && (jumpHeld || minimumJumpActive) && this.player.body.velocity.y < 0) this.player.body.setGravityY(980);
      else this.player.body.setGravityY(1650);

      if (!jumpHeld && !this.jumpCutApplied && time - this.jumpStartedAt >= 190 && this.player.body.velocity.y < -260) {
        this.player.setVelocityY(this.player.body.velocity.y * 0.88);
        this.jumpCutApplied = true;
      }

      this.elapsedMs = time - this.runStartTime - this.pausedTotal;
      const progress = clamp((this.player.x - level.spawnX) / (level.goalX - level.spawnX), 0, 1);
      const easedProgress = progress * progress * (3 - 2 * progress);
      const boost = time < this.speedBoostUntil ? 34 : 0;
      const comboPace = (this.multiplier - 1) * 5;
      this.currentSpeed = Phaser.Math.Linear(level.baseSpeed, level.maxSpeed, easedProgress) + boost + comboPace;
      this.player.setVelocityX(this.currentSpeed);
      this.score += (this.currentSpeed * delta * 0.001) * 0.72;

      this.updateZone();
      this.updateCheckpoint();
      this.updateCoaching();
      this.updateCamera();
      this.syncPlayerVisual(time, grounded);
      this.updateInterface(progress);

      if (this.player.y > WORLD_HEIGHT + 50) this.handleFall();
      if (this.player.x >= level.goalX - 10) this.finishRun();
      touchInput.jumpPressed = false;
      touchInput.duckPressed = false;
    }

    setDucking(ducking) {
      if (ducking === this.isDucking) return;
      this.isDucking = ducking;
      this.applyPlayerBody(ducking);
    }

    syncPlayerVisual(time, grounded) {
      const duckScale = this.isDucking ? 0.58 : 1;
      const targetY = this.player.y + (this.isDucking ? 9 : 0);
      const verticalSpeed = this.player.body?.velocity?.y || 0;
      const targetAngle = grounded ? 0 : clamp(verticalSpeed * 0.018, -9, 12);

      this.playerVisual.setPosition(this.player.x, targetY);
      this.playerVisual.scaleX = Phaser.Math.Linear(this.playerVisual.scaleX, this.playerVisualBaseScale.x, 0.22);
      this.playerVisual.scaleY = Phaser.Math.Linear(this.playerVisual.scaleY, this.playerVisualBaseScale.y * duckScale, 0.28);
      this.playerVisual.angle = Phaser.Math.Linear(this.playerVisual.angle, targetAngle, 0.16);

      if (grounded && this.runStarted && !this.runFinished && !this.isDucking && !REDUCED_MOTION) {
        this.playerVisual.y += Math.sin(time * 0.02) * 1.3;
      }

      this.playerGhosts.forEach((ghost, index) => {
        ghost.setPosition(this.playerVisual.x - 30 - index * 27, this.playerVisual.y + index * 1.5);
        ghost.setScale(this.playerVisual.scaleX, this.playerVisual.scaleY);
        ghost.setAngle(this.playerVisual.angle);
        ghost.setAlpha(this.runStarted && !this.runFinished ? 0.11 - index * 0.035 : 0);
      });

      const flash = this.time.now < this.invulnerableUntil && Math.floor(this.time.now / 90) % 2 === 0;
      this.playerVisual.setAlpha(flash ? 0.32 : 1);
    }

    updateCamera() {
      const camera = this.cameras.main;
      const viewWidth = camera.width / camera.zoom;
      const target = clamp(this.player.x - viewWidth * 0.22, 0, level.worldWidth - viewWidth);
      camera.scrollX = Phaser.Math.Linear(camera.scrollX, target, 0.12);
      camera.scrollY = 68;
    }

    updateZone() {
      let nextZone = 0;
      level.zones.forEach((zone, index) => {
        if (this.player.x >= zone.start) nextZone = index;
      });
      if (nextZone === this.currentZoneIndex) return;
      this.currentZoneIndex = nextZone;
      const zone = level.zones[nextZone];
      showToast(`Zone ${nextZone + 1} | ${zone.name}`, 2100);
      setLiveStatus(`${zone.name}. ${zone.mechanic}`);
    }

    updateCheckpoint() {
      level.checkpoints.forEach((checkpoint) => {
        if (this.player.x >= checkpoint && checkpoint > this.lastCheckpointX) this.lastCheckpointX = checkpoint;
      });
    }

    updateCoaching() {
      this.hazardRecords.forEach((record) => {
        if (!record.coach || record.prompted) return;
        const distance = record.x - this.player.x;
        if (distance > 0 && distance < 820) {
          record.prompted = true;
          if (record.coach === "jump") {
            showCoach("Coral capsule", "Jump", "Space, W, or Up. Green tokens mark the safe arc.", "jump", 3500);
          } else {
            showCoach("Hanging autolysin", "Duck", "Hold S or Down until you pass underneath.", "duck", 3500);
          }
        }
      });
    }

    updateInterface(progress = 0) {
      const zone = level.zones[this.currentZoneIndex] || level.zones[0];
      if (ui.zoneName) ui.zoneName.textContent = zone.name;
      if (ui.zoneCopy) ui.zoneCopy.textContent = zone.mechanic;
      updateHud({
        score: this.score,
        streak: this.streak,
        multiplier: this.multiplier,
        integrity: this.integrity,
        elapsedMs: this.elapsedMs,
        progress: progress * 100,
        speedRatio: (this.currentSpeed - level.baseSpeed) / (level.maxSpeed - level.baseSpeed)
      });
    }

    collectToken(_player, token) {
      if (!token.active) return;
      const wasMultiplier = this.multiplier;
      const bonus = token.getData("bonus") ? 1.35 : 1;
      token.disableBody(true, true);
      this.pickups += 1;
      this.streak += 1;
      this.multiplier = Math.min(5, 1 + Math.floor(this.streak / 4));
      this.bestMultiplier = Math.max(this.bestMultiplier, this.multiplier);
      const points = Math.round(100 * this.multiplier * bonus);
      this.score += points;
      audio.pickup(this.multiplier);
      this.spawnScoreBurst(token.x, token.y, `+${points}`, 0x61f0a9, "runner-precursor");

      if (this.pickups === 1) {
        announce("PG precursor", `+${points}`, "Keep collecting green to raise the combo multiplier.", "good", 3000);
      } else if (this.multiplier > wasMultiplier) {
        audio.combo();
        announce("Chain upgraded", `x${this.multiplier} combo`, "A hit resets the chain, so protect the envelope.", "good", 2200);
      }
    }

    collectBonus(_player, bonus) {
      if (!bonus.active) return;
      if (bonus.getData("goal")) {
        this.finishRun();
        return;
      }
      if (!bonus.getData("pbp")) return;

      bonus.disableBody(true, true);
      const points = 600 * this.multiplier;
      this.score += points;
      this.speedBoostUntil = this.time.now + 2600;
      this.integrity = Math.min(MAX_INTEGRITY, this.integrity + 1);
      audio.pbp();
      this.spawnScoreBurst(bonus.x, bonus.y, `PBP +${points}`, 0xf5c965, "runner-pbp");
      announce("PBP cross-link", `+${points}`, "Gold restores one integrity and briefly accelerates the run.", "gold", 2500);
      setLiveStatus(`PBP bonus collected. ${points} points and one integrity restored.`);
    }

    hitHazard(_player, hazard) {
      if (this.time.now < this.invulnerableUntil || !this.runStarted || this.runFinished) return;
      this.invulnerableUntil = this.time.now + 1250;
      this.integrity -= 1;
      this.score = Math.max(0, this.score - 300);
      this.streak = 0;
      this.multiplier = 1;
      audio.hurt();
      this.cameras.main.shake(130, 0.006);
      this.cameras.main.flash(90, 242, 79, 97, false);

      const type = hazard.getData("type");
      const title = type === "autolysin" ? "Autolysin strike" : "Antibiotic hit";
      const instruction = type === "autolysin" ? "Duck under the hanging coral cutter." : "Jump over the coral capsule.";
      announce("Integrity -1", title, `${instruction} Combo reset.`, "danger", 2600);
      setLiveStatus(`${title}. ${this.integrity} integrity remains.`);

      if (this.integrity <= 0) this.failRun("Envelope ruptured.");
    }

    handleFall() {
      if (this.time.now < this.invulnerableUntil || this.runFinished) return;
      this.invulnerableUntil = this.time.now + 1500;
      this.integrity -= 1;
      this.score = Math.max(0, this.score - 400);
      this.streak = 0;
      this.multiplier = 1;
      audio.hurt();

      const gap = level.gaps.find((item) => Math.abs(this.player.x - item.x) <= item.width / 2 + 120);
      const recoveryX = gap ? gap.x + gap.width / 2 + 125 : this.lastCheckpointX;
      this.player.setPosition(recoveryX, level.floorY - 120).setVelocity(this.currentSpeed, 0);
      this.cameras.main.flash(120, 242, 79, 97, false);
      announce("Wall gap", "Integrity -1", "The assay recovered the cell beyond the gap. Combo reset.", "danger", 2600);
      setLiveStatus(`Fell through a wall gap. ${this.integrity} integrity remains.`);

      if (this.integrity <= 0) this.failRun("Envelope ruptured.");
    }

    spawnScoreBurst(x, y, label, color, texture) {
      const text = this.add
        .text(x, y - 22, label, {
          fontFamily: "Manrope, Arial, sans-serif",
          fontSize: "16px",
          fontStyle: "bold",
          color: `#${color.toString(16).padStart(6, "0")}`
        })
        .setOrigin(0.5)
        .setDepth(20);

      if (!REDUCED_MOTION) {
        this.tweens.add({ targets: text, y: y - 62, alpha: 0, duration: 440, ease: "Cubic.easeOut", onComplete: () => text.destroy() });
        for (let index = 0; index < 2; index += 1) {
          const particle = this.add.image(x, y, texture).setDisplaySize(18, 19).setDepth(19);
          this.tweens.add({
            targets: particle,
            x: x + (index === 0 ? -34 : 34),
            y: y - 48,
            alpha: 0,
            angle: (index - 1) * 35,
            duration: 420,
            ease: "Cubic.easeOut",
            onComplete: () => particle.destroy()
          });
        }
      } else {
        this.time.delayedCall(500, () => text.destroy());
      }
    }

    finishRun() {
      if (this.runFinished) return;
      const timeBonus = Math.max(0, Math.round((68000 - this.elapsedMs) * 0.12));
      const finishBonus = timeBonus + this.integrity * 800;
      this.score += finishBonus;
      this.endRun(true, finishBonus);
    }

    failRun(message) {
      if (this.runFinished) return;
      this.endRun(false, 0, message);
    }

    endRun(success, finishBonus, failureMessage = "Envelope ruptured.") {
      this.runFinished = true;
      this.player.setVelocity(0, 0);
      this.player.body.setGravityY(0);
      this.input.keyboard.enabled = false;
      audio.stopMusic();
      if (success) audio.finish();
      document.querySelector(".game-stage")?.classList.remove("is-running");
      hideCoach();
      this.updateInterface(clamp((this.player.x - level.spawnX) / (level.goalX - level.spawnX), 0, 1));

      if (success) {
        addBoardEntry({
          name: currentPlayerName || "Anonymous",
          score: Math.floor(this.score),
          elapsedMs: this.elapsedMs,
          playedAt: new Date().toISOString()
        });
      }

      ui.resultKicker.textContent = success ? "Envelope intact" : "Assay ended";
      ui.resultTitle.textContent = success ? "PBP gate reached." : failureMessage;
      ui.finalScore.textContent = formatScore(this.score);
      ui.resultTime.textContent = formatTime(this.elapsedMs);
      ui.resultHealth.textContent = `${Math.max(0, this.integrity)} / ${MAX_INTEGRITY}`;
      ui.resultPickups.textContent = String(this.pickups);
      ui.resultCombo.textContent = `x${this.bestMultiplier}`;
      ui.resultBonus.textContent = formatScore(finishBonus);
      ui.resultScreen.hidden = false;
      ui.pause.disabled = true;
      setLiveStatus(success ? `Run complete with ${formatScore(this.score)} points.` : failureMessage);
    }

    pauseRun() {
      if (!this.runStarted || this.runFinished || this.runPaused) return;
      this.runPaused = true;
      this.pauseStartedAt = this.time.now;
      this.physics.pause();
      this.input.keyboard.enabled = false;
      audio.stopMusic();
      ui.pauseScreen.hidden = false;
      ui.pause.setAttribute("aria-pressed", "true");
      setLiveStatus("Game paused.");
    }

    resumeRun() {
      if (!this.runPaused) return;
      this.pausedTotal += Math.max(0, this.time.now - this.pauseStartedAt);
      this.pauseStartedAt = 0;
      this.runPaused = false;
      this.physics.resume();
      this.input.keyboard.enabled = true;
      audio.startMusic();
      ui.pauseScreen.hidden = true;
      ui.pause.setAttribute("aria-pressed", "false");
      setLiveStatus("Game resumed.");
    }
  }

  const config = {
    type: Phaser.AUTO,
    parent: "envelope-next-game",
    transparent: true,
    render: {
      antialias: true,
      roundPixels: true
    },
    scale: {
      mode: Phaser.Scale.RESIZE,
      width: "100%",
      height: "100%"
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 },
        debug: false
      }
    },
    scene: RunnerScene
  };

  const game = new Phaser.Game(config);

  function beginRunFromForm(event) {
    event.preventDefault();
    const name = normalizePlayerName(ui.playerName.value);
    if (!name) {
      ui.nameFeedback.textContent = "Enter a name before starting the run.";
      ui.nameFeedback.hidden = false;
      ui.playerName.focus();
      return;
    }

    currentPlayerName = name;
    ui.playerName.value = name;
    ui.nameFeedback.hidden = true;
    try {
      localStorage.setItem(PLAYER_KEY, name);
    } catch {
      // Player-name persistence is optional.
    }
    audio.unlock();
    activeScene?.startRun();
  }

  ui.startForm?.addEventListener("submit", beginRunFromForm);
  ui.playerName?.addEventListener("keydown", (event) => event.stopPropagation());
  ui.playerName?.addEventListener("keyup", (event) => event.stopPropagation());

  ui.restart?.addEventListener("click", () => {
    audio.unlock();
    ui.resultScreen.hidden = true;
    game.scene.stop("RunnerScene");
    game.scene.start("RunnerScene");
    window.setTimeout(() => activeScene?.startRun(), 80);
  });

  ui.pause?.addEventListener("click", () => {
    if (activeScene?.runPaused) activeScene.resumeRun();
    else activeScene?.pauseRun();
  });
  ui.resume?.addEventListener("click", () => activeScene?.resumeRun());

  ui.sound?.addEventListener("click", () => {
    audio.unlock();
    audio.setEnabled(!audio.enabled);
    ui.sound.setAttribute("aria-pressed", String(audio.enabled));
    ui.sound.title = audio.enabled ? "Mute sound" : "Turn sound on";
    const label = ui.sound.querySelector(".sr-only");
    if (label) label.textContent = audio.enabled ? "Mute sound" : "Turn sound on";
  });

  document.querySelectorAll("[data-touch]").forEach((button) => {
    const action = button.getAttribute("data-touch");
    const start = (event) => {
      event.preventDefault();
      audio.unlock();
      if (action === "jump") {
        touchInput.jump = true;
        touchInput.jumpPressed = true;
      } else if (action === "duck") {
        touchInput.duck = true;
        touchInput.duckPressed = true;
      }
      button.classList.add("is-active");
    };
    const end = (event) => {
      event.preventDefault();
      if (action === "jump") touchInput.jump = false;
      if (action === "duck") touchInput.duck = false;
      button.classList.remove("is-active");
    };
    button.addEventListener("pointerdown", start);
    button.addEventListener("pointerup", end);
    button.addEventListener("pointercancel", end);
    button.addEventListener("pointerleave", end);
  });

  function isTypingTarget(target) {
    return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement || target?.isContentEditable;
  }

  window.addEventListener("keydown", (event) => {
    if (isTypingTarget(event.target) || !activeScene?.runStarted || activeScene?.runFinished || activeScene?.runPaused) return;
    if (["Space", "ArrowUp", "KeyW"].includes(event.code)) {
      if (!event.repeat) touchInput.jumpPressed = true;
      touchInput.jump = true;
      event.preventDefault();
    } else if (["ArrowDown", "KeyS"].includes(event.code)) {
      touchInput.duck = true;
      if (!event.repeat) touchInput.duckPressed = true;
      event.preventDefault();
    }
  });

  window.addEventListener("keyup", (event) => {
    if (isTypingTarget(event.target)) return;
    if (["Space", "ArrowUp", "KeyW"].includes(event.code)) touchInput.jump = false;
    if (["ArrowDown", "KeyS"].includes(event.code)) touchInput.duck = false;
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) activeScene?.pauseRun();
  });

  try {
    const savedName = normalizePlayerName(localStorage.getItem(PLAYER_KEY));
    if (savedName && ui.playerName) ui.playerName.value = savedName;
  } catch {
    // Player-name persistence is optional.
  }

  renderBoard();
})();
