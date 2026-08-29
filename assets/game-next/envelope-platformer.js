(() => {
  "use strict";

  const Phaser = window.Phaser;
  const levels = window.ENVELOPE_NEXT_LEVELS;
  const level = Array.isArray(levels) ? levels[0] : null;

  if (!Phaser || !level) {
    const root = document.getElementById("envelope-next-game");
    if (root) root.textContent = "The game preview could not be loaded.";
    return;
  }

  const WORLD_HEIGHT = 900;
  const ROUTE_Y = 770;
  const MAX_INTEGRITY = 5;
  const BUILD_TARGET = 3;
  const BOARD_KEY = "bernhardt-envelope-platformer-preview-board-v2";
  const PLAYER_KEY = "bernhardt-envelope-platformer-preview-player";
  const REDUCED_MOTION = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

  const ui = {
    root: document.getElementById("envelope-next-game"),
    startScreen: document.getElementById("game-start-screen"),
    startForm: document.getElementById("game-start-form"),
    playerName: document.getElementById("game-player-name"),
    nameFeedback: document.getElementById("game-name-feedback"),
    score: document.getElementById("game-score"),
    time: document.getElementById("game-time"),
    buildShell: document.querySelector(".hud-build"),
    buildLabel: document.getElementById("game-build-value"),
    buildBar: document.getElementById("game-build-bar"),
    healthShell: document.getElementById("game-health-shell"),
    integrityPips: Array.from(document.querySelectorAll("#game-integrity-pips i")),
    integrityGroup: document.getElementById("game-integrity-pips"),
    pressureShell: document.getElementById("game-pressure-shell"),
    pressureLabel: document.getElementById("game-pressure-label"),
    pressureBar: document.getElementById("game-pressure-bar"),
    zoneKicker: document.getElementById("game-zone-kicker"),
    zoneName: document.getElementById("game-zone-name"),
    progressLabel: document.getElementById("game-progress-label"),
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
    resultBonus: document.getElementById("game-result-bonus"),
    restart: document.getElementById("game-restart"),
    localBoard: document.getElementById("game-local-board"),
    liveStatus: document.getElementById("game-live-status"),
    touchControls: document.getElementById("game-touch-controls")
  };

  const touchInput = {
    left: false,
    right: false,
    jump: false,
    jumpPressed: false
  };

  let activeScene = null;
  let pendingAutoStart = false;
  let currentPlayerName = "";
  let calloutTimer = 0;
  let toastTimer = 0;
  let coachTimer = 0;

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

  function announce(title, copy, tone = "good", kicker = "New object", duration = 3600) {
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

  function showToast(message, duration = 1700) {
    if (!ui.toast) return;
    window.clearTimeout(toastTimer);
    ui.toast.textContent = message;
    ui.toast.hidden = false;
    toastTimer = window.setTimeout(() => {
      ui.toast.hidden = true;
    }, duration);
  }

  function showCoach(kicker, title, copy, tone = "neutral", duration = 3600) {
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

  function setLiveStatus(message) {
    if (ui.liveStatus) ui.liveStatus.textContent = message;
  }

  function updateHud(state) {
    if (ui.score) ui.score.textContent = formatScore(state.score);
    if (ui.time) ui.time.textContent = formatTime(state.elapsedMs);
    if (ui.buildLabel) ui.buildLabel.textContent = `${state.buildCharge} / ${BUILD_TARGET}`;
    if (ui.buildBar) ui.buildBar.style.width = `${(state.buildCharge / BUILD_TARGET) * 100}%`;
    if (ui.buildShell) ui.buildShell.classList.toggle("is-ready", state.buildCharge >= BUILD_TARGET);

    ui.integrityPips.forEach((pip, index) => {
      pip.classList.toggle("is-lost", index >= state.integrity);
    });
    if (ui.integrityGroup) {
      ui.integrityGroup.setAttribute("aria-label", `${state.integrity} of ${MAX_INTEGRITY} integrity`);
    }
    if (ui.healthShell) ui.healthShell.classList.toggle("is-warning", state.integrity <= 2);

    const pressure = clamp(state.pressure, 0, 100);
    if (ui.pressureBar) ui.pressureBar.style.width = `${pressure}%`;
    if (ui.pressureLabel) {
      ui.pressureLabel.textContent = !state.pressureActive
        ? "Dormant"
        : pressure >= 78
          ? "Critical"
          : pressure >= 50
            ? "Near"
            : pressure >= 24
              ? "Closing"
              : "Far";
    }
    if (ui.pressureShell) {
      ui.pressureShell.classList.toggle("is-active", state.pressureActive);
      ui.pressureShell.classList.toggle("is-critical", pressure >= 78);
    }
    if (ui.progressBar) ui.progressBar.style.width = `${state.progress}%`;
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

    tone(startFrequency, endFrequency, duration, type = "sine", volume = 0.03, delay = 0) {
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

    noise(duration = 0.12, volume = 0.035) {
      if (!this.enabled || !this.context) return;
      const frameCount = Math.floor(this.context.sampleRate * duration);
      const buffer = this.context.createBuffer(1, frameCount, this.context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let index = 0; index < frameCount; index += 1) data[index] = Math.random() * 2 - 1;
      const source = this.context.createBufferSource();
      const filter = this.context.createBiquadFilter();
      const gain = this.context.createGain();
      filter.type = "bandpass";
      filter.frequency.value = 680;
      gain.gain.setValueAtTime(volume, this.context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);
      source.buffer = buffer;
      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.context.destination);
      source.start();
    }

    jump() {
      this.tone(230, 510, 0.14, "triangle", 0.025);
    }

    pickup(charge) {
      const base = 430 + charge * 90;
      this.tone(base, base * 1.22, 0.11, "sine", 0.034);
      this.tone(base * 1.18, base * 1.5, 0.13, "triangle", 0.022, 0.05);
    }

    bridge() {
      [330, 440, 554, 660].forEach((frequency, index) => {
        this.tone(frequency, frequency * 1.08, 0.28, "triangle", 0.03, index * 0.08);
      });
    }

    hurt() {
      this.noise(0.15, 0.055);
      this.tone(185, 72, 0.24, "sawtooth", 0.045);
    }

    checkpoint() {
      [392, 523, 659].forEach((frequency, index) => {
        this.tone(frequency, frequency * 1.04, 0.24, "triangle", 0.025, index * 0.09);
      });
    }

    pressure() {
      this.tone(120, 82, 0.44, "sawtooth", 0.018);
      this.tone(180, 110, 0.34, "square", 0.01, 0.1);
    }

    finish() {
      [392, 494, 587, 784].forEach((frequency, index) => {
        this.tone(frequency, frequency * 1.08, 0.34, "triangle", 0.032, index * 0.1);
      });
    }

    startMusic() {
      if (!this.enabled || !this.context || this.musicTimer) return;
      const notes = [98, 123.47, 146.83, 164.81, 146.83, 123.47, 110, 146.83];
      const playStep = () => {
        if (!this.enabled || !activeScene?.runStarted || activeScene?.runFinished || activeScene?.runPaused) return;
        const note = notes[this.musicStep % notes.length];
        this.musicStep += 1;
        this.tone(note, note * 1.005, 0.54, "triangle", 0.008);
        if (this.musicStep % 4 === 0) this.tone(note * 2, note * 2.01, 0.18, "sine", 0.004, 0.08);
      };
      playStep();
      this.musicTimer = window.setInterval(playStep, 560);
    }

    stopMusic() {
      window.clearInterval(this.musicTimer);
      this.musicTimer = 0;
    }
  }

  const audio = new AudioRack();

  class EnvelopeScene extends Phaser.Scene {
    constructor() {
      super("EnvelopeScene");
      this.resetRunState();
    }

    init(data = {}) {
      this.autoStart = Boolean(data.autoStart);
    }

    resetRunState() {
      this.runStarted = false;
      this.runFinished = false;
      this.runPaused = false;
      this.score = 0;
      this.integrity = MAX_INTEGRITY;
      this.buildCharge = 0;
      this.currentBridgeIndex = 0;
      this.elapsedMs = 0;
      this.pickupsCollected = 0;
      this.currentZoneIndex = 0;
      this.checkpoint = { ...level.spawn };
      this.lastGroundedAt = 0;
      this.jumpBufferedUntil = 0;
      this.invulnerableUntil = 0;
      this.lastHudUpdate = 0;
      this.runStartedAt = 0;
      this.hasMoved = false;
      this.hasJumped = false;
      this.idleCoachShown = false;
      this.jumpCoachShown = false;
      this.forkCoachShown = false;
      this.pressureActive = false;
      this.pressureX = -1200;
      this.lastPressureHitAt = 0;
      this.wasGrounded = false;
      this.facing = 1;
      this.seenCallouts = new Set();
    }

    preload() {
      const base = "../assets/game-next/images/";
      this.load.image("envelope-bg-v2", `${base}periplasm-run-background-v2.png`);
      this.load.image("ecoli-player-v3", `${base}ecoli-player-v3.png`);
      this.load.image("pg-precursor-v2", `${base}pg-precursor-v2.png`);
      this.load.image("pbp-platform-v2", `${base}pbp-platform-v2.png`);
      this.load.image("pbp-gate-v2", `${base}pbp-gate-v2.png`);
      this.load.image("phage-pressure-v2", `${base}phage-pressure-v2.png`);
    }

    create() {
      activeScene = this;
      this.resetRunState();
      this.buildTextures();
      this.createBackground();
      this.createCourse();
      this.createPressureFront();
      this.createPlayer();
      this.createInputs();
      this.createPhysics();
      this.createAmbientLife();

      this.physics.world.setBounds(0, 0, level.worldWidth, WORLD_HEIGHT + 120);
      this.physics.world.pause();
      this.input.keyboard.enabled = false;
      this.cameras.main.setBounds(0, 0, level.worldWidth, WORLD_HEIGHT);
      this.cameras.main.startFollow(this.player, true, 0.1, 0.14);
      this.updateCameraLead(this.scale.width);
      this.cameras.main.setDeadzone(250, 150);
      this.cameras.main.roundPixels = true;

      this.scale.on("resize", this.resizeBackground, this);
      this.events.once("shutdown", () => {
        this.scale.off("resize", this.resizeBackground, this);
        if (activeScene === this) activeScene = null;
      });

      this.resetHud();
      if (this.autoStart || pendingAutoStart) {
        pendingAutoStart = false;
        this.time.delayedCall(80, () => this.startRun());
      }
    }

    buildTextures() {
      const collision = this.make.graphics({ add: false });
      collision.fillStyle(0xffffff, 0.01);
      collision.fillRect(0, 0, 8, 8);
      collision.generateTexture("collision-pixel", 8, 8);
      collision.destroy();

      const route = this.make.graphics({ add: false });
      route.fillStyle(0x061825, 0.72);
      route.fillRoundedRect(0, 13, 256, 46, 20);
      route.lineStyle(2, 0x4cb4be, 0.52);
      for (let x = 12; x < 256; x += 44) {
        route.lineBetween(x, 26, x + 30, 47);
        route.lineBetween(x + 30, 47, x + 44, 26);
      }
      for (let x = 10; x < 266; x += 44) {
        route.fillStyle(x % 88 ? 0x1b7788 : 0x319eaa, 0.92);
        route.fillCircle(x, 25, 7);
        route.fillStyle(0x12526b, 0.92);
        route.fillCircle(x + 22, 48, 7);
        route.fillStyle(0xa0edf0, 0.34);
        route.fillCircle(x - 2, 23, 2.4);
      }
      route.generateTexture("pg-route", 256, 72);
      route.destroy();

      const antibiotic = this.make.graphics({ add: false });
      antibiotic.fillStyle(0x3d0712, 0.55);
      antibiotic.fillRoundedRect(4, 6, 92, 38, 19);
      antibiotic.fillStyle(0xb41432, 1);
      antibiotic.fillRoundedRect(2, 2, 94, 38, 19);
      antibiotic.fillStyle(0xf15b69, 1);
      antibiotic.fillRoundedRect(49, 2, 47, 38, { tl: 0, tr: 19, bl: 0, br: 19 });
      antibiotic.lineStyle(3, 0xffa0a9, 0.9);
      antibiotic.strokeRoundedRect(3, 3, 92, 36, 18);
      antibiotic.lineStyle(3, 0x6d0d20, 0.8);
      antibiotic.lineBetween(49, 5, 49, 37);
      antibiotic.generateTexture("beta-lactam", 102, 48);
      antibiotic.destroy();

      const autolysin = this.make.graphics({ add: false });
      autolysin.fillStyle(0x4c0816, 0.75);
      autolysin.fillCircle(45, 45, 39);
      for (let index = 0; index < 10; index += 1) {
        const angle = (Math.PI * 2 * index) / 10;
        const x = 45 + Math.cos(angle) * 39;
        const y = 45 + Math.sin(angle) * 39;
        autolysin.fillStyle(0xe33a52, 1);
        autolysin.fillTriangle(
          x + Math.cos(angle) * 12,
          y + Math.sin(angle) * 12,
          x + Math.cos(angle + 1.15) * 9,
          y + Math.sin(angle + 1.15) * 9,
          x + Math.cos(angle - 1.15) * 9,
          y + Math.sin(angle - 1.15) * 9
        );
      }
      autolysin.fillStyle(0xf26472, 1);
      autolysin.fillCircle(45, 45, 27);
      autolysin.fillStyle(0x380711, 1);
      autolysin.fillCircle(45, 45, 13);
      autolysin.lineStyle(3, 0xffa2aa, 0.72);
      autolysin.strokeCircle(45, 45, 27);
      autolysin.generateTexture("autolysin", 90, 90);
      autolysin.destroy();

      const pressure = this.make.graphics({ add: false });
      for (let index = 0; index < 16; index += 1) {
        pressure.fillStyle(0xc31d3a, (index / 15) * 0.45);
        pressure.fillRect(index * 16, 0, 17, WORLD_HEIGHT);
      }
      pressure.lineStyle(5, 0xff5368, 0.78);
      pressure.lineBetween(250, 0, 250, WORLD_HEIGHT);
      pressure.generateTexture("pressure-band", 256, WORLD_HEIGHT);
      pressure.destroy();

      const mote = this.make.graphics({ add: false });
      mote.fillStyle(0xa8f5ee, 0.5);
      mote.fillCircle(5, 5, 3);
      mote.generateTexture("mote", 10, 10);
      mote.destroy();
    }

    createBackground() {
      this.background = this.add
        .image(0, 0, "envelope-bg-v2")
        .setOrigin(0)
        .setScrollFactor(0)
        .setDepth(-100);
      this.resizeBackground(this.scale.gameSize);

      this.backgroundShade = this.add
        .rectangle(0, 0, this.scale.width, this.scale.height, 0x020812, 0.18)
        .setOrigin(0)
        .setScrollFactor(0)
        .setDepth(-90);

      this.depthMist = this.add
        .rectangle(0, this.scale.height * 0.18, this.scale.width, this.scale.height * 0.62, 0x061627, 0.14)
        .setOrigin(0)
        .setScrollFactor(0)
        .setDepth(-85);
    }

    resizeBackground(gameSize) {
      if (!this.background) return;
      const width = gameSize.width || this.scale.width;
      const height = gameSize.height || this.scale.height;
      const texture = this.textures.get("envelope-bg-v2").getSourceImage();
      const scale = Math.max(width / texture.width, height / texture.height);
      this.backgroundBaseY = (height - texture.height * scale) / 2;
      this.background
        .setScale(scale)
        .setPosition((width - texture.width * scale) / 2, this.backgroundBaseY);
      this.backgroundShade?.setSize(width, height);
      this.depthMist?.setSize(width, height * 0.62).setY(height * 0.18);
      this.updateCameraLead(width);
    }

    updateCameraLead(viewportWidth) {
      const horizontalLead = -Math.min(220, Math.max(52, viewportWidth * 0.14));
      const verticalLead = viewportWidth < 760 ? 22 : 64;
      this.cameras.main.setFollowOffset(horizontalLead, verticalLead);
    }

    createCourse() {
      this.platformBodies = this.physics.add.staticGroup();
      this.movingPlatforms = this.physics.add.group({ allowGravity: false, immovable: true });
      this.collectibles = this.physics.add.staticGroup();
      this.antibiotics = this.physics.add.staticGroup();
      this.autolysins = this.physics.add.group({ allowGravity: false, immovable: true });
      this.checkpoints = this.physics.add.staticGroup();
      this.bridges = [];

      level.ground.forEach(([start, end]) => {
        this.addRoutePlatform((start + end) / 2, ROUTE_Y, end - start, 72, "ground");
      });
      level.platforms.forEach((definition) => {
        this.addRoutePlatform(definition.x, definition.y, definition.width, 46, "platform");
      });
      level.movingPlatforms.forEach((definition, index) => this.addMovingPlatform(definition, index));
      level.bridges.forEach((definition, index) => this.addBridge(definition, index));

      level.pickups.forEach((definition, index) => {
        const pickup = this.collectibles.create(definition.x, definition.y, "pg-precursor-v2");
        pickup.setDisplaySize(58, 58);
        pickup.refreshBody();
        pickup.setData({ bridge: definition.bridge, bonus: Boolean(definition.bonus), index });
        this.tweens.add({
          targets: pickup,
          y: definition.y - 9,
          angle: index % 2 ? 4 : -4,
          duration: 760 + (index % 4) * 90,
          yoyo: true,
          repeat: -1,
          ease: "Sine.inOut"
        });
      });

      level.antibiotics.forEach((definition, index) => {
        const hazard = this.antibiotics.create(definition.x, definition.y, "beta-lactam");
        hazard.setScale(index % 2 ? 0.88 : 0.96);
        hazard.setAngle(index % 2 ? 12 : -12);
        hazard.refreshBody();
        hazard.setData("cooldown", false);
        this.tweens.add({
          targets: hazard,
          y: definition.y - 5,
          duration: 820 + (index % 3) * 110,
          yoyo: true,
          repeat: -1,
          ease: "Sine.inOut"
        });
      });

      level.autolysins.forEach((definition, index) => {
        const hazard = this.autolysins.create(definition.x, definition.y, "autolysin");
        hazard.setDisplaySize(82, 82);
        hazard.body.setAllowGravity(false);
        hazard.body.setImmovable(true);
        hazard.setData({
          baseX: definition.x,
          distance: definition.distance,
          speed: definition.speed,
          direction: index % 2 ? -1 : 1
        });
      });

      level.checkpoints.forEach((x, index) => {
        const checkpoint = this.checkpoints.create(x, 645, "pbp-gate-v2");
        checkpoint.setDisplaySize(122, 218);
        checkpoint.refreshBody();
        checkpoint.setData({ index, activated: false });
        checkpoint.setAlpha(0.88);
      });

      this.goal = this.physics.add.staticImage(level.goalX, 600, "pbp-gate-v2");
      this.goal.setDisplaySize(196, 350);
      this.goal.refreshBody();
      this.goalGlow = this.add.ellipse(level.goalX, 640, 230, 310, level.palette.route, 0.09).setDepth(3);
      this.tweens.add({
        targets: this.goalGlow,
        alpha: 0.22,
        scaleX: 1.12,
        scaleY: 1.08,
        duration: 1100,
        yoyo: true,
        repeat: -1,
        ease: "Sine.inOut"
      });

      this.createCourseLabels();
    }

    addRoutePlatform(x, y, width, height, kind) {
      const body = this.platformBodies.create(x, y, "collision-pixel");
      body.setDisplaySize(width, height);
      body.refreshBody();
      body.setVisible(false);

      const visualHeight = kind === "ground" ? 58 : 48;
      const visual = this.add.tileSprite(x, y - (kind === "ground" ? 10 : 3), width + 18, visualHeight, "pg-route");
      visual.setDepth(kind === "ground" ? 2 : 4);
      visual.setAlpha(kind === "ground" ? 0.76 : 0.88);
      if (kind === "platform") visual.setTint(0x69dce3);
      return body;
    }

    addMovingPlatform(definition, index) {
      const platform = this.movingPlatforms.create(definition.x, definition.y, "pbp-platform-v2");
      platform.setDisplaySize(definition.width, 118);
      platform.body.setSize(560, 104);
      platform.body.setOffset(80, 105);
      platform.body.setAllowGravity(false);
      platform.body.setImmovable(true);
      platform.setDepth(5);
      platform.setData({
        baseX: definition.x,
        baseY: definition.y,
        axis: definition.axis,
        distance: definition.distance,
        speed: definition.speed,
        direction: index % 2 ? -1 : 1
      });
    }

    addBridge(definition, index) {
      const body = this.platformBodies.create(definition.x, definition.y, "collision-pixel");
      body.setDisplaySize(definition.width, 72);
      body.refreshBody();
      body.setVisible(false);
      body.body.enable = false;

      const segmentWidth = definition.width / BUILD_TARGET;
      const segments = [];
      for (let segmentIndex = 0; segmentIndex < BUILD_TARGET; segmentIndex += 1) {
        const segment = this.add
          .tileSprite(
            definition.x - definition.width / 2 + segmentWidth * (segmentIndex + 0.5),
            definition.y + 2,
            segmentWidth + 10,
            60,
            "pg-route"
          )
          .setDepth(5)
          .setTint(level.palette.precursor)
          .setAlpha(0.1)
          .setScale(0.92, 0.74);
        segments.push(segment);
      }

      const marker = this.add
        .text(definition.x, definition.y - 78, index === 0 ? "3 PRECURSORS BUILD THIS BRIDGE" : "BRIDGE REQUIRES 3", {
          fontFamily: "Manrope, Arial, sans-serif",
          fontSize: "13px",
          fontStyle: "bold",
          color: "#9ff6cb",
          backgroundColor: "rgba(3, 14, 23, 0.86)",
          padding: { x: 10, y: 6 },
          stroke: "#03101a",
          strokeThickness: 3
        })
        .setOrigin(0.5)
        .setDepth(8);
      this.bridges.push({ ...definition, body, segments, marker, built: false, index });
    }

    createCourseLabels() {
      this.addObjectLabel(470, 570, "GREEN", "PG PRECURSOR", "good");
      this.addObjectLabel(2550, 610, "RED", "BETA-LACTAM", "danger");
      this.addObjectLabel(2920, 275, "CYAN", "FAST PBP ROUTE", "cyan");
      this.addObjectLabel(5950, 470, "RED", "AUTOLYSIN", "danger");
      this.addObjectLabel(11890, 370, "GOLD", "PBP GATE", "gold");
    }

    addObjectLabel(x, y, kicker, title, tone) {
      const colors = {
        good: { accent: 0x65efac, text: "#99f8c7" },
        danger: { accent: 0xf24f61, text: "#ff9ca8" },
        cyan: { accent: 0x45d6e6, text: "#a7f6fb" },
        gold: { accent: 0xf5c965, text: "#ffe19a" }
      };
      const color = colors[tone];
      const group = this.add.container(x, y).setDepth(8);
      const panel = this.add.rectangle(0, 0, 154, 48, 0x04111e, 0.86).setStrokeStyle(1, color.accent, 0.54);
      const kickerText = this.add
        .text(-64, -14, kicker, {
          fontFamily: "Manrope, Arial, sans-serif",
          fontSize: "9px",
          fontStyle: "bold",
          color: color.text
        })
        .setOrigin(0, 0.5);
      const titleText = this.add
        .text(-64, 8, title, {
          fontFamily: "Manrope, Arial, sans-serif",
          fontSize: "12px",
          fontStyle: "bold",
          color: "#edf8fa"
        })
        .setOrigin(0, 0.5);
      group.add([panel, kickerText, titleText]);
      return group;
    }

    createPressureFront() {
      this.pressureBand = this.add.image(this.pressureX, WORLD_HEIGHT / 2, "pressure-band").setDepth(12).setAlpha(0);
      this.pressurePhages = [220, 450, 680].map((y, index) =>
        this.add
          .image(this.pressureX + 80 + index * 38, y, "phage-pressure-v2")
          .setDisplaySize(86 + index * 6, 86 + index * 6)
          .setDepth(13)
          .setAlpha(0)
      );
    }

    createPlayer() {
      this.player = this.physics.add.sprite(level.spawn.x, level.spawn.y, "ecoli-player-v3");
      this.player.setDisplaySize(158, 89);
      this.playerBaseScaleX = this.player.scaleX;
      this.playerBaseScaleY = this.player.scaleY;
      this.airborneSince = 0;
      this.player.setDepth(16);
      this.player.setCollideWorldBounds(false);
      this.player.body.setSize(420, 250);
      this.player.body.setOffset(115, 96);
      this.player.body.setMaxVelocity(650, 930);
      this.player.body.setDragX(0);
      this.player.body.setGravityY(470);

      this.playerShadow = this.add.ellipse(level.spawn.x, 742, 88, 18, 0x02070c, 0.42).setDepth(9);
      this.playerAura = this.add.ellipse(level.spawn.x, level.spawn.y, 124, 68, level.palette.membrane, 0.08).setDepth(14);
    }

    createInputs() {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.keys = this.input.keyboard.addKeys({
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        jump: Phaser.Input.Keyboard.KeyCodes.W,
        jumpAlt: Phaser.Input.Keyboard.KeyCodes.SPACE,
        pause: Phaser.Input.Keyboard.KeyCodes.ESC
      });
    }

    createPhysics() {
      this.physics.add.collider(this.player, this.platformBodies);
      this.physics.add.collider(this.player, this.movingPlatforms);
      this.physics.add.overlap(this.player, this.collectibles, this.collectPickup, undefined, this);
      this.physics.add.overlap(this.player, this.antibiotics, this.hitAntibiotic, undefined, this);
      this.physics.add.overlap(this.player, this.autolysins, this.hitAutolysin, undefined, this);
      this.physics.add.overlap(this.player, this.checkpoints, this.activateCheckpoint, undefined, this);
      this.physics.add.overlap(this.player, this.goal, this.reachGoal, undefined, this);
    }

    createAmbientLife() {
      this.motes = [];
      for (let index = 0; index < 18; index += 1) {
        const mote = this.add
          .image(Math.random() * level.worldWidth, 160 + Math.random() * 520, "mote")
          .setAlpha(0.05 + Math.random() * 0.11)
          .setScale(0.4 + Math.random() * 0.8)
          .setDepth(-5);
        mote.setData({ speed: 5 + Math.random() * 14, phase: Math.random() * Math.PI * 2 });
        this.motes.push(mote);
      }
    }

    resetHud() {
      updateHud({
        score: 0,
        elapsedMs: 0,
        buildCharge: 0,
        integrity: MAX_INTEGRITY,
        pressure: 0,
        pressureActive: false,
        progress: 0
      });
      if (ui.zoneKicker) ui.zoneKicker.textContent = `Level ${level.number} | ${level.species}`;
      if (ui.zoneName) ui.zoneName.textContent = level.zones[0].name;
      if (ui.progressLabel) ui.progressLabel.textContent = level.zones[0].name;
    }

    startRun() {
      if (this.runStarted || this.runFinished) return;
      this.runStarted = true;
      this.runPaused = false;
      this.physics.world.resume();
      this.input.keyboard.enabled = true;
      this.player.setVelocity(0, 0);
      this.runStartedAt = this.time.now;
      audio.unlock();
      audio.startMusic();
      setLiveStatus("Envelope Escape run started.");
      showCoach("You are cyan", "Move right", "Use the arrow keys or A and D. Jump with Up, W, or Space.", "neutral", 3000);
    }

    pauseRun() {
      if (!this.runStarted || this.runFinished || this.runPaused) return;
      this.runPaused = true;
      this.physics.world.pause();
      this.input.keyboard.enabled = false;
      audio.stopMusic();
      if (ui.pauseScreen) ui.pauseScreen.hidden = false;
      if (ui.pause) ui.pause.setAttribute("aria-pressed", "true");
      setLiveStatus("Envelope Escape paused.");
    }

    resumeRun() {
      if (!this.runStarted || this.runFinished || !this.runPaused) return;
      this.runPaused = false;
      this.physics.world.resume();
      this.input.keyboard.enabled = true;
      audio.unlock();
      audio.startMusic();
      if (ui.pauseScreen) ui.pauseScreen.hidden = true;
      if (ui.pause) ui.pause.setAttribute("aria-pressed", "false");
      setLiveStatus("Envelope Escape resumed.");
    }

    update(time, delta) {
      this.updateBackground(time);
      if (!this.runStarted || this.runFinished || this.runPaused) return;

      this.elapsedMs += delta;
      this.updateMovement(time, delta);
      this.updateTutorials(time);
      this.updateMovingObjects();
      this.updateZone();
      this.updateCheckpointProgress();
      this.updatePressure(time, delta);
      this.updatePlayerVisuals(time);

      if (this.player.y > WORLD_HEIGHT + 50) this.fallFromCourse();
      if (time - this.lastHudUpdate > 70) {
        this.lastHudUpdate = time;
        this.refreshHud();
      }
      touchInput.jumpPressed = false;
    }

    updateBackground(time) {
      if (this.background) this.background.y = (this.backgroundBaseY || 0) + Math.sin(time * 0.00035) * 2;
      this.motes?.forEach((mote) => {
        const speed = mote.getData("speed");
        const phase = mote.getData("phase");
        mote.y += Math.sin(time * 0.0005 + phase) * 0.035;
        mote.x += speed * 0.004;
        if (mote.x > level.worldWidth) mote.x = 0;
      });
    }

    updateMovement(time, delta) {
      const grounded = this.player.body.blocked.down || this.player.body.touching.down;
      if (grounded) this.lastGroundedAt = time;
      else if (this.wasGrounded) this.airborneSince = time;

      const left = this.cursors.left.isDown || this.keys.left.isDown || touchInput.left;
      const right = this.cursors.right.isDown || this.keys.right.isDown || touchInput.right;
      const jumpPressed =
        Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
        Phaser.Input.Keyboard.JustDown(this.keys.jump) ||
        Phaser.Input.Keyboard.JustDown(this.keys.jumpAlt) ||
        touchInput.jumpPressed;
      const jumpHeld = this.cursors.up.isDown || this.keys.jump.isDown || this.keys.jumpAlt.isDown || touchInput.jump;

      if (Phaser.Input.Keyboard.JustDown(this.keys.pause)) {
        this.pauseRun();
        return;
      }

      const direction = left === right ? 0 : left ? -1 : 1;
      if (direction) {
        this.facing = direction;
        this.hasMoved = true;
        if (this.player.x < 850) hideCoach();
      }

      if (jumpPressed) {
        this.jumpBufferedUntil = time + 180;
        this.hasJumped = true;
        hideCoach();
      }

      const maxSpeed = grounded ? 410 : 425;
      const targetVelocity = direction * maxSpeed;
      const reversing = direction && Math.sign(this.player.body.velocity.x) !== direction;
      const responseRate = grounded ? (reversing ? 0.022 : direction ? 0.013 : 0.018) : 0.008;
      const response = 1 - Math.exp(-delta * responseRate);
      this.player.setVelocityX(Phaser.Math.Linear(this.player.body.velocity.x, targetVelocity, response));

      const nearApex = !grounded && Math.abs(this.player.body.velocity.y) < 90;
      if (!grounded && jumpHeld && this.player.body.velocity.y < 0) this.player.body.setGravityY(215);
      else if (nearApex) this.player.body.setGravityY(300);
      else if (!grounded) this.player.body.setGravityY(760);
      else this.player.body.setGravityY(470);

      const jumpAvailable = time - this.lastGroundedAt <= 165;
      if (this.jumpBufferedUntil >= time && jumpAvailable) {
        this.player.setVelocityY(-655);
        this.jumpBufferedUntil = 0;
        this.lastGroundedAt = -1000;
        audio.jump();
        this.squashPlayer(1.07, 0.9, 90);
      }

      if (!jumpHeld && this.player.body.velocity.y < -270) {
        this.player.setVelocityY(this.player.body.velocity.y * 0.74);
      }

      if (this.player.x < 70) this.player.x = 70;
      if (
        grounded &&
        !this.wasGrounded &&
        time - this.runStartedAt > 250 &&
        time - this.airborneSince > 100
      ) {
        this.squashPlayer(1.05, 0.92, 80);
        if (!REDUCED_MOTION) this.burst(this.player.x, this.player.y + 25, level.palette.membraneLight, 4, 0.35);
      }
      this.wasGrounded = grounded;
    }

    updateTutorials(time) {
      if (!this.idleCoachShown && !this.hasMoved && time - this.runStartedAt > 2400) {
        this.idleCoachShown = true;
        showCoach("Controls", "Move with arrows or A / D", "Jump with Up, W, or Space.", "neutral", 5200);
      }
      if (!this.jumpCoachShown && !this.hasJumped && this.player.x > 2400) {
        this.jumpCoachShown = true;
        showCoach("Red means damage", "Jump over the antibiotic", "Each red hit removes one integrity segment.", "danger", 4300);
      }
      if (!this.forkCoachShown && this.player.x > 2500) {
        this.forkCoachShown = true;
        showCoach("Choose a route", "Cyan PBPs are the fast path", "Stay low for a steadier route, or climb for a faster time.", "neutral", 4600);
      }

      const bridge = this.bridges[this.currentBridgeIndex];
      if (bridge && !bridge.built && this.player.x > bridge.x - bridge.width / 2 - 120) {
        const needed = BUILD_TARGET - this.buildCharge;
        showCoach(
          "Missing wall",
          needed === BUILD_TARGET ? "Collect three green precursors" : `Find ${needed} more green precursor${needed === 1 ? "" : "s"}`,
          "Green precursors assemble this bridge.",
          "good",
          2800
        );
      }
    }

    updateMovingObjects() {
      this.movingPlatforms.children.iterate((platform) => {
        if (!platform?.active) return;
        const axis = platform.getData("axis");
        const direction = platform.getData("direction");
        const speed = platform.getData("speed");
        const distance = platform.getData("distance");
        const baseX = platform.getData("baseX");
        const baseY = platform.getData("baseY");
        if (axis === "x") {
          if (platform.x > baseX + distance) platform.setData("direction", -1);
          if (platform.x < baseX - distance) platform.setData("direction", 1);
          platform.setVelocityX(speed * platform.getData("direction"));
        } else {
          if (platform.y > baseY + distance) platform.setData("direction", -1);
          if (platform.y < baseY - distance) platform.setData("direction", 1);
          platform.setVelocityY(speed * platform.getData("direction"));
        }
      });

      this.autolysins.children.iterate((hazard) => {
        if (!hazard?.active) return;
        const baseX = hazard.getData("baseX");
        const distance = hazard.getData("distance");
        if (hazard.x > baseX + distance) hazard.setData("direction", -1);
        if (hazard.x < baseX - distance) hazard.setData("direction", 1);
        hazard.setVelocityX(hazard.getData("speed") * hazard.getData("direction"));
        hazard.angle += hazard.getData("direction") * 2.1;
      });
    }

    updateZone() {
      let nextZone = 0;
      for (let index = 0; index < level.zones.length; index += 1) {
        if (this.player.x >= level.zones[index].start) nextZone = index;
      }
      if (nextZone === this.currentZoneIndex) return;
      this.currentZoneIndex = nextZone;
      const zone = level.zones[nextZone];
      if (ui.zoneName) ui.zoneName.textContent = zone.name;
      if (ui.progressLabel) ui.progressLabel.textContent = zone.name;
      this.showZoneBanner(zone.name, zone.mechanic);
      audio.tone(260, 390, 0.18, "triangle", 0.018);
    }

    updateCheckpointProgress() {
      this.checkpoints.children.iterate((checkpoint) => {
        if (!checkpoint?.active || checkpoint.getData("activated")) return;
        if (this.player.x >= checkpoint.x - 36) this.activateCheckpoint(this.player, checkpoint);
      });
    }

    updatePressure(time, delta) {
      if (!this.pressureActive && this.player.x >= level.pressureStartsAt) {
        this.pressureActive = true;
        this.pressureX = this.player.x - 980;
        this.pressureBand.setAlpha(0.92);
        this.pressurePhages.forEach((phage) => phage.setAlpha(0.88));
        audio.pressure();
        announce(
          "Pressure front",
          "Keep moving right. If the red front catches you, it removes one integrity segment.",
          "danger",
          "Red is closing in",
          4800
        );
        setLiveStatus("Antibiotic pressure front active. Keep moving right.");
      }
      if (!this.pressureActive) return;

      const distance = this.player.x - this.pressureX;
      const baseSpeed = this.player.x >= 10880 ? 238 : 182;
      const catchup = distance > 1120 ? (distance - 1120) * 0.11 : 0;
      this.pressureX += (baseSpeed + catchup) * (delta / 1000);
      this.pressureBand.setPosition(this.pressureX - 128, WORLD_HEIGHT / 2);
      this.pressurePhages.forEach((phage, index) => {
        phage.x = this.pressureX - 6 + index * 34;
        phage.y = [230, 455, 680][index] + Math.sin(time * 0.003 + index * 1.7) * 28;
        phage.angle = Math.sin(time * 0.002 + index) * 5;
      });

      if (distance < 80 && time - this.lastPressureHitAt > 1300) {
        this.lastPressureHitAt = time;
        this.applyDamage("PRESSURE", this.pressureX);
        this.pressureX = this.player.x - 780;
        showToast("Pressure pushed back | Keep moving");
      }
    }

    getPressurePercent() {
      if (!this.pressureActive) return 0;
      const distance = this.player.x - this.pressureX;
      return clamp(100 - (distance / 1000) * 100, 0, 100);
    }

    updatePlayerVisuals(time) {
      this.player.setFlipX(this.facing < 0);
      const grounded = this.player.body.blocked.down || this.player.body.touching.down;
      const speedRatio = clamp(Math.abs(this.player.body.velocity.x) / 410, 0, 1);
      if (grounded && speedRatio > 0.12 && !this.tweens.isTweening(this.player)) {
        this.player.angle = Math.sin(time * 0.015) * speedRatio * 1.2;
      } else if (!grounded) {
        this.player.angle = clamp(this.player.body.velocity.y / 62, -7, 8);
      } else {
        this.player.angle *= 0.82;
      }

      this.playerShadow.x = this.player.x;
      this.playerShadow.y = Math.min(746, this.player.y + 58);
      const airDistance = clamp((742 - this.player.y) / 380, 0, 0.7);
      this.playerShadow.setScale(1 - airDistance, 1 - airDistance * 0.5);
      this.playerShadow.setAlpha(0.4 - airDistance * 0.28);
      this.playerAura.setPosition(this.player.x, this.player.y);
      this.playerAura.setScale(1 + Math.sin(time * 0.006) * 0.05);
      this.playerAura.setAlpha(0.06 + speedRatio * 0.05);
    }

    collectPickup(_player, pickup) {
      if (!pickup.active) return;
      const bridgeIndex = pickup.getData("bridge");
      const isCurrentBridge = bridgeIndex === this.currentBridgeIndex && !this.bridges[bridgeIndex]?.built;
      const points = pickup.getData("bonus") ? 150 : 100;
      const x = pickup.x;
      const y = pickup.y;
      pickup.disableBody(true, true);
      this.pickupsCollected += 1;
      this.score += points;

      if (isCurrentBridge) this.buildCharge = clamp(this.buildCharge + 1, 0, BUILD_TARGET);
      audio.pickup(isCurrentBridge ? this.buildCharge : BUILD_TARGET);
      this.burst(x, y, level.palette.precursor, 12, 1.1);
      this.floatText(
        x,
        y - 30,
        isCurrentBridge ? `+${points}   BUILD ${this.buildCharge}/${BUILD_TARGET}` : `BONUS +${points}`,
        "#a9ffd0"
      );

      if (!this.seenCallouts.has("first-precursor")) {
        this.seenCallouts.add("first-precursor");
        announce(
          "PG precursor",
          "Collect three green precursors to assemble the next missing wall bridge.",
          "good",
          "Green builds the way"
        );
      }
      if (isCurrentBridge && this.buildCharge >= BUILD_TARGET) this.buildBridge(bridgeIndex);
      this.refreshHud();
    }

    buildBridge(index) {
      const bridge = this.bridges[index];
      if (!bridge || bridge.built) return;
      bridge.built = true;
      bridge.marker.setVisible(false);
      const restoredIntegrity = this.integrity < MAX_INTEGRITY;
      if (restoredIntegrity) this.integrity += 1;
      audio.bridge();
      this.score += 500;
      this.floatText(
        bridge.x,
        bridge.y - 90,
        restoredIntegrity ? "BRIDGE BUILT  +500  +1 INTEGRITY" : "BRIDGE BUILT  +500",
        "#b8ffd8"
      );
      bridge.segments.forEach((segment, segmentIndex) => {
        this.tweens.add({
          targets: segment,
          alpha: 1,
          scaleX: 1,
          scaleY: 1,
          y: bridge.y + 2,
          duration: REDUCED_MOTION ? 80 : 320,
          delay: segmentIndex * 130,
          ease: "Back.out",
          onStart: () => this.burst(segment.x, segment.y, level.palette.precursor, 8, 0.8)
        });
      });
      this.time.delayedCall(REDUCED_MOTION ? 80 : 420, () => {
        bridge.body.body.enable = true;
        bridge.body.refreshBody();
        this.currentBridgeIndex = index + 1;
        this.buildCharge = 0;
        showToast(`Bridge ${index + 1} assembled | +500${restoredIntegrity ? " | +1 integrity" : ""}`);
        setLiveStatus(`Peptidoglycan bridge ${index + 1} assembled.`);
        this.refreshHud();
      });
      if (index === 0) {
        showCoach("Bridge assembled", "Cross while it is stable", "The build meter has reset for the next missing span.", "good", 3600);
      }
      if (!REDUCED_MOTION) this.cameras.main.flash(120, 82, 229, 170, false);
    }

    hitAntibiotic(_player, hazard) {
      if (hazard.getData("cooldown") || this.time.now < this.invulnerableUntil) return;
      hazard.setData("cooldown", true);
      hazard.body.enable = false;
      hazard.setAlpha(0.25);
      this.applyDamage("ANTIBIOTIC", hazard.x);
      this.time.delayedCall(1500, () => {
        if (!hazard.active || this.runFinished) return;
        hazard.body.enable = true;
        hazard.setAlpha(1);
        hazard.setData("cooldown", false);
      });
    }

    hitAutolysin(_player, hazard) {
      if (this.time.now < this.invulnerableUntil) return;
      this.applyDamage("AUTOLYSIN", hazard.x);
      if (!this.seenCallouts.has("autolysin")) {
        this.seenCallouts.add("autolysin");
        showCoach("Autolysin", "Time the moving red enzyme", "Wait for an opening, then jump through.", "danger", 3400);
      }
    }

    applyDamage(label, sourceX) {
      const now = this.time.now;
      if (now < this.invulnerableUntil || this.runFinished) return;
      this.invulnerableUntil = now + 1500;
      this.integrity = clamp(this.integrity - 1, 0, MAX_INTEGRITY);
      this.score = Math.max(0, this.score - 250);
      this.player.setVelocityX(sourceX <= this.player.x ? 390 : -390);
      this.player.setVelocityY(-390);
      audio.hurt();
      this.burst(this.player.x, this.player.y, level.palette.danger, 18, 1.35);
      this.floatText(this.player.x, this.player.y - 48, `${label}  -1 INTEGRITY`, "#ff9eaa");
      ui.healthShell?.classList.remove("is-hit");
      window.requestAnimationFrame(() => ui.healthShell?.classList.add("is-hit"));
      if (!REDUCED_MOTION) {
        this.cameras.main.shake(150, 0.009);
        this.cameras.main.flash(120, 255, 52, 76, false);
      }
      this.player.setTint(0xff7887);
      this.tweens.add({
        targets: this.player,
        alpha: 0.34,
        duration: 80,
        yoyo: true,
        repeat: 5,
        onComplete: () => {
          this.player.clearTint();
          this.player.setAlpha(1);
          ui.healthShell?.classList.remove("is-hit");
        }
      });
      this.refreshHud();
      if (this.integrity <= 0) this.finishRun(false);
    }

    activateCheckpoint(_player, checkpoint) {
      if (checkpoint.getData("activated")) return;
      checkpoint.setData("activated", true);
      checkpoint.body.enable = false;
      checkpoint.setAlpha(1);
      checkpoint.setTint(0xfff0b0);
      this.checkpoint = { x: checkpoint.x + 120, y: 610 };
      this.score += 750;
      this.integrity = MAX_INTEGRITY;
      if (this.pressureActive) this.pressureX = this.player.x - 900;
      audio.checkpoint();
      this.burst(checkpoint.x, checkpoint.y, level.palette.route, 24, 1.55);
      this.floatText(checkpoint.x, checkpoint.y - 100, "PBP CHECKPOINT  +750", "#ffe59a");
      showToast("PBP checkpoint | Integrity restored");
      setLiveStatus(`Checkpoint ${checkpoint.getData("index") + 1} secured. Integrity restored.`);
      this.refreshHud();
    }

    reachGoal() {
      if (!this.runFinished) this.finishRun(true);
    }

    fallFromCourse() {
      const bridge = this.bridges[this.currentBridgeIndex];
      this.applyDamage("RUPTURE", this.player.x - this.facing * 30);
      if (this.integrity <= 0 || this.runFinished) return;
      this.player.setPosition(this.checkpoint.x, this.checkpoint.y);
      this.player.setVelocity(0, 0);
      if (this.pressureActive) this.pressureX = this.player.x - 820;
      if (bridge && !bridge.built) {
        showToast(`Returned to checkpoint | Need ${BUILD_TARGET - this.buildCharge} green`);
      } else {
        showToast("Returned to checkpoint | -1 integrity");
      }
    }

    refreshHud() {
      updateHud({
        score: this.score,
        elapsedMs: this.elapsedMs,
        buildCharge: this.buildCharge,
        integrity: this.integrity,
        pressure: this.getPressurePercent(),
        pressureActive: this.pressureActive,
        progress: clamp((this.player.x / level.goalX) * 100, 0, 100)
      });
    }

    finishRun(success) {
      if (this.runFinished) return;
      this.runFinished = true;
      this.physics.world.pause();
      this.input.keyboard.enabled = false;
      audio.stopMusic();

      const speedBonus = success ? Math.max(0, Math.floor(30000 - this.elapsedMs * 0.09)) : 0;
      const integrityBonus = success ? this.integrity * 900 : 0;
      const pressureBonus = success && this.pressureActive ? Math.floor((100 - this.getPressurePercent()) * 45) : 0;
      this.score = Math.floor(this.score + speedBonus + integrityBonus + pressureBonus + (success ? 1500 : 0));

      if (success) {
        audio.finish();
        this.burst(this.goal.x, this.goal.y, level.palette.route, 44, 2.05);
        addBoardEntry({
          name: currentPlayerName || "Anonymous",
          score: this.score,
          elapsedMs: Math.floor(this.elapsedMs),
          playedAt: new Date().toISOString()
        });
      } else {
        audio.hurt();
      }

      this.refreshHud();
      if (ui.resultKicker) ui.resultKicker.textContent = success ? "Envelope secured" : "Run ended";
      if (ui.resultTitle) ui.resultTitle.textContent = success ? "The PBP gate is open." : "Cell integrity reached zero.";
      if (ui.finalScore) ui.finalScore.textContent = formatScore(this.score);
      if (ui.resultTime) ui.resultTime.textContent = formatTime(this.elapsedMs);
      if (ui.resultHealth) ui.resultHealth.textContent = `${this.integrity} / ${MAX_INTEGRITY}`;
      if (ui.resultPickups) ui.resultPickups.textContent = String(this.pickupsCollected);
      if (ui.resultBonus) ui.resultBonus.textContent = formatScore(speedBonus);
      if (ui.resultScreen) ui.resultScreen.hidden = false;
      setLiveStatus(success ? `Run complete. Final score ${this.score}.` : `Run ended. Final score ${this.score}.`);
    }

    showZoneBanner(title, subtitle) {
      const x = this.cameras.main.width / 2;
      const y = this.cameras.main.height * 0.36;
      const banner = this.add.container(x, y).setDepth(30).setScrollFactor(0);
      const panel = this.add.rectangle(0, 0, 520, 94, 0x04121e, 0.9).setStrokeStyle(2, level.palette.membraneLight, 0.28);
      const heading = this.add
        .text(0, -16, title, {
          fontFamily: "Fraunces, Georgia, serif",
          fontSize: "30px",
          fontStyle: "bold",
          color: "#f0fbfd",
          align: "center"
        })
        .setOrigin(0.5);
      const copy = this.add
        .text(0, 21, subtitle, {
          fontFamily: "Manrope, Arial, sans-serif",
          fontSize: "13px",
          fontStyle: "bold",
          color: "#a9c9d0",
          align: "center",
          wordWrap: { width: 470 }
        })
        .setOrigin(0.5);
      banner.add([panel, heading, copy]);
      banner.setAlpha(0).setY(y + 18);
      this.tweens.add({
        targets: banner,
        alpha: 1,
        y,
        duration: REDUCED_MOTION ? 1 : 220,
        hold: 1250,
        yoyo: true,
        onComplete: () => banner.destroy()
      });
    }

    burst(x, y, color, count = 10, speedScale = 1) {
      if (REDUCED_MOTION) count = Math.min(count, 6);
      for (let index = 0; index < count; index += 1) {
        const angle = Math.random() * Math.PI * 2;
        const distance = (24 + Math.random() * 62) * speedScale;
        const particle = this.add.circle(x, y, 2 + Math.random() * 4, color, 0.92).setDepth(24);
        this.tweens.add({
          targets: particle,
          x: x + Math.cos(angle) * distance,
          y: y + Math.sin(angle) * distance,
          alpha: 0,
          scale: 0.2,
          duration: REDUCED_MOTION ? 150 : 360 + Math.random() * 220,
          ease: "Cubic.out",
          onComplete: () => particle.destroy()
        });
      }
    }

    floatText(x, y, text, color) {
      const label = this.add
        .text(x, y, text, {
          fontFamily: "Manrope, Arial, sans-serif",
          fontSize: "18px",
          fontStyle: "bold",
          color,
          stroke: "#03101a",
          strokeThickness: 5
        })
        .setOrigin(0.5)
        .setDepth(26);
      this.tweens.add({
        targets: label,
        y: y - 58,
        alpha: 0,
        duration: REDUCED_MOTION ? 320 : 760,
        ease: "Cubic.out",
        onComplete: () => label.destroy()
      });
    }

    squashPlayer(scaleX, scaleY, duration) {
      if (this.tweens.isTweening(this.player)) return;
      this.player.setScale(this.playerBaseScaleX, this.playerBaseScaleY);
      this.tweens.add({
        targets: this.player,
        scaleX: this.playerBaseScaleX * scaleX,
        scaleY: this.playerBaseScaleY * scaleY,
        duration,
        yoyo: true,
        ease: "Quad.out",
        onComplete: () => this.player.setScale(this.playerBaseScaleX, this.playerBaseScaleY)
      });
    }
  }

  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: "envelope-next-game",
    backgroundColor: "#06111c",
    transparent: false,
    pixelArt: false,
    antialias: true,
    roundPixels: true,
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: ui.root?.clientWidth || 1600,
      height: ui.root?.clientHeight || 820
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 650 },
        debug: false,
        fps: 60
      }
    },
    render: {
      antialias: true,
      powerPreference: "high-performance"
    },
    scene: EnvelopeScene
  });

  if (ui.playerName) {
    try {
      ui.playerName.value = normalizePlayerName(localStorage.getItem(PLAYER_KEY));
    } catch {
      // A remembered name is optional.
    }
    ["keydown", "keyup", "keypress"].forEach((eventName) => {
      ui.playerName.addEventListener(eventName, (event) => event.stopPropagation());
    });
  }

  ui.startForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = normalizePlayerName(ui.playerName?.value);
    if (!name) {
      if (ui.nameFeedback) {
        ui.nameFeedback.textContent = "Enter a name before beginning the run.";
        ui.nameFeedback.hidden = false;
      }
      ui.playerName?.focus();
      return;
    }

    currentPlayerName = name;
    try {
      localStorage.setItem(PLAYER_KEY, name);
    } catch {
      // Remembering the name is optional.
    }
    if (ui.nameFeedback) ui.nameFeedback.hidden = true;
    if (ui.startScreen) ui.startScreen.hidden = true;
    ui.playerName?.blur();
    audio.unlock();
    if (activeScene) activeScene.startRun();
    else pendingAutoStart = true;
  });

  ui.sound?.addEventListener("click", () => {
    const enabled = ui.sound.getAttribute("aria-pressed") !== "true";
    ui.sound.setAttribute("aria-pressed", String(enabled));
    ui.sound.title = enabled ? "Mute sound" : "Turn on sound";
    const srText = ui.sound.querySelector(".sr-only");
    if (srText) srText.textContent = enabled ? "Mute sound" : "Turn on sound";
    audio.unlock();
    audio.setEnabled(enabled);
  });

  ui.pause?.addEventListener("click", () => {
    if (activeScene?.runPaused) activeScene.resumeRun();
    else activeScene?.pauseRun();
  });
  ui.resume?.addEventListener("click", () => activeScene?.resumeRun());

  ui.restart?.addEventListener("click", () => {
    if (ui.resultScreen) ui.resultScreen.hidden = true;
    if (ui.pauseScreen) ui.pauseScreen.hidden = true;
    audio.stopMusic();
    pendingAutoStart = true;
    activeScene?.scene.restart({ autoStart: true });
  });

  ui.touchControls?.querySelectorAll("button[data-touch]").forEach((button) => {
    const action = button.dataset.touch;
    const press = (event) => {
      event.preventDefault();
      button.classList.add("is-active");
      if (action === "jump") {
        touchInput.jump = true;
        touchInput.jumpPressed = true;
      } else {
        touchInput[action] = true;
      }
    };
    const release = (event) => {
      event.preventDefault();
      button.classList.remove("is-active");
      if (action === "jump") touchInput.jump = false;
      else touchInput[action] = false;
    };
    button.addEventListener("pointerdown", press);
    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);
    button.addEventListener("pointerleave", release);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) activeScene?.pauseRun();
  });

  window.addEventListener("beforeunload", () => {
    audio.stopMusic();
    game.destroy(true);
  });

  renderBoard();
})();
