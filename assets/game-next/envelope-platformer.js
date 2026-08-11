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
  const GROUND_Y = 790;
  const GROUND_HEIGHT = 64;
  const MAX_HEALTH = 100;
  const BOARD_KEY = "bernhardt-envelope-platformer-preview-board-v1";
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
    multiplier: document.getElementById("game-multiplier"),
    momentumBar: document.getElementById("game-momentum-bar"),
    healthShell: document.getElementById("game-health-shell"),
    healthText: document.getElementById("game-health-text"),
    healthBar: document.getElementById("game-health-bar"),
    zoneKicker: document.getElementById("game-zone-kicker"),
    zoneName: document.getElementById("game-zone-name"),
    progressLabel: document.getElementById("game-progress-label"),
    progressBar: document.getElementById("game-progress-bar"),
    callout: document.getElementById("game-callout"),
    calloutKicker: document.getElementById("game-callout-kicker"),
    calloutTitle: document.getElementById("game-callout-title"),
    calloutCopy: document.getElementById("game-callout-copy"),
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
    jumpPressed: false,
    dash: false,
    dashPressed: false
  };

  let activeScene = null;
  let pendingAutoStart = false;
  let currentPlayerName = "";
  let calloutTimer = 0;
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

    entries.slice(0, 3).forEach((entry, index) => {
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

  function setLiveStatus(message) {
    if (ui.liveStatus) ui.liveStatus.textContent = message;
  }

  function updateHud(state) {
    if (ui.score) ui.score.textContent = formatScore(state.score);
    if (ui.time) ui.time.textContent = formatTime(state.elapsedMs);
    if (ui.multiplier) ui.multiplier.textContent = `x${state.multiplier}`;
    if (ui.momentumBar) ui.momentumBar.style.width = `${state.momentum}%`;
    if (ui.healthText) ui.healthText.textContent = `${Math.ceil(state.health)}%`;
    if (ui.healthBar) {
      ui.healthBar.style.width = `${state.health}%`;
      ui.healthBar.style.background = state.health <= 35 ? "var(--game-danger)" : "var(--game-mint)";
    }
    if (ui.healthShell) ui.healthShell.classList.toggle("is-warning", state.health <= 35);
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

    tone(startFrequency, endFrequency, duration, type = "sine", volume = 0.035, delay = 0) {
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

    noise(duration = 0.12, volume = 0.045) {
      if (!this.enabled || !this.context) return;
      const frameCount = Math.floor(this.context.sampleRate * duration);
      const buffer = this.context.createBuffer(1, frameCount, this.context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < frameCount; i += 1) data[i] = Math.random() * 2 - 1;
      const source = this.context.createBufferSource();
      const filter = this.context.createBiquadFilter();
      const gain = this.context.createGain();
      filter.type = "bandpass";
      filter.frequency.value = 620;
      gain.gain.setValueAtTime(volume, this.context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);
      source.buffer = buffer;
      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.context.destination);
      source.start();
    }

    jump() {
      this.tone(240, 520, 0.13, "square", 0.025);
    }

    dash() {
      this.tone(180, 780, 0.16, "sawtooth", 0.025);
      this.tone(410, 220, 0.14, "square", 0.014, 0.03);
    }

    pickup(multiplier = 1) {
      const base = 500 + multiplier * 40;
      this.tone(base, base * 1.22, 0.1, "sine", 0.032);
      this.tone(base * 1.25, base * 1.5, 0.1, "triangle", 0.02, 0.06);
    }

    repair() {
      this.tone(330, 660, 0.22, "triangle", 0.035);
      this.tone(495, 880, 0.24, "sine", 0.025, 0.07);
    }

    hurt() {
      this.noise(0.15, 0.06);
      this.tone(190, 72, 0.24, "sawtooth", 0.045);
    }

    checkpoint() {
      [392, 523, 659].forEach((frequency, index) => {
        this.tone(frequency, frequency * 1.04, 0.24, "triangle", 0.025, index * 0.09);
      });
    }

    finish() {
      [392, 494, 587, 784].forEach((frequency, index) => {
        this.tone(frequency, frequency * 1.08, 0.32, "triangle", 0.032, index * 0.1);
      });
    }

    startMusic() {
      if (!this.enabled || !this.context || this.musicTimer) return;
      const notes = [98, 123.47, 146.83, 123.47, 110, 146.83, 164.81, 146.83];
      const playStep = () => {
        if (!this.enabled || !activeScene?.runStarted || activeScene?.runFinished || activeScene?.runPaused) return;
        const note = notes[this.musicStep % notes.length];
        this.musicStep += 1;
        this.tone(note, note, 0.42, "triangle", 0.009);
        if (this.musicStep % 2 === 0) this.tone(note * 2, note * 2.02, 0.2, "sine", 0.005, 0.08);
      };
      playStep();
      this.musicTimer = window.setInterval(playStep, 520);
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
      this.runStarted = false;
      this.runFinished = false;
      this.runPaused = false;
      this.score = 0;
      this.health = MAX_HEALTH;
      this.momentum = 0;
      this.multiplier = 1;
      this.elapsedMs = 0;
      this.pickupsCollected = 0;
      this.totalPickups = 0;
      this.currentZoneIndex = 0;
      this.checkpoint = { ...level.spawn };
      this.lastGroundedAt = 0;
      this.jumpBufferedUntil = 0;
      this.dashAvailableAt = 0;
      this.dashEndsAt = 0;
      this.invulnerableUntil = 0;
      this.lastHudUpdate = 0;
      this.lastPulseAt = 0;
      this.lastPhageAt = 0;
      this.facing = 1;
      this.seenCallouts = new Set();
    }

    init(data = {}) {
      this.autoStart = Boolean(data.autoStart);
    }

    preload() {
      this.load.image("envelope-bg", "../assets/game-next/images/ecoli-envelope-background.webp");
    }

    create() {
      activeScene = this;
      this.buildTextures();
      this.createBackground();
      this.createCourse();
      this.createPlayer();
      this.createInputs();
      this.createPhysics();
      this.createAmbientLife();

      this.physics.world.setBounds(0, 0, level.worldWidth, WORLD_HEIGHT + 120);
      this.physics.world.pause();
      this.input.keyboard.enabled = false;
      this.cameras.main.setBounds(0, 0, level.worldWidth, WORLD_HEIGHT);
      this.cameras.main.startFollow(this.player, true, 0.075, 0.1);
      this.updateCameraLead(this.scale.width);
      this.cameras.main.setDeadzone(360, 180);
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
      this.makePlayerTexture();
      this.makePlatformTexture();
      this.makePickupTexture();
      this.makeRepairTexture();
      this.makeAntibioticTexture();
      this.makeAutolysinTexture();
      this.makeCheckpointTexture();
      this.makeGoalTexture();
      this.makePhageTexture();
      this.makeMoteTexture();
    }

    makePlayerTexture() {
      const graphics = this.make.graphics({ add: false });
      graphics.lineStyle(5, level.palette.membraneLight, 1);
      graphics.fillStyle(level.palette.membrane, 1);
      graphics.fillRoundedRect(8, 15, 82, 44, 22);
      graphics.strokeRoundedRect(8, 15, 82, 44, 22);
      graphics.lineStyle(2, 0x1a7e91, 0.75);
      graphics.strokeRoundedRect(15, 21, 68, 32, 16);
      graphics.fillStyle(0x0d4060, 0.75);
      graphics.fillEllipse(35, 37, 30, 19);
      graphics.fillStyle(0xeaffff, 1);
      graphics.fillCircle(67, 29, 5);
      graphics.fillCircle(79, 31, 5);
      graphics.fillStyle(0x08243b, 1);
      graphics.fillCircle(69, 30, 2.2);
      graphics.fillCircle(81, 32, 2.2);
      graphics.lineStyle(3, 0x9ff7ee, 0.75);
      graphics.beginPath();
      graphics.moveTo(12, 36);
      graphics.lineTo(4, 31);
      graphics.lineTo(2, 21);
      graphics.lineTo(0, 12);
      graphics.strokePath();
      graphics.generateTexture("ecoli-player", 98, 72);
      graphics.destroy();
    }

    makePlatformTexture() {
      const graphics = this.make.graphics({ add: false });
      graphics.fillStyle(0x0a3043, 1);
      graphics.fillRoundedRect(0, 0, 128, 36, 10);
      graphics.lineStyle(3, level.palette.membraneLight, 0.9);
      graphics.strokeRoundedRect(1.5, 1.5, 125, 33, 9);
      graphics.fillStyle(level.palette.membrane, 0.82);
      for (let x = 9; x < 128; x += 15) {
        graphics.fillCircle(x, 9, 5);
        graphics.fillCircle(x, 27, 5);
        graphics.fillRect(x - 1.5, 12, 3, 12);
      }
      graphics.generateTexture("membrane-platform", 128, 36);
      graphics.destroy();
    }

    makePickupTexture() {
      const graphics = this.make.graphics({ add: false });
      graphics.lineStyle(4, 0xd8fff2, 1);
      graphics.fillStyle(level.palette.precursor, 0.95);
      graphics.fillPoints(
        [
          new Phaser.Geom.Point(28, 5),
          new Phaser.Geom.Point(48, 17),
          new Phaser.Geom.Point(48, 40),
          new Phaser.Geom.Point(28, 52),
          new Phaser.Geom.Point(8, 40),
          new Phaser.Geom.Point(8, 17)
        ],
        true
      );
      graphics.strokePoints(
        [
          new Phaser.Geom.Point(28, 5),
          new Phaser.Geom.Point(48, 17),
          new Phaser.Geom.Point(48, 40),
          new Phaser.Geom.Point(28, 52),
          new Phaser.Geom.Point(8, 40),
          new Phaser.Geom.Point(8, 17)
        ],
        true
      );
      graphics.lineStyle(3, 0x176d64, 0.85);
      graphics.lineBetween(28, 52, 28, 65);
      graphics.lineBetween(28, 60, 18, 70);
      graphics.lineBetween(28, 60, 38, 70);
      graphics.fillStyle(0xffffff, 0.8);
      graphics.fillCircle(22, 22, 4);
      graphics.generateTexture("lipid-ii", 56, 74);
      graphics.destroy();
    }

    makeRepairTexture() {
      const graphics = this.make.graphics({ add: false });
      graphics.fillStyle(0x62cfe4, 0.96);
      graphics.fillRoundedRect(8, 8, 48, 48, 12);
      graphics.lineStyle(4, 0xd9fbff, 0.95);
      graphics.strokeRoundedRect(8, 8, 48, 48, 12);
      graphics.fillStyle(0xffffff, 0.95);
      graphics.fillRect(27, 17, 10, 30);
      graphics.fillRect(17, 27, 30, 10);
      graphics.generateTexture("pbp-repair", 64, 64);
      graphics.destroy();
    }

    makeAntibioticTexture() {
      const graphics = this.make.graphics({ add: false });
      graphics.fillStyle(level.palette.danger, 1);
      graphics.fillRoundedRect(10, 7, 44, 62, 22);
      graphics.lineStyle(4, 0xffd4d9, 0.95);
      graphics.strokeRoundedRect(10, 7, 44, 62, 22);
      graphics.lineStyle(4, 0x8f263a, 0.9);
      graphics.lineBetween(14, 45, 50, 31);
      graphics.lineStyle(5, 0xffffff, 0.88);
      graphics.lineBetween(24, 24, 40, 40);
      graphics.lineBetween(40, 24, 24, 40);
      graphics.generateTexture("ampicillin", 64, 76);
      graphics.destroy();
    }

    makeAutolysinTexture() {
      const graphics = this.make.graphics({ add: false });
      graphics.fillStyle(0xa52843, 1);
      graphics.fillCircle(38, 38, 26);
      graphics.lineStyle(5, 0xff8795, 1);
      graphics.strokeCircle(38, 38, 27);
      graphics.fillStyle(0xff8795, 1);
      for (let index = 0; index < 10; index += 1) {
        const angle = (Math.PI * 2 * index) / 10;
        const x = 38 + Math.cos(angle) * 33;
        const y = 38 + Math.sin(angle) * 33;
        graphics.fillTriangle(x - 5, y + 4, x + 5, y + 4, 38 + Math.cos(angle) * 41, 38 + Math.sin(angle) * 41);
      }
      graphics.fillStyle(0x4a1120, 1);
      graphics.fillCircle(38, 38, 10);
      graphics.generateTexture("autolysin", 76, 76);
      graphics.destroy();
    }

    makeCheckpointTexture() {
      const graphics = this.make.graphics({ add: false });
      graphics.lineStyle(5, level.palette.route, 0.95);
      graphics.strokeCircle(42, 47, 29);
      graphics.lineStyle(2, 0xfff1b0, 0.72);
      graphics.strokeCircle(42, 47, 20);
      graphics.fillStyle(level.palette.route, 1);
      graphics.fillPoints(
        [
          new Phaser.Geom.Point(42, 18),
          new Phaser.Geom.Point(56, 47),
          new Phaser.Geom.Point(42, 76),
          new Phaser.Geom.Point(28, 47)
        ],
        true
      );
      graphics.fillStyle(0xfff4c2, 1);
      graphics.fillCircle(42, 47, 5);
      graphics.lineStyle(5, level.palette.route, 0.85);
      graphics.lineBetween(42, 75, 42, 112);
      graphics.generateTexture("checkpoint", 84, 120);
      graphics.destroy();
    }

    makeGoalTexture() {
      const graphics = this.make.graphics({ add: false });
      graphics.fillStyle(0x0b3040, 0.96);
      graphics.fillRoundedRect(9, 18, 110, 150, 14);
      graphics.lineStyle(7, level.palette.route, 1);
      graphics.strokeRoundedRect(9, 18, 110, 150, 14);
      graphics.fillStyle(0x70efc2, 0.18);
      graphics.fillRoundedRect(29, 40, 70, 128, 8);
      graphics.lineStyle(3, 0xb8ffe8, 0.72);
      for (let y = 52; y < 158; y += 18) graphics.lineBetween(34, y, 94, y);
      graphics.fillStyle(level.palette.route, 1);
      graphics.fillPoints(
        [
          new Phaser.Geom.Point(64, 0),
          new Phaser.Geom.Point(76, 14),
          new Phaser.Geom.Point(64, 28),
          new Phaser.Geom.Point(52, 14)
        ],
        true
      );
      graphics.generateTexture("division-gate", 128, 176);
      graphics.destroy();
    }

    makePhageTexture() {
      const graphics = this.make.graphics({ add: false });
      graphics.fillStyle(0xc84062, 1);
      graphics.fillPoints(
        [
          new Phaser.Geom.Point(34, 6),
          new Phaser.Geom.Point(54, 18),
          new Phaser.Geom.Point(54, 40),
          new Phaser.Geom.Point(34, 52),
          new Phaser.Geom.Point(14, 40),
          new Phaser.Geom.Point(14, 18)
        ],
        true
      );
      graphics.lineStyle(4, 0xffa0ad, 0.95);
      graphics.strokePoints(
        [
          new Phaser.Geom.Point(34, 6),
          new Phaser.Geom.Point(54, 18),
          new Phaser.Geom.Point(54, 40),
          new Phaser.Geom.Point(34, 52),
          new Phaser.Geom.Point(14, 40),
          new Phaser.Geom.Point(14, 18)
        ],
        true
      );
      graphics.lineStyle(4, 0xff7f91, 0.95);
      graphics.lineBetween(34, 52, 34, 77);
      graphics.lineBetween(22, 76, 46, 76);
      graphics.lineBetween(22, 76, 12, 91);
      graphics.lineBetween(22, 76, 25, 94);
      graphics.lineBetween(46, 76, 43, 94);
      graphics.lineBetween(46, 76, 56, 91);
      graphics.generateTexture("phage", 68, 100);
      graphics.destroy();
    }

    makeMoteTexture() {
      const graphics = this.make.graphics({ add: false });
      graphics.fillStyle(0xa8f5ee, 0.5);
      graphics.fillCircle(5, 5, 3);
      graphics.generateTexture("mote", 10, 10);
      graphics.destroy();
    }

    createBackground() {
      this.background = this.add
        .tileSprite(0, 0, this.scale.width, this.scale.height, "envelope-bg")
        .setOrigin(0)
        .setScrollFactor(0)
        .setDepth(-100);
      this.background.setTileScale(0.96);

      this.backgroundShade = this.add
        .rectangle(0, 0, this.scale.width, this.scale.height, 0x020a12, 0.27)
        .setOrigin(0)
        .setScrollFactor(0)
        .setDepth(-90);

      const lowerShade = this.add
        .rectangle(0, 735, level.worldWidth, 165, 0x020a12, 0.55)
        .setOrigin(0)
        .setDepth(-20);
      lowerShade.setBlendMode(Phaser.BlendModes.MULTIPLY);
    }

    resizeBackground(gameSize) {
      this.background?.setSize(gameSize.width, gameSize.height);
      this.backgroundShade?.setSize(gameSize.width, gameSize.height);
      this.updateCameraLead(gameSize.width);
    }

    updateCameraLead(viewportWidth) {
      const horizontalLead = -Math.min(200, Math.max(42, viewportWidth * 0.12));
      const verticalLead = viewportWidth < 760 ? 20 : 60;
      this.cameras.main.setFollowOffset(horizontalLead, verticalLead);
    }

    createCourse() {
      this.platforms = this.physics.add.staticGroup();
      this.movingPlatforms = this.physics.add.group({ allowGravity: false, immovable: true });
      this.collectibles = this.physics.add.staticGroup();
      this.repairPickups = this.physics.add.staticGroup();
      this.antibiotics = this.physics.add.staticGroup();
      this.autolysins = this.physics.add.group({ allowGravity: false, immovable: true });
      this.checkpoints = this.physics.add.staticGroup();
      this.fallingHazards = this.physics.add.group();
      this.phages = this.physics.add.group({ allowGravity: false });

      level.ground.forEach(([start, end]) => {
        this.addPlatform((start + end) / 2, GROUND_Y, end - start, GROUND_HEIGHT, true);
      });

      level.platforms.forEach(([x, y, width]) => this.addPlatform(x, y, width, 38, false));
      level.movingPlatforms.forEach((definition) => this.addMovingPlatform(definition));
      this.createPickups();

      level.antibiotics.forEach(([x, y], index) => {
        const hazard = this.antibiotics.create(x, y, "ampicillin");
        hazard.setScale(index % 3 === 0 ? 0.82 : 0.72);
        hazard.refreshBody();
        hazard.setData("damage", 16);
        this.tweens.add({
          targets: hazard,
          angle: index % 2 ? 6 : -6,
          duration: 700 + (index % 4) * 90,
          yoyo: true,
          repeat: -1,
          ease: "Sine.inOut"
        });
      });

      level.autolysins.forEach((definition, index) => {
        const hazard = this.autolysins.create(definition.x, definition.y, "autolysin");
        hazard.body.setAllowGravity(false);
        hazard.body.setImmovable(true);
        hazard.setData({
          baseX: definition.x,
          distance: definition.distance,
          speed: definition.speed,
          direction: index % 2 ? -1 : 1,
          damage: 24
        });
      });

      level.checkpoints.forEach((x, index) => {
        const checkpoint = this.checkpoints.create(x, 675, "checkpoint");
        checkpoint.setData({ index, activated: false });
        checkpoint.refreshBody();
      });

      this.goal = this.physics.add.staticImage(level.goalX, 650, "division-gate");
      this.goal.refreshBody();
      this.createCourseLabels();
    }

    addPlatform(x, y, width, height, isGround) {
      const platform = this.platforms.create(x, y, "membrane-platform");
      platform.setDisplaySize(width, height);
      platform.refreshBody();
      platform.setData("ground", isGround);
      return platform;
    }

    addMovingPlatform(definition) {
      const platform = this.movingPlatforms.create(definition.x, definition.y, "membrane-platform");
      platform.setDisplaySize(definition.width, 38);
      platform.body.setSize(definition.width, 38, true);
      platform.body.setAllowGravity(false);
      platform.body.setImmovable(true);
      platform.setData({
        baseX: definition.x,
        baseY: definition.y,
        axis: definition.axis,
        distance: definition.distance,
        speed: definition.speed,
        direction: 1
      });
    }

    createPickups() {
      const blockedRanges = level.checkpoints.map((x) => [x - 95, x + 95]);
      for (let x = 520; x < level.goalX - 260; x += 245) {
        if (blockedRanges.some(([start, end]) => x > start && x < end)) continue;
        const wave = Math.sin(x / 360) * 48;
        const pickup = this.collectibles.create(x, 640 + wave, "lipid-ii");
        pickup.setScale(0.76);
        pickup.refreshBody();
        pickup.setData("value", 100);
        this.totalPickups += 1;
      }

      level.platforms.forEach(([x, y], index) => {
        if (index % 2 !== 0) return;
        const pickup = this.collectibles.create(x, y - 75, "lipid-ii");
        pickup.setScale(0.7);
        pickup.refreshBody();
        pickup.setData("value", 125);
        this.totalPickups += 1;
      });

      [2860, 5720, 8620, 11880, 15120, 18180].forEach((x) => {
        const repair = this.repairPickups.create(x, 590, "pbp-repair");
        repair.setScale(0.78);
        repair.refreshBody();
      });
    }

    createCourseLabels() {
      level.labels.forEach((label) => {
        const color = label.tone === "danger" ? "#ff8d9a" : label.tone === "route" ? "#ffe297" : "#9ff8d8";
        const line = this.add.rectangle(label.x, label.y + 47, 180, 3, Phaser.Display.Color.HexStringToColor(color).color, 0.72);
        line.setOrigin(0, 0.5).setDepth(2);
        this.add
          .text(label.x, label.y, label.title, {
            fontFamily: "Manrope, Arial, sans-serif",
            fontSize: "18px",
            fontStyle: "bold",
            color,
            stroke: "#06111c",
            strokeThickness: 5
          })
          .setDepth(3);
        this.add
          .text(label.x, label.y + 25, label.subtitle, {
            fontFamily: "Manrope, Arial, sans-serif",
            fontSize: "11px",
            fontStyle: "bold",
            color: "#d5e9ed",
            stroke: "#06111c",
            strokeThickness: 4
          })
          .setDepth(3);
      });
    }

    createPlayer() {
      this.player = this.physics.add.sprite(level.spawn.x, level.spawn.y, "ecoli-player");
      this.player.setDepth(10);
      this.player.setCollideWorldBounds(false);
      this.player.body.setSize(78, 46);
      this.player.body.setOffset(10, 16);
      this.player.body.setMaxVelocity(760, 1050);
      this.player.body.setDragX(1700);
      this.player.body.setGravityY(1180);

      this.playerShadow = this.add.ellipse(level.spawn.x, 750, 86, 18, 0x02070c, 0.4).setDepth(4);
      this.dashMeter = this.add.graphics().setDepth(11);
    }

    createInputs() {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.keys = this.input.keyboard.addKeys({
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        jump: Phaser.Input.Keyboard.KeyCodes.W,
        jumpAlt: Phaser.Input.Keyboard.KeyCodes.SPACE,
        dash: Phaser.Input.Keyboard.KeyCodes.SHIFT,
        pause: Phaser.Input.Keyboard.KeyCodes.ESC
      });
    }

    createPhysics() {
      this.physics.add.collider(this.player, this.platforms);
      this.physics.add.collider(this.player, this.movingPlatforms);
      this.physics.add.overlap(this.player, this.collectibles, this.collectPickup, undefined, this);
      this.physics.add.overlap(this.player, this.repairPickups, this.collectRepair, undefined, this);
      this.physics.add.overlap(this.player, this.antibiotics, this.hitStaticHazard, undefined, this);
      this.physics.add.overlap(this.player, this.autolysins, this.hitDynamicHazard, undefined, this);
      this.physics.add.overlap(this.player, this.fallingHazards, this.hitDynamicHazard, undefined, this);
      this.physics.add.overlap(this.player, this.phages, this.hitDynamicHazard, undefined, this);
      this.physics.add.overlap(this.player, this.checkpoints, this.activateCheckpoint, undefined, this);
      this.physics.add.overlap(this.player, this.goal, this.reachGoal, undefined, this);
      this.physics.add.collider(this.fallingHazards, this.platforms, this.resolveFallingHazard, undefined, this);
      this.physics.add.collider(this.fallingHazards, this.movingPlatforms, this.resolveFallingHazard, undefined, this);
    }

    createAmbientLife() {
      this.motes = [];
      for (let index = 0; index < 70; index += 1) {
        const mote = this.add
          .image(Math.random() * level.worldWidth, 150 + Math.random() * 570, "mote")
          .setAlpha(0.16 + Math.random() * 0.28)
          .setScale(0.45 + Math.random() * 0.8)
          .setDepth(-5);
        mote.setData({ speed: 5 + Math.random() * 16, phase: Math.random() * Math.PI * 2 });
        this.motes.push(mote);
      }
    }

    resetHud() {
      updateHud({ score: 0, elapsedMs: 0, multiplier: 1, momentum: 0, health: MAX_HEALTH, progress: 0 });
      if (ui.zoneKicker) ui.zoneKicker.textContent = `Level ${level.number} | ${level.species}`;
      if (ui.zoneName) ui.zoneName.textContent = level.zones[0].name;
      if (ui.progressLabel) ui.progressLabel.textContent = "Start";
    }

    startRun() {
      if (this.runStarted || this.runFinished) return;
      this.runStarted = true;
      this.runPaused = false;
      this.physics.world.resume();
      this.input.keyboard.enabled = true;
      audio.unlock();
      audio.startMusic();
      this.player.setVelocity(0, 0);
      setLiveStatus("Envelope Escape run started.");
      announce("Lipid II", "Collect the mint cell-wall precursor. Staying fast raises your score multiplier.", "good", "Collect", 4200);
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
      this.updateMovingObjects(delta);
      this.updateMomentum(delta);
      this.updateZone(time);
      this.updateEscalation(time);
      this.updatePlayerVisuals(time);
      this.updateProjectiles();

      if (this.player.y > WORLD_HEIGHT + 45) this.fallFromCourse();
      if (time - this.lastHudUpdate > 80) {
        this.lastHudUpdate = time;
        updateHud({
          score: this.score,
          elapsedMs: this.elapsedMs,
          multiplier: this.multiplier,
          momentum: this.momentum,
          health: this.health,
          progress: clamp((this.player.x / level.goalX) * 100, 0, 100)
        });
      }

      touchInput.jumpPressed = false;
      touchInput.dashPressed = false;
    }

    updateBackground(time) {
      if (this.background) {
        this.background.tilePositionX = this.cameras.main.scrollX * 0.16;
        this.background.tilePositionY = Math.sin(time * 0.00018) * 6;
      }
      this.motes?.forEach((mote) => {
        const speed = mote.getData("speed");
        const phase = mote.getData("phase");
        mote.y += Math.sin(time * 0.0005 + phase) * 0.04;
        mote.x += speed * 0.004;
        if (mote.x > level.worldWidth) mote.x = 0;
      });
    }

    updateMovement(time, delta) {
      const grounded = this.player.body.blocked.down || this.player.body.touching.down;
      if (grounded) this.lastGroundedAt = time;

      const left = this.cursors.left.isDown || this.keys.left.isDown || touchInput.left;
      const right = this.cursors.right.isDown || this.keys.right.isDown || touchInput.right;
      const jumpPressed =
        Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
        Phaser.Input.Keyboard.JustDown(this.keys.jump) ||
        Phaser.Input.Keyboard.JustDown(this.keys.jumpAlt) ||
        touchInput.jumpPressed;
      const jumpHeld =
        this.cursors.up.isDown || this.keys.jump.isDown || this.keys.jumpAlt.isDown || touchInput.jump;
      const dashPressed = Phaser.Input.Keyboard.JustDown(this.keys.dash) || touchInput.dashPressed;

      if (Phaser.Input.Keyboard.JustDown(this.keys.pause)) {
        this.pauseRun();
        return;
      }

      if (jumpPressed) this.jumpBufferedUntil = time + 145;

      if (time < this.dashEndsAt) {
        this.player.setAccelerationX(0);
        this.player.setVelocityX(this.facing * 760);
        this.player.setVelocityY(Math.min(this.player.body.velocity.y, 70));
        if (!REDUCED_MOTION && Math.random() > 0.45) this.createAfterimage();
      } else {
        if (left === right) {
          this.player.setAccelerationX(0);
        } else if (left) {
          this.facing = -1;
          this.player.setAccelerationX(-2200);
        } else {
          this.facing = 1;
          this.player.setAccelerationX(2200);
        }
      }

      const jumpAvailable = time - this.lastGroundedAt <= 120;
      if (this.jumpBufferedUntil >= time && jumpAvailable) {
        this.player.setVelocityY(-790);
        this.jumpBufferedUntil = 0;
        this.lastGroundedAt = -1000;
        audio.jump();
        this.squashPlayer(1.12, 0.84, 100);
      }

      if (!jumpHeld && this.player.body.velocity.y < -310) {
        this.player.setVelocityY(this.player.body.velocity.y * 0.58);
      }

      if (dashPressed && time >= this.dashAvailableAt) {
        this.dashAvailableAt = time + 1050;
        this.dashEndsAt = time + 165;
        this.player.setVelocityX(this.facing * 760);
        this.player.setVelocityY(Math.min(this.player.body.velocity.y, 40));
        audio.dash();
        this.burst(this.player.x, this.player.y, level.palette.membraneLight, 10, 1.25);
      }

      if (this.player.x < 80) this.player.x = 80;
      const maxSpeed = grounded ? 410 : 435;
      if (time >= this.dashEndsAt && Math.abs(this.player.body.velocity.x) > maxSpeed) {
        this.player.setVelocityX(Math.sign(this.player.body.velocity.x) * maxSpeed);
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
        hazard.angle += hazard.getData("direction") * 2.4;
      });

      this.phages.children.iterate((phage) => {
        if (!phage?.active) return;
        const phase = phage.getData("phase") || 0;
        phage.setVelocityY(Math.sin(this.time.now * 0.004 + phase) * 90);
        phage.angle = Math.sin(this.time.now * 0.003 + phase) * 5;
      });
    }

    updateMomentum(delta) {
      const speed = Math.abs(this.player.body.velocity.x);
      const movingForward = this.player.body.velocity.x * this.facing > 0;
      if (speed > 280 && movingForward) {
        this.momentum = clamp(this.momentum + delta * 0.027, 0, 100);
      } else {
        this.momentum = clamp(this.momentum - delta * 0.034, 0, 100);
      }
      this.multiplier = clamp(1 + Math.floor(this.momentum / 25), 1, 4);
    }

    updateZone(time) {
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
      if (nextZone === 2 && !this.seenCallouts.has("pulse")) {
        this.seenCallouts.add("pulse");
        announce("Beta-lactam pulse", "A red target appears before each antibiotic strike. Move off the marked area.", "danger", "Incoming hazard", 4400);
      }
      if (nextZone === 4 && !this.seenCallouts.has("phage")) {
        this.seenCallouts.add("phage");
        announce("Phage breach", "The crimson phage particles sweep from the right. Keep a route open and move through them.", "danger", "New encounter", 4400);
      }
      if (time > 0) audio.tone(260, 390, 0.18, "triangle", 0.018);
    }

    updateEscalation(time) {
      const zone = this.currentZoneIndex;
      const pulseInterval = zone === 5 ? 860 : zone === 2 ? 1280 : 0;
      if (pulseInterval && time - this.lastPulseAt > pulseInterval) {
        this.lastPulseAt = time;
        this.telegraphAntibioticPulse();
      }

      if (zone === 4 && time - this.lastPhageAt > 1850) {
        this.lastPhageAt = time;
        this.spawnPhage();
      }
    }

    updatePlayerVisuals(time) {
      this.player.setFlipX(this.facing < 0);
      const grounded = this.player.body.blocked.down || this.player.body.touching.down;
      const speedRatio = clamp(Math.abs(this.player.body.velocity.x) / 410, 0, 1);
      if (grounded && speedRatio > 0.12 && !this.tweens.isTweening(this.player)) {
        this.player.y += Math.sin(time * 0.025) * speedRatio * 0.6;
        this.player.angle = Math.sin(time * 0.018) * speedRatio * 2.5;
      } else if (!grounded) {
        this.player.angle = clamp(this.player.body.velocity.y / 36, -12, 13);
      } else {
        this.player.angle *= 0.82;
      }

      this.playerShadow.x = this.player.x;
      this.playerShadow.y = Math.min(752, this.player.y + 62);
      const airDistance = clamp((750 - this.player.y) / 420, 0, 0.72);
      this.playerShadow.setScale(1 - airDistance, 1 - airDistance * 0.5);
      this.playerShadow.setAlpha(0.38 - airDistance * 0.25);

      this.dashMeter.clear();
      const ready = clamp(1 - (this.dashAvailableAt - time) / 1050, 0, 1);
      this.dashMeter.lineStyle(4, ready >= 1 ? level.palette.precursor : 0x5d7a84, 0.9);
      this.dashMeter.beginPath();
      this.dashMeter.arc(this.player.x, this.player.y, 49, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ready, false);
      this.dashMeter.strokePath();
    }

    updateProjectiles() {
      this.fallingHazards.children.iterate((hazard) => {
        if (hazard?.active && hazard.y > WORLD_HEIGHT + 80) hazard.destroy();
      });
      this.phages.children.iterate((phage) => {
        if (phage?.active && phage.x < this.cameras.main.scrollX - 180) phage.destroy();
      });
    }

    collectPickup(_player, pickup) {
      if (!pickup.active) return;
      const points = (pickup.getData("value") || 100) * this.multiplier;
      pickup.disableBody(true, true);
      this.pickupsCollected += 1;
      this.score += points;
      this.health = clamp(this.health + 0.8, 0, MAX_HEALTH);
      this.momentum = clamp(this.momentum + 5, 0, 100);
      audio.pickup(this.multiplier);
      this.burst(pickup.x, pickup.y, level.palette.precursor, 9, 1);
      this.floatText(pickup.x, pickup.y - 28, `+${points}  x${this.multiplier}`, "#b9ffe6");
    }

    collectRepair(_player, repair) {
      if (!repair.active) return;
      repair.disableBody(true, true);
      this.health = clamp(this.health + 18, 0, MAX_HEALTH);
      this.score += 350 * this.multiplier;
      audio.repair();
      this.burst(repair.x, repair.y, level.palette.membrane, 14, 1.2);
      this.floatText(repair.x, repair.y - 32, "+18 WALL", "#9ceeff");
      if (!this.seenCallouts.has("repair")) {
        this.seenCallouts.add("repair");
        announce("PBP repair", "The cyan repair module restores wall integrity. Save it for a damaged run.", "good", "Repair pickup");
      }
    }

    hitStaticHazard(_player, hazard) {
      if (hazard.getData("cooldown") || this.time.now < this.invulnerableUntil) return;
      hazard.setData("cooldown", true);
      hazard.body.enable = false;
      hazard.setAlpha(0.28);
      this.applyDamage(hazard.getData("damage") || 16, hazard.x);
      this.time.delayedCall(1350, () => {
        if (!hazard.active || this.runFinished) return;
        hazard.body.enable = true;
        hazard.setAlpha(1);
        hazard.setData("cooldown", false);
      });
      if (!this.seenCallouts.has("ampicillin")) {
        this.seenCallouts.add("ampicillin");
        announce("Ampicillin", "Crimson antibiotic capsules damage wall integrity. Jump over or route around them.", "danger", "Avoid");
      }
    }

    hitDynamicHazard(_player, hazard) {
      const amount = hazard.getData("damage") || 22;
      this.applyDamage(amount, hazard.x);
      if (hazard.getData("transient")) hazard.destroy();
      if (hazard.texture?.key === "autolysin" && !this.seenCallouts.has("autolysin")) {
        this.seenCallouts.add("autolysin");
        announce("Autolysin", "The rotating red enzyme cuts peptidoglycan. Time your jump past its sweep.", "danger", "Avoid");
      }
    }

    applyDamage(amount, sourceX) {
      const now = this.time.now;
      if (now < this.invulnerableUntil || this.runFinished) return;
      this.invulnerableUntil = now + 1050;
      this.health = clamp(this.health - amount, 0, MAX_HEALTH);
      this.momentum = 0;
      this.score = Math.max(0, this.score - 180);
      this.player.setVelocityX(sourceX <= this.player.x ? 430 : -430);
      this.player.setVelocityY(-430);
      audio.hurt();
      this.burst(this.player.x, this.player.y, level.palette.danger, 16, 1.45);
      this.floatText(this.player.x, this.player.y - 45, `-${amount} WALL`, "#ff9daa");
      if (!REDUCED_MOTION) {
        this.cameras.main.shake(150, 0.009);
        this.cameras.main.flash(120, 255, 52, 76, false);
      }
      this.player.setTint(0xff7b89);
      this.tweens.add({
        targets: this.player,
        alpha: 0.34,
        duration: 90,
        yoyo: true,
        repeat: 5,
        onComplete: () => {
          this.player.clearTint();
          this.player.setAlpha(1);
        }
      });
      updateHud({
        score: this.score,
        elapsedMs: this.elapsedMs,
        multiplier: 1,
        momentum: 0,
        health: this.health,
        progress: clamp((this.player.x / level.goalX) * 100, 0, 100)
      });
      if (this.health <= 0) this.finishRun(false);
    }

    activateCheckpoint(_player, checkpoint) {
      if (checkpoint.getData("activated")) return;
      checkpoint.setData("activated", true);
      checkpoint.setTint(0xffffff);
      this.checkpoint = { x: checkpoint.x + 95, y: 600 };
      this.score += 750 * this.multiplier;
      this.health = clamp(this.health + 12, 0, MAX_HEALTH);
      audio.checkpoint();
      this.burst(checkpoint.x, checkpoint.y, level.palette.route, 22, 1.55);
      this.floatText(checkpoint.x, checkpoint.y - 80, "CHECKPOINT +750", "#ffe59a");
      showToast(`Checkpoint ${checkpoint.getData("index") + 1} secured | Wall +12`);
      setLiveStatus(`Checkpoint ${checkpoint.getData("index") + 1} secured.`);
      if (!this.seenCallouts.has("checkpoint")) {
        this.seenCallouts.add("checkpoint");
        announce("Gold checkpoint", "Touch each beacon to bank a safe respawn point and restore wall integrity.", "route", "Route marker");
      }
    }

    reachGoal() {
      if (this.runFinished) return;
      this.finishRun(true);
    }

    fallFromCourse() {
      this.applyDamage(18, this.player.x - this.facing * 20);
      if (this.health <= 0 || this.runFinished) return;
      this.player.setPosition(this.checkpoint.x, this.checkpoint.y);
      this.player.setVelocity(0, 0);
      this.cameras.main.centerOn(this.player.x + 250, this.player.y);
      showToast("Returned to checkpoint | Wall -18");
    }

    telegraphAntibioticPulse() {
      if (this.runFinished) return;
      const targetX = clamp(this.player.x + Phaser.Math.Between(260, 760), 150, level.goalX - 160);
      const marker = this.add.ellipse(targetX, 744, 104, 22, level.palette.danger, 0.15).setDepth(5);
      marker.setStrokeStyle(5, level.palette.danger, 0.95);
      this.tweens.add({
        targets: marker,
        scaleX: 0.55,
        scaleY: 0.7,
        alpha: 0.9,
        duration: 210,
        yoyo: true,
        repeat: 2,
        onComplete: () => {
          marker.destroy();
          if (this.runFinished) return;
          const hazard = this.fallingHazards.create(targetX, 70, "ampicillin");
          hazard.setScale(0.78);
          hazard.setVelocityY(270);
          hazard.setAngularVelocity(145);
          hazard.setData({ damage: 22, transient: true });
        }
      });
      audio.tone(170, 120, 0.38, "square", 0.012);
    }

    spawnPhage() {
      if (this.runFinished) return;
      const x = clamp(this.player.x + this.cameras.main.width * 0.72, 0, level.goalX - 100);
      const y = Phaser.Math.Between(260, 620);
      const phage = this.phages.create(x, y, "phage");
      phage.setScale(0.75);
      phage.body.setAllowGravity(false);
      phage.setVelocityX(-290 - this.currentZoneIndex * 18);
      phage.setData({ damage: 24, transient: true, phase: Math.random() * Math.PI * 2 });
      audio.tone(130, 88, 0.26, "sawtooth", 0.012);
    }

    resolveFallingHazard(hazard) {
      if (!hazard?.active) return;
      this.burst(hazard.x, hazard.y, level.palette.danger, 8, 0.9);
      hazard.destroy();
    }

    finishRun(success) {
      if (this.runFinished) return;
      this.runFinished = true;
      this.physics.world.pause();
      this.input.keyboard.enabled = false;
      audio.stopMusic();

      const speedBonus = success ? Math.max(0, Math.floor(36000 - this.elapsedMs * 0.075)) : 0;
      const healthBonus = success ? Math.floor(this.health * 85) : 0;
      this.score = Math.floor(this.score + speedBonus + healthBonus);

      if (success) {
        audio.finish();
        this.burst(this.goal.x, this.goal.y, level.palette.route, 42, 2.1);
        addBoardEntry({
          name: currentPlayerName || "Anonymous",
          score: this.score,
          elapsedMs: Math.floor(this.elapsedMs),
          playedAt: new Date().toISOString()
        });
      } else {
        audio.hurt();
      }

      updateHud({
        score: this.score,
        elapsedMs: this.elapsedMs,
        multiplier: this.multiplier,
        momentum: this.momentum,
        health: this.health,
        progress: success ? 100 : clamp((this.player.x / level.goalX) * 100, 0, 100)
      });

      if (ui.resultKicker) ui.resultKicker.textContent = success ? "Envelope secured" : "Envelope lysed";
      if (ui.resultTitle) ui.resultTitle.textContent = success ? "Division gate reached." : "The wall lost integrity.";
      if (ui.finalScore) ui.finalScore.textContent = formatScore(this.score);
      if (ui.resultTime) ui.resultTime.textContent = formatTime(this.elapsedMs);
      if (ui.resultHealth) ui.resultHealth.textContent = `${Math.ceil(this.health)}%`;
      if (ui.resultPickups) ui.resultPickups.textContent = `${this.pickupsCollected} / ${this.totalPickups}`;
      if (ui.resultBonus) ui.resultBonus.textContent = formatScore(speedBonus);
      if (ui.resultScreen) ui.resultScreen.hidden = false;
      setLiveStatus(success ? `Run complete. Final score ${this.score}.` : `Run ended. Final score ${this.score}.`);
    }

    showZoneBanner(title, subtitle) {
      const x = this.cameras.main.width / 2;
      const y = this.cameras.main.height * 0.34;
      const banner = this.add.container(x, y).setDepth(25).setScrollFactor(0);
      const panel = this.add.rectangle(0, 0, 520, 92, 0x04121e, 0.88).setStrokeStyle(2, level.palette.membraneLight, 0.32);
      const heading = this.add
        .text(0, -15, title, {
          fontFamily: "Fraunces, Georgia, serif",
          fontSize: "30px",
          fontStyle: "bold",
          color: "#f0fbfd",
          align: "center"
        })
        .setOrigin(0.5);
      const copy = this.add
        .text(0, 20, subtitle, {
          fontFamily: "Manrope, Arial, sans-serif",
          fontSize: "13px",
          fontStyle: "bold",
          color: "#a9c9d0",
          align: "center"
        })
        .setOrigin(0.5);
      banner.add([panel, heading, copy]);
      banner.setAlpha(0).setY(y + 18);
      this.tweens.add({
        targets: banner,
        alpha: 1,
        y,
        duration: REDUCED_MOTION ? 1 : 240,
        hold: 1300,
        yoyo: true,
        onComplete: () => banner.destroy()
      });
    }

    burst(x, y, color, count = 10, speedScale = 1) {
      if (REDUCED_MOTION) count = Math.min(count, 6);
      for (let index = 0; index < count; index += 1) {
        const angle = Math.random() * Math.PI * 2;
        const distance = (24 + Math.random() * 62) * speedScale;
        const particle = this.add
          .circle(x, y, 2 + Math.random() * 4, color, 0.92)
          .setDepth(20);
        this.tweens.add({
          targets: particle,
          x: x + Math.cos(angle) * distance,
          y: y + Math.sin(angle) * distance,
          alpha: 0,
          scale: 0.2,
          duration: REDUCED_MOTION ? 150 : 380 + Math.random() * 240,
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
        .setDepth(24);
      this.tweens.add({
        targets: label,
        y: y - 60,
        alpha: 0,
        duration: REDUCED_MOTION ? 320 : 760,
        ease: "Cubic.out",
        onComplete: () => label.destroy()
      });
    }

    createAfterimage() {
      const image = this.add
        .image(this.player.x, this.player.y, "ecoli-player")
        .setFlipX(this.player.flipX)
        .setTint(level.palette.membraneLight)
        .setAlpha(0.2)
        .setDepth(8);
      this.tweens.add({
        targets: image,
        alpha: 0,
        scaleX: 0.82,
        scaleY: 1.12,
        duration: 180,
        onComplete: () => image.destroy()
      });
    }

    squashPlayer(scaleX, scaleY, duration) {
      this.tweens.add({
        targets: this.player,
        scaleX: scaleX * this.facing,
        scaleY,
        duration,
        yoyo: true,
        ease: "Quad.out",
        onComplete: () => this.player.setScale(1)
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
      height: ui.root?.clientHeight || 900
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 760 },
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
      } else if (action === "dash") {
        touchInput.dash = true;
        touchInput.dashPressed = true;
      } else {
        touchInput[action] = true;
      }
    };
    const release = (event) => {
      event.preventDefault();
      button.classList.remove("is-active");
      if (action === "jump") touchInput.jump = false;
      else if (action === "dash") touchInput.dash = false;
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
