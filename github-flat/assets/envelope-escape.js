(() => {
  const trigger = document.getElementById("envelope-trigger");
  const modal = document.getElementById("envelope-modal");
  const closeButton = document.getElementById("envelope-close");
  const startButton = document.getElementById("envelope-start");
  const dailyStartButton = document.getElementById("envelope-daily-start");
  const pauseButton = document.getElementById("envelope-pause");
  const restartButton = document.getElementById("envelope-restart");
  const responseButton = document.getElementById("envelope-response");
  const scoresToggleButton = document.getElementById("envelope-scores-toggle");
  const audioToggleButton = document.getElementById("envelope-audio-toggle");
  const motionSelect = document.getElementById("envelope-motion-select");
  const scoresPanel = document.getElementById("envelope-scores-panel");
  const canvas = document.getElementById("envelope-canvas");
  const stageWrap = canvas ? canvas.closest(".envelope-stage-wrap") : null;
  const overlay = document.getElementById("envelope-overlay");
  const overlayTitle = document.getElementById("envelope-overlay-title");
  const overlayCopy = document.getElementById("envelope-overlay-copy");
  const overlayStatus = document.getElementById("envelope-overlay-status");
  const overlayPoints = document.getElementById("envelope-overlay-points");
  const modelSelect = document.getElementById("envelope-model-select");
  const modelNote = document.getElementById("envelope-model-note");
  const playerNameInput = document.getElementById("envelope-player-name");
  const playerNameFeedback = document.getElementById("envelope-player-name-feedback");
  const dailyNote = document.getElementById("envelope-daily-note");
  const scoreEl = document.getElementById("envelope-score");
  const timeEl = document.getElementById("envelope-time");
  const integrityEl = document.getElementById("envelope-integrity");
  const integrityBarEl = document.getElementById("envelope-integrity-bar");
  const repairEl = document.getElementById("envelope-repair");
  const repairBarEl = document.getElementById("envelope-repair-bar");
  const responseChargeEl = document.getElementById("envelope-response-charge");
  const responseBarEl = document.getElementById("envelope-response-bar");
  const phaseEl = document.getElementById("envelope-phase");
  const phaseNoteEl = document.getElementById("envelope-phase-note");
  const traitTitleEl = document.getElementById("envelope-trait-title");
  const traitCopyEl = document.getElementById("envelope-trait-copy");
  const networkPillEl = document.getElementById("envelope-network-pill");
  const leaderboardMetaEl = document.getElementById("envelope-leaderboard-meta");
  const leaderboardListEl = document.getElementById("envelope-leaderboard-list");
  const rankSummaryEl = document.getElementById("envelope-rank-summary");
  const runReportEl = document.getElementById("envelope-run-report");
  const liveStatusEl = document.getElementById("envelope-live-status");

  if (
    !trigger ||
    !modal ||
    !closeButton ||
    !startButton ||
    !dailyStartButton ||
    !pauseButton ||
    !restartButton ||
    !responseButton ||
    !scoresToggleButton ||
    !scoresPanel ||
    !canvas ||
    !overlay
  ) {
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const BASE_PLAYFIELD = { width: 1280, height: 720 };
  const MAX_PLAYFIELD = { width: 1536, height: 864 };
  const STORAGE_VERSION = "v2";
  const BEST_KEY = `bernhardt-envelope-escape-best-${STORAGE_VERSION}`;
  const BOARD_PREFIX = `bernhardt-envelope-escape-board-${STORAGE_VERSION}-`;
  const MODEL_KEY = `bernhardt-envelope-escape-model-${STORAGE_VERSION}`;
  const NAME_KEY = `bernhardt-envelope-escape-name-${STORAGE_VERSION}`;
  const SOUND_KEY = `bernhardt-envelope-escape-sound-${STORAGE_VERSION}`;
  const MOTION_KEY = `bernhardt-envelope-escape-motion-${STORAGE_VERSION}`;
  const LEADERBOARD_SIZE = 25;
  const GLOBAL_LEADERBOARD_URL = String(window.ENVELOPE_LEADERBOARD_URL || "").trim();
  const REQUEST_TIMEOUT_MS = 9000;
  const LAB_TIMEZONE = "America/New_York";
  const TAU = Math.PI * 2;
  const BOARD_PATTERN = /^(classic|daily-\d{4}-\d{2}-\d{2})$/;
  const HITBOX = {
    playerRadius: 22,
    pickupRadius: 26,
    phagePadding: 22,
    wavePadding: 18,
    rupturePadding: 14
  };
  const TELEGRAPH = {
    phage: 0.56,
    wave: 0.72,
    rupture: 0.82
  };
  const prefersReducedMotion =
    typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const world = { width: BASE_PLAYFIELD.width, height: BASE_PLAYFIELD.height, dpr: 1 };
  let activeRandom = Math.random;
  let audioContext = null;

  const SPECIES = {
    ecoli: {
      label: "Escherichia coli",
      passiveTitle: "Envelope homeostasis",
      passiveCopy: "Envelope factors charge the stress-response meter a little faster.",
      speedMul: 1,
      responseGainMul: 1.12,
      damageMul: 1,
      ruptureDamageMul: 1,
      burstRadius: 188,
      healBonus: 2,
      fragmentMagnet: 0,
      shape: "rod",
      palette: {
        bodyA: "#77ecf0",
        bodyB: "#99fbff",
        outline: "#d4fbff",
        core: "#15395d",
        pulse: "rgba(128, 244, 255, 0.9)"
      }
    },
    paeruginosa: {
      label: "Pseudomonas aeruginosa",
      passiveTitle: "Fast swimmer",
      passiveCopy: "Higher movement speed makes lane changes and recoveries easier.",
      speedMul: 1.1,
      responseGainMul: 1,
      damageMul: 1,
      ruptureDamageMul: 1,
      burstRadius: 182,
      healBonus: 0,
      fragmentMagnet: 0,
      shape: "curved-rod",
      palette: {
        bodyA: "#88f1da",
        bodyB: "#b8ffe8",
        outline: "#dffff4",
        core: "#163c4a",
        pulse: "rgba(147, 255, 221, 0.88)"
      }
    },
    saureus: {
      label: "Staphylococcus aureus",
      passiveTitle: "Thick wall",
      passiveCopy: "Incoming damage is slightly reduced across the whole run.",
      speedMul: 0.96,
      responseGainMul: 1,
      damageMul: 0.88,
      ruptureDamageMul: 0.88,
      burstRadius: 186,
      healBonus: 1,
      fragmentMagnet: 0,
      shape: "coccus",
      palette: {
        bodyA: "#ffd789",
        bodyB: "#ffe6b3",
        outline: "#fff1d1",
        core: "#6c421b",
        pulse: "rgba(255, 227, 160, 0.9)"
      }
    },
    spneumoniae: {
      label: "Streptococcus pneumoniae",
      passiveTitle: "Capsule buffering",
      passiveCopy: "Completed assembly cycles grant a longer, stronger recovery pulse.",
      speedMul: 0.98,
      responseGainMul: 1,
      damageMul: 1,
      ruptureDamageMul: 1,
      burstRadius: 218,
      healBonus: 5,
      fragmentMagnet: 0,
      shape: "diplococcus",
      palette: {
        bodyA: "#ffb8cd",
        bodyB: "#ffd6e3",
        outline: "#ffe8ef",
        core: "#7c3454",
        pulse: "rgba(255, 200, 224, 0.9)"
      }
    },
    cglutamicum: {
      label: "Corynebacterium glutamicum",
      passiveTitle: "Layered envelope",
      passiveCopy: "Rupture fronts are less punishing than they are for other strains.",
      speedMul: 0.99,
      responseGainMul: 1,
      damageMul: 1,
      ruptureDamageMul: 0.76,
      burstRadius: 190,
      healBonus: 1,
      fragmentMagnet: 0,
      shape: "coryneform",
      palette: {
        bodyA: "#c5d4ff",
        bodyB: "#e4ebff",
        outline: "#f3f6ff",
        core: "#29336d",
        pulse: "rgba(198, 214, 255, 0.9)"
      }
    },
    kpneumoniae: {
      label: "Klebsiella pneumoniae",
      passiveTitle: "Capsule retention",
      passiveCopy: "Envelope factors begin drifting toward the cell a little earlier.",
      speedMul: 0.97,
      responseGainMul: 1,
      damageMul: 1,
      ruptureDamageMul: 1,
      burstRadius: 184,
      healBonus: 2,
      fragmentMagnet: 68,
      shape: "encapsulated-rod",
      palette: {
        bodyA: "#8de4d4",
        bodyB: "#b5ffeb",
        outline: "#e0fff5",
        core: "#164853",
        pulse: "rgba(167, 255, 227, 0.9)"
      }
    },
    abaumannii: {
      label: "Acinetobacter baumannii",
      passiveTitle: "Stress tolerant",
      passiveCopy: "The stress-response meter charges faster from survival and factor uptake.",
      speedMul: 1.02,
      responseGainMul: 1.18,
      damageMul: 1,
      ruptureDamageMul: 1,
      burstRadius: 186,
      healBonus: 1,
      fragmentMagnet: 0,
      shape: "coccobacillus",
      palette: {
        bodyA: "#89d8ff",
        bodyB: "#bcecff",
        outline: "#e1f7ff",
        core: "#163d6d",
        pulse: "rgba(158, 224, 255, 0.9)"
      }
    }
  };

  const PHASES = [
    {
      id: "settling",
      start: 0,
      title: "Homeostatic load",
      note: "Sparse hazards. Gather envelope factors and stabilize PG assembly.",
      rates: { fragment: 1.12, phage: 0.68, wave: 0.52, rupture: 0.45 },
      tintA: "rgba(21, 93, 112, 0.22)",
      tintB: "rgba(28, 128, 149, 0.1)"
    },
    {
      id: "antibiotic",
      start: 60,
      title: "Beta-lactam pulses",
      note: "Cell-wall-active beta-lactam pulses arrive more often and cut off easy routes.",
      rates: { fragment: 1.02, phage: 0.9, wave: 0.92, rupture: 0.62 },
      tintA: "rgba(24, 116, 129, 0.28)",
      tintB: "rgba(52, 156, 176, 0.13)"
    },
    {
      id: "mixed",
      start: 150,
      title: "Phage + breach stress",
      note: "Phages, beta-lactam pulses, and autolysin breaches begin to overlap more aggressively.",
      rates: { fragment: 0.97, phage: 1.16, wave: 1.08, rupture: 0.92 },
      tintA: "rgba(53, 132, 160, 0.28)",
      tintB: "rgba(120, 183, 211, 0.14)"
    },
    {
      id: "critical",
      start: 240,
      title: "Lytic failure",
      note: "Widespread lysis risk is building. Completed assembly cycles buy only brief breathing room.",
      rates: { fragment: 0.93, phage: 1.36, wave: 1.22, rupture: 1.18 },
      tintA: "rgba(91, 142, 172, 0.3)",
      tintB: "rgba(177, 214, 235, 0.18)"
    }
  ];

  const DAILY_PROFILES = [
    {
      id: "phage-bloom",
      name: "Phage Bloom",
      subtitle: "More phages and faster envelope-stress signaling.",
      modifiers: { phage: 1.35, wave: 0.92, rupture: 0.95, fragment: 1.08, response: 1.2, score: 1.08, repairNeeded: 4 }
    },
    {
      id: "beta-lactam-surge",
      name: "Beta-Lactam Surge",
      subtitle: "Denser beta-lactam pulses with slightly richer factor spawns.",
      modifiers: { phage: 0.98, wave: 1.34, rupture: 0.94, fragment: 1.14, response: 1, score: 1.1, repairNeeded: 4 }
    },
    {
      id: "autolysin-breach",
      name: "Autolysin Breach",
      subtitle: "More autolysin breaches. Positioning matters more than raw speed.",
      modifiers: { phage: 0.95, wave: 1.02, rupture: 1.42, fragment: 1.06, response: 1, score: 1.12, repairNeeded: 4 }
    },
    {
      id: "repair-rationing",
      name: "Repair Rationing",
      subtitle: "Envelope factors are rarer, but each completed assembly cycle pays out more.",
      modifiers: { phage: 1.08, wave: 1.06, rupture: 1.08, fragment: 0.84, response: 1.08, score: 1.18, repairNeeded: 5 }
    }
  ];

  const FRAGMENT_TYPES = [
    { id: "pg-synthase", label: "PG synthase", color: "#a8ffd2", halo: "rgba(168, 255, 210, 0.34)" },
    { id: "lipid-ii", label: "Lipid II", color: "#9fe7ff", halo: "rgba(159, 231, 255, 0.34)" },
    { id: "hydrolase-restraint", label: "Hydrolase restraint", color: "#ffdca0", halo: "rgba(255, 220, 160, 0.34)" }
  ];

  const state = createState();
  let rafId = 0;

  function createState() {
    const selectedSpeciesId = normalizeSpeciesId(readStorageText(MODEL_KEY)) || "ecoli";
    return {
      open: false,
      running: false,
      dying: false,
      paused: false,
      overlayMode: "start",
      lastFrame: 0,
      selectedSpeciesId,
      speciesId: selectedSpeciesId,
      audioEnabled: readStorageText(SOUND_KEY) === "on",
      motionMode: normalizeMotionMode(readStorageText(MOTION_KEY)),
      dailyChallenge: buildDailyChallenge(),
      currentMode: "classic",
      currentBoard: "classic",
      currentBoardLabel: "Classic board",
      scoresOpen: false,
      playerName: readStorageText(NAME_KEY),
      bestByBoard: readStorageJson(BEST_KEY, {}),
      leaderboard: [],
      leaderboardMode: GLOBAL_LEADERBOARD_URL ? "fallback" : "local",
      leaderboardStats: { totalEntries: 0, updatedAt: 0, board: "classic" },
      leaderboardMessage: "",
      leaderboardRequestId: 0,
      dailyBoardReady: false,
      lastPlacement: null,
      elapsed: 0,
      score: 0,
      runSeed: 0,
      assemblyCycles: 0,
      lastDamageKind: "",
      responseChoice: "patch",
      responseChoiceTimer: 0,
      integrity: 100,
      repairProgress: 0,
      repairNeeded: 4,
      responseCharge: 0,
      responseAnnounced: false,
      responseReadyFlash: 0,
      safeWindow: 0,
      boostWindow: 0,
      phaseIndex: 0,
      hitFlash: 0,
      banner: null,
      deathAnimation: null,
      camera: { x: 0, y: 0, zoom: 1, shake: 0, idle: randomRange(0, TAU) },
      input: { up: false, down: false, left: false, right: false },
      pointer: { active: false, x: world.width * 0.5, y: world.height * 0.5 },
      fragments: [],
      phages: [],
      waves: [],
      ruptures: [],
      pulses: [],
      sparks: [],
      floaters: [],
      playerTrail: [],
      backgroundMotes: seedBackgroundMotes(),
      spawnTimers: { fragment: 0.3, phage: 1.4, wave: 4.4, rupture: 5.2 },
      player: createPlayer(selectedSpeciesId)
    };
  }

  function seedBackgroundMotes() {
    return Array.from({ length: 34 }, () => ({
      x: randomRange(0, world.width),
      y: randomRange(0, world.height),
      radius: randomRange(1, 4),
      drift: randomRange(10, 28),
      driftX: randomRange(-6, 6),
      alpha: randomRange(0.06, 0.18),
      depth: randomRange(0.38, 1),
      twinkle: randomRange(0, TAU),
      twinkleSpeed: randomRange(0.5, 1.3)
    }));
  }

  function createPlayer(speciesId) {
    return {
      x: world.width * 0.5,
      y: world.height * 0.55,
      vx: 0,
      vy: 0,
      angle: -Math.PI / 2,
      speciesId
    };
  }

  function normalizeSpeciesId(value) {
    return Object.prototype.hasOwnProperty.call(SPECIES, value) ? value : "ecoli";
  }

  function normalizeBoard(value) {
    const raw = String(value || "").trim().toLowerCase();
    return BOARD_PATTERN.test(raw) ? raw : "classic";
  }

  function normalizeMotionMode(value) {
    return ["full", "calm", "off"].includes(value) ? value : prefersReducedMotion ? "calm" : "full";
  }

  function readStorageText(key) {
    try {
      return window.localStorage.getItem(key) || "";
    } catch {
      return "";
    }
  }

  function writeStorageText(key, value) {
    try {
      window.localStorage.setItem(key, String(value || ""));
    } catch {
      /* no-op */
    }
  }

  function readStorageJson(key, fallback) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function writeStorageJson(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* no-op */
    }
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function easeOutCubic(t) {
    return 1 - (1 - t) ** 3;
  }

  function roundEven(value) {
    return Math.max(2, Math.round(value / 2) * 2);
  }

  function getPlayfieldGrowth(width = world.width) {
    return clamp((width - BASE_PLAYFIELD.width) / (MAX_PLAYFIELD.width - BASE_PLAYFIELD.width), 0, 1);
  }

  function getPlayfieldPaceScale(width = world.width) {
    return lerp(1, 1.12, getPlayfieldGrowth(width));
  }

  function getResponsivePlayfieldSize() {
    if (!stageWrap) {
      return { width: world.width || BASE_PLAYFIELD.width, height: world.height || BASE_PLAYFIELD.height };
    }
    const rect = stageWrap.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      return { width: world.width || BASE_PLAYFIELD.width, height: world.height || BASE_PLAYFIELD.height };
    }

    const widthProgress = clamp((rect.width - 1060) / 420, 0, 1);
    const heightProgress = clamp((rect.height - 596) / 190, 0, 1);
    const growth = Math.max(widthProgress, heightProgress);
    const width = roundEven(lerp(BASE_PLAYFIELD.width, MAX_PLAYFIELD.width, growth));
    return {
      width,
      height: roundEven((width * 9) / 16)
    };
  }

  function getCanvasDpr() {
    return clamp(Number(window.devicePixelRatio) || 1, 1, 2);
  }

  function applyCanvasBackingSize(width = world.width, height = world.height) {
    const dpr = getCanvasDpr();
    const backingWidth = Math.max(2, Math.round(width * dpr));
    const backingHeight = Math.max(2, Math.round(height * dpr));
    world.width = width;
    world.height = height;
    world.dpr = dpr;
    if (canvas.width !== backingWidth) canvas.width = backingWidth;
    if (canvas.height !== backingHeight) canvas.height = backingHeight;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function syncPlayfieldSize(options = {}) {
    const preserveState = options.preserveState !== false;
    const previousWidth = world.width || BASE_PLAYFIELD.width;
    const previousHeight = world.height || BASE_PLAYFIELD.height;
    const nextSize = getResponsivePlayfieldSize();
    const nextDpr = getCanvasDpr();
    if (previousWidth === nextSize.width && previousHeight === nextSize.height && world.dpr === nextDpr) {
      return false;
    }

    const scaleX = nextSize.width / previousWidth;
    const scaleY = nextSize.height / previousHeight;
    const scaleAverage = (scaleX + scaleY) * 0.5;

    applyCanvasBackingSize(nextSize.width, nextSize.height);

    if (!preserveState) {
      state.pointer.x = world.width * 0.5;
      state.pointer.y = world.height * 0.5;
      state.player = createPlayer(state.speciesId);
      state.playerTrail = [];
      state.backgroundMotes = seedBackgroundMotes();
      return true;
    }

    state.pointer.x = clamp(state.pointer.x * scaleX, 0, world.width);
    state.pointer.y = clamp(state.pointer.y * scaleY, 0, world.height);
    state.camera.x *= scaleX;
    state.camera.y *= scaleY;

    if (state.player) {
      state.player.x = clamp(state.player.x * scaleX, 36, world.width - 36);
      state.player.y = clamp(state.player.y * scaleY, 36, world.height - 36);
      state.player.vx *= scaleX;
      state.player.vy *= scaleY;
    }

    state.fragments.forEach((fragment) => {
      fragment.x *= scaleX;
      fragment.y *= scaleY;
      fragment.radius *= scaleAverage;
      fragment.drift *= scaleAverage;
    });

    state.phages.forEach((phage) => {
      phage.x *= scaleX;
      phage.y *= scaleY;
      phage.vx *= scaleX;
      phage.vy *= scaleY;
      phage.radius *= scaleAverage;
      phage.speed *= scaleAverage;
    });

    state.waves.forEach((wave) => {
      if (wave.axis === "x") {
        wave.position *= scaleX;
        wave.thickness *= scaleX;
        wave.velocity *= scaleX;
      } else {
        wave.position *= scaleY;
        wave.thickness *= scaleY;
        wave.velocity *= scaleY;
      }
    });

    state.ruptures.forEach((rupture) => {
      rupture.x1 *= scaleX;
      rupture.y1 *= scaleY;
      rupture.x2 *= scaleX;
      rupture.y2 *= scaleY;
      rupture.vx *= scaleX;
      rupture.vy *= scaleY;
      rupture.width *= scaleAverage;
    });

    state.pulses.forEach((pulse) => {
      pulse.x *= scaleX;
      pulse.y *= scaleY;
      pulse.radius *= scaleAverage;
      pulse.maxRadius *= scaleAverage;
      pulse.lineWidth *= scaleAverage;
    });

    state.sparks.forEach((spark) => {
      spark.x *= scaleX;
      spark.y *= scaleY;
      spark.vx *= scaleAverage;
      spark.vy *= scaleAverage;
      spark.radius *= scaleAverage;
    });

    state.floaters.forEach((floater) => {
      floater.x *= scaleX;
      floater.y *= scaleY;
      floater.vy *= scaleAverage;
    });

    state.playerTrail.forEach((ghost) => {
      ghost.x *= scaleX;
      ghost.y *= scaleY;
    });

    if (state.deathAnimation) {
      state.deathAnimation.x *= scaleX;
      state.deathAnimation.y *= scaleY;
      state.deathAnimation.shards.forEach((shard) => {
        shard.speed *= scaleAverage;
        shard.lift *= scaleAverage;
        shard.sizeX *= scaleAverage;
        shard.sizeY *= scaleAverage;
      });
    }

    state.backgroundMotes = seedBackgroundMotes();
    return true;
  }

  function getDepthScale(y) {
    return lerp(0.86, 1.15, clamp(y / world.height, 0, 1));
  }

  function drawGroundShadow(x, y, width, height, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(width, height);
    ctx.fillStyle = `rgba(4, 8, 16, ${alpha})`;
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  function applyWorldTransform() {
    const { x, y, zoom } = state.camera;
    ctx.translate(world.width * 0.5 + x, world.height * 0.5 + y);
    ctx.scale(zoom, zoom);
    ctx.translate(-world.width * 0.5, -world.height * 0.5);
  }

  function randomRange(min, max, rng = activeRandom) {
    return min + rng() * (max - min);
  }

  function pick(list, rng = activeRandom) {
    return list[Math.floor(rng() * list.length)];
  }

  function hashString(value) {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function createSeededRandom(seed) {
    let value = seed >>> 0;
    return () => {
      value = (value + 0x6d2b79f5) >>> 0;
      let next = Math.imul(value ^ (value >>> 15), 1 | value);
      next ^= next + Math.imul(next ^ (next >>> 7), 61 | next);
      return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
    };
  }

  function getLabDateKey(date = Date.now()) {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: LAB_TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    })
      .formatToParts(new Date(date))
      .reduce((accumulator, part) => {
        if (part.type !== "literal") accumulator[part.type] = part.value;
        return accumulator;
      }, {});
    return `${parts.year}-${parts.month}-${parts.day}`;
  }

  function formatLabDate(dateKey) {
    const [year, month, day] = String(dateKey).split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    return new Intl.DateTimeFormat("en-US", {
      timeZone: LAB_TIMEZONE,
      month: "short",
      day: "numeric"
    }).format(date);
  }

  function buildDailyChallenge() {
    const dateKey = getLabDateKey();
    const rng = createSeededRandom(hashString(`envelope-daily-${dateKey}`));
    const speciesIds = Object.keys(SPECIES);
    const profile = DAILY_PROFILES[Math.floor(rng() * DAILY_PROFILES.length)];
    const speciesId = speciesIds[Math.floor(rng() * speciesIds.length)];
    return {
      dateKey,
      dateLabel: formatLabDate(dateKey),
      board: `daily-${dateKey}`,
      speciesId,
      profile
    };
  }

  function refreshDailyChallenge() {
    const nextChallenge = buildDailyChallenge();
    if (nextChallenge.board !== state.dailyChallenge.board) {
      state.dailyChallenge = nextChallenge;
      if (state.currentMode === "daily" && !state.running) {
        state.currentBoard = nextChallenge.board;
      }
    }
  }

  function getSpecies(id = state.speciesId) {
    return SPECIES[normalizeSpeciesId(id)];
  }

  function getCurrentBest(board = state.currentBoard) {
    const key = normalizeBoard(board);
    return Math.max(0, Math.floor(Number(state.bestByBoard[key]) || 0));
  }

  function setCurrentBest(board, score) {
    const key = normalizeBoard(board);
    state.bestByBoard[key] = Math.max(getCurrentBest(key), Math.floor(Number(score) || 0));
    writeStorageJson(BEST_KEY, state.bestByBoard);
  }

  function getLocalBoardKey(board) {
    return `${BOARD_PREFIX}${normalizeBoard(board)}`;
  }

  function normalizeName(value) {
    return String(value || "")
      .replace(/[^A-Za-z0-9 ._'-]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 24);
  }

  function normalizeForModeration(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[@]/g, "a")
      .replace(/[0]/g, "o")
      .replace(/[1!|]/g, "i")
      .replace(/[3]/g, "e")
      .replace(/[4]/g, "a")
      .replace(/[5$]/g, "s")
      .replace(/[7]/g, "t")
      .replace(/[8]/g, "b")
      .replace(/[^a-z]/g, "");
  }

  function isNameAllowed(value) {
    const normalized = normalizeForModeration(value);
    if (!normalized) return true;
    const blockedTokens = [
      "fuck",
      "fucking",
      "motherfucker",
      "shit",
      "bitch",
      "asshole",
      "cunt",
      "dick",
      "cock",
      "pussy",
      "whore",
      "slut",
      "rape",
      "nigger",
      "faggot",
      "retard"
    ];
    return !blockedTokens.some((token) => normalized.includes(token));
  }

  function getPlayerName() {
    const sanitized = normalizeName(playerNameInput ? playerNameInput.value : "");
    if (!sanitized) return "Anonymous";
    return isNameAllowed(sanitized) ? sanitized : "Anonymous";
  }

  function updatePlayerNameFeedback() {
    if (!playerNameFeedback || !playerNameInput) return;
    const sanitized = normalizeName(playerNameInput.value);
    const allowed = isNameAllowed(sanitized);
    if (!allowed) {
      playerNameFeedback.hidden = false;
      playerNameFeedback.textContent = "That name is unavailable. Scores will save as Anonymous.";
    } else if (playerNameInput.value && sanitized !== playerNameInput.value) {
      playerNameFeedback.hidden = false;
      playerNameFeedback.textContent = "Unsupported characters will be removed when the score is saved.";
    } else {
      playerNameFeedback.hidden = true;
      playerNameFeedback.textContent = "";
    }
  }

  function readLocalLeaderboard(board) {
    const raw = readStorageJson(getLocalBoardKey(board), []);
    return normalizeLeaderboardEntries(raw, board);
  }

  function writeLocalLeaderboard(board, entries) {
    writeStorageJson(getLocalBoardKey(board), normalizeLeaderboardEntries(entries, board));
  }

  function normalizeLeaderboardEntries(entries, board) {
    const normalizedBoard = normalizeBoard(board);
    return (Array.isArray(entries) ? entries : [])
      .map((entry) => ({
        name: (() => {
          const cleaned = normalizeName(entry?.name) || "Anonymous";
          return isNameAllowed(cleaned) ? cleaned : "Anonymous";
        })(),
        score: clamp(Math.floor(Number(entry?.score) || 0), 0, 2000000000),
        species: normalizeSpeciesId(entry?.species),
        playedAt: Math.floor(Number(entry?.playedAt || entry?.createdAt) || Date.now()),
        board: normalizeBoard(entry?.board || normalizedBoard)
      }))
      .filter((entry) => entry.score > 0 && entry.board === normalizedBoard)
      .sort((left, right) => {
        if (right.score !== left.score) return right.score - left.score;
        return left.playedAt - right.playedAt;
      })
      .slice(0, LEADERBOARD_SIZE);
  }

  function computeLocalRank(entries, newEntry) {
    const merged = normalizeLeaderboardEntries([...(entries || []), newEntry], newEntry.board);
    const index = merged.findIndex(
      (entry) =>
        entry.name === newEntry.name &&
        entry.score === newEntry.score &&
        entry.playedAt === newEntry.playedAt &&
        entry.board === newEntry.board
    );
    return index >= 0 ? index + 1 : merged.length;
  }

  function formatDuration(totalSeconds) {
    const rounded = Math.max(0, Math.floor(totalSeconds));
    const minutes = Math.floor(rounded / 60);
    const seconds = rounded % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }

  function formatRank(rank) {
    const remainder10 = rank % 10;
    const remainder100 = rank % 100;
    if (remainder10 === 1 && remainder100 !== 11) return `${rank}st`;
    if (remainder10 === 2 && remainder100 !== 12) return `${rank}nd`;
    if (remainder10 === 3 && remainder100 !== 13) return `${rank}rd`;
    return `${rank}th`;
  }

  function pointToCanvas(event) {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return { x: world.width * 0.5, y: world.height * 0.5 };
    return {
      x: ((event.clientX - rect.left) / rect.width) * world.width,
      y: ((event.clientY - rect.top) / rect.height) * world.height
    };
  }

  function setOverlayPoints(items) {
    if (!overlayPoints) return;
    overlayPoints.innerHTML = "";
    items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      overlayPoints.append(li);
    });
  }

  function renderRunReport(best) {
    if (!runReportEl) return;
    const phase = getPhaseForElapsed(state.elapsed);
    const causeMap = {
      phage: "phage adsorption",
      wave: "beta-lactam pulse",
      rupture: "autolysin breach"
    };
    const items = [
      ["Phase reached", phase.title],
      ["Assembly cycles", String(state.assemblyCycles)],
      ["Lysis pressure", causeMap[state.lastDamageKind] || "cumulative envelope stress"],
      ["Best score", String(best)]
    ];
    runReportEl.innerHTML = "";
    items.forEach(([label, value]) => {
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      dt.textContent = label;
      dd.textContent = value;
      runReportEl.append(dt, dd);
    });
  }

  function hideOverlay() {
    overlay.classList.add("is-hidden");
  }

  function setScoresOpen(nextOpen) {
    state.scoresOpen = Boolean(nextOpen);
    scoresPanel.hidden = !state.scoresOpen;
    scoresToggleButton.setAttribute("aria-expanded", String(state.scoresOpen));
    scoresToggleButton.textContent = state.scoresOpen ? "Hide Scores" : "Scores";
  }

  function showOverlay(mode) {
    state.overlayMode = mode;
    overlay.classList.remove("is-hidden");
    setScoresOpen(mode === "ended");
    if (runReportEl) {
      runReportEl.hidden = mode !== "ended";
      if (mode !== "ended") runReportEl.innerHTML = "";
    }

    if (mode === "start") {
      overlayTitle.textContent = "Envelope Stress Test Chamber";
      overlayCopy.textContent =
        "Pilot a bacterial cell through an animated envelope assay: build PG, manage rupture pressure, and fire the stress response before lysis.";
      overlayStatus.textContent = "Collect envelope assembly units, then induce the stress response when the meter is full.";
      setOverlayPoints([
        "Phage edge pings, beta-lactam sweeps, and autolysin cracks now telegraph before impact.",
        "Completed assembly cycles generate a protective PG pulse around the cell."
      ]);
      startButton.textContent = "Start Classic Run";
      dailyStartButton.textContent = "Play Daily Challenge";
    } else if (mode === "paused") {
      overlayTitle.textContent = "Run paused";
      overlayCopy.textContent = `${state.currentBoardLabel}. Resume when you are ready to keep the bacterium intact.`;
      overlayStatus.textContent = `Score ${Math.round(state.score)} after ${formatDuration(state.elapsed)} with ${Math.round(
        state.integrity
      )}% integrity remaining.`;
      setOverlayPoints([
        `${state.repairProgress} of ${state.repairNeeded} envelope factors collected.`,
        "Induce the stress response proactively when beta-lactam pulses and autolysin breaches start overlapping."
      ]);
      startButton.textContent = "Resume Run";
      dailyStartButton.textContent = "Restart Run";
    } else {
      const best = Math.max(getCurrentBest(state.currentBoard), Math.round(state.score));
      overlayTitle.textContent = "Cell lysis";
      overlayCopy.textContent = `${state.currentBoardLabel}. Survived ${formatDuration(state.elapsed)} with ${Math.round(
        state.score
      )} points.`;
      overlayStatus.textContent = state.lastPlacement
        ? state.lastPlacement.summary
        : "Score saved. Try another strain or jump into the daily challenge for a new rhythm.";
      renderRunReport(best);
      setOverlayPoints([
        `Personal best on this board: ${best}.`,
        `Species used: ${getSpecies().label}.`,
        `Run seed: ${state.runSeed}.`
      ]);
      startButton.textContent = state.currentMode === "daily" ? "Replay Daily Challenge" : "Run Classic Again";
      dailyStartButton.textContent = state.currentMode === "daily" ? "Play Classic" : "Try Daily Challenge";
    }

    updateControlState();
  }

  function updateControlState() {
    if (state.dying) {
      pauseButton.disabled = true;
      restartButton.disabled = true;
      responseButton.disabled = true;
      responseButton.classList.remove("is-ready");
      pauseButton.textContent = "Pause";
      return;
    }
    const activeRun = state.running && !state.paused;
    pauseButton.disabled = !state.running;
    restartButton.disabled = !state.running && state.overlayMode === "start";
    responseButton.disabled = !activeRun || state.responseCharge < 100;
    responseButton.classList.toggle("is-ready", activeRun && state.responseCharge >= 100);
    if (activeRun && state.responseCharge >= 100) {
      const choices = ["Patch Wall", "Purge Phages", "Boost Motility"];
      responseButton.textContent = choices[state.assemblyCycles % choices.length];
    } else {
      responseButton.textContent = "Induce Stress Response";
    }
    pauseButton.textContent = state.paused ? "Resume" : "Pause";
  }

  function updateSpeciesInfo() {
    const overlaySpecies = getSpecies(state.selectedSpeciesId);
    const activeSpecies = getSpecies(state.running ? state.speciesId : state.selectedSpeciesId);
    if (modelSelect) modelSelect.value = state.selectedSpeciesId;
    if (modelNote) modelNote.textContent = overlaySpecies.passiveCopy;
    if (traitTitleEl) traitTitleEl.textContent = activeSpecies.passiveTitle;
    if (traitCopyEl) traitCopyEl.textContent = activeSpecies.passiveCopy;
  }

  function updateDailyNote() {
    if (!dailyNote) return;
    const challenge = state.dailyChallenge;
    const species = getSpecies(challenge.speciesId);
    dailyNote.textContent = `Daily challenge: ${challenge.profile.name} with ${species.label}. ${challenge.profile.subtitle}`;
  }

  function getPhaseForElapsed(elapsedSeconds) {
    let phase = PHASES[0];
    for (let index = 0; index < PHASES.length; index += 1) {
      if (elapsedSeconds >= PHASES[index].start) {
        phase = PHASES[index];
      } else {
        break;
      }
    }
    return phase;
  }

  function getModeModifiers() {
    if (state.currentMode !== "daily") {
      return { phage: 1, wave: 1, rupture: 1, fragment: 1, response: 1, score: 1, repairNeeded: 4 };
    }
    return state.dailyChallenge.profile.modifiers;
  }

  function setBanner(title, copy, timer = 2.2) {
    state.banner = { title, copy, timer };
    announce(`${title}. ${copy}`);
  }

  function addFloater(x, y, text, color = "#d8fbff") {
    state.floaters.push({ x, y, text, color, life: 1.15, vy: -24 });
  }

  function addImpactSparks(x, y, color = "#d8fbff", count = 10) {
    if (getMotionScale() <= 0 && count > 6) count = 6;
    for (let index = 0; index < count; index += 1) {
      const angle = (index / Math.max(1, count)) * TAU + randomRange(-0.34, 0.34);
      const speed = randomRange(48, 180);
      state.sparks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: randomRange(1.8, 4.8),
        color,
        life: randomRange(0.32, 0.72),
        maxLife: 0.72
      });
    }
  }

  function resetInputState() {
    state.input.up = false;
    state.input.down = false;
    state.input.left = false;
    state.input.right = false;
    state.pointer.active = false;
    state.pointer.x = world.width * 0.5;
    state.pointer.y = world.height * 0.5;
  }

  function announce(message) {
    if (!liveStatusEl) return;
    liveStatusEl.textContent = message;
  }

  function getMotionScale() {
    if (prefersReducedMotion || state.motionMode === "off") return 0;
    return state.motionMode === "calm" ? 0.42 : 1;
  }

  function addCameraImpulse(amount) {
    state.camera.shake = Math.max(state.camera.shake, amount * getMotionScale());
  }

  function createRunSeed(mode) {
    return hashString(`${mode}-${state.currentBoard}-${state.speciesId}-${Date.now()}-${Math.floor(Math.random() * 1e9)}`);
  }

  function playAssayTone(kind) {
    if (!state.audioEnabled) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!audioContext) audioContext = new AudioContext();
    if (audioContext.state === "suspended") {
      audioContext.resume().catch(() => {});
    }
    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const toneMap = {
      pickup: [660, 0.05, 0.07],
      repair: [420, 0.08, 0.16],
      damage: [150, 0.11, 0.18],
      response: [260, 0.09, 0.42],
      phase: [520, 0.06, 0.2],
      lysis: [92, 0.13, 0.45]
    };
    const [frequency, volume, duration] = toneMap[kind] || toneMap.pickup;
    oscillator.type = kind === "damage" || kind === "lysis" ? "sawtooth" : "sine";
    oscillator.frequency.setValueAtTime(frequency, now);
    if (kind === "response") oscillator.frequency.exponentialRampToValueAtTime(760, now + duration);
    if (kind === "lysis") oscillator.frequency.exponentialRampToValueAtTime(48, now + duration);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.04);
  }

  function updateAudioControl() {
    if (!audioToggleButton) return;
    audioToggleButton.textContent = state.audioEnabled ? "Sound On" : "Sound Off";
    audioToggleButton.setAttribute("aria-pressed", String(state.audioEnabled));
  }

  function updateMotionControl() {
    if (motionSelect) motionSelect.value = state.motionMode;
  }

  function createLysisAnimation() {
    const species = getSpecies();
    const shardCount = prefersReducedMotion ? 10 : 22;
    const palette = [species.palette.bodyA, species.palette.bodyB, species.palette.outline, species.palette.pulse];
    return {
      x: state.player.x,
      y: state.player.y,
      angle: state.player.angle,
      speciesId: state.speciesId,
      elapsed: 0,
      duration: prefersReducedMotion ? 0.82 : 1.26,
      shards: Array.from({ length: shardCount }, (_, index) => {
        const angle = (index / shardCount) * TAU + randomRange(-0.22, 0.22);
        return {
          angle,
          speed: randomRange(88, 248),
          lift: randomRange(-34, 34),
          spin: randomRange(-8, 8),
          sizeX: randomRange(8, 18),
          sizeY: randomRange(4, 10),
          delay: randomRange(0.04, 0.24),
          color: palette[index % palette.length],
          kind: index % 3 === 0 ? "droplet" : "sliver"
        };
      })
    };
  }

  function updateLysisAnimation(dt) {
    if (!state.dying || !state.deathAnimation) return;
    state.deathAnimation.elapsed += dt;
    if (state.deathAnimation.elapsed >= state.deathAnimation.duration) {
      state.dying = false;
      state.deathAnimation = null;
      updateControlState();
      showOverlay("ended");
      submitScore();
    }
  }

  function spawnInitialFragments() {
    while (state.fragments.length < 2) {
      spawnFragment();
    }
  }

  function resetRun(mode) {
    refreshDailyChallenge();
    state.currentMode = mode;
    state.dailyBoardReady = false;
    state.currentBoard = mode === "daily" ? state.dailyChallenge.board : "classic";
    state.currentBoardLabel = mode === "daily" ? "Daily challenge" : "Classic board";
    state.speciesId = mode === "daily" ? state.dailyChallenge.speciesId : state.selectedSpeciesId;
    state.runSeed = createRunSeed(mode);
    activeRandom = createSeededRandom(state.runSeed);
    state.elapsed = 0;
    state.score = 0;
    state.assemblyCycles = 0;
    state.lastDamageKind = "";
    state.responseChoice = "patch";
    state.responseChoiceTimer = 0;
    state.integrity = 100;
    state.responseCharge = 0;
    state.responseAnnounced = false;
    state.responseReadyFlash = 0;
    state.safeWindow = 0;
    state.boostWindow = 0;
    state.hitFlash = 0;
    state.phaseIndex = 0;
    state.repairNeeded = Math.max(4, Math.floor(getModeModifiers().repairNeeded || 4));
    state.repairProgress = 0;
    state.lastPlacement = null;
    state.banner = null;
    setScoresOpen(false);
    state.fragments = [];
    state.phages = [];
    state.waves = [];
    state.ruptures = [];
    state.pulses = [];
    state.sparks = [];
    state.floaters = [];
    state.playerTrail = [];
    state.player = createPlayer(state.speciesId);
    state.spawnTimers = { fragment: 0.2, phage: 1.3, wave: 4.8, rupture: 5.6 };
    spawnInitialFragments();
    state.running = true;
    state.dying = false;
    state.paused = false;
    state.lastFrame = 0;
    state.deathAnimation = null;
    resetInputState();
    hideOverlay();
    setBanner("Surveillance engaged", "Collect envelope factors to complete your first cycle.");
    refreshLeaderboard(state.currentBoard);
    updateHud(true);
    updateControlState();
  }

  function pauseRun() {
    if (!state.running || state.dying) return;
    state.paused = true;
    resetInputState();
    showOverlay("paused");
  }

  function resumeRun() {
    if (!state.running || state.dying) return;
    state.paused = false;
    state.lastFrame = 0;
    resetInputState();
    hideOverlay();
    updateControlState();
  }

  function applyDamage(amount, kind, hitX, hitY) {
    if (state.safeWindow > 0) return false;
    const species = getSpecies();
    let adjusted = amount * species.damageMul;
    if (kind === "rupture") {
      adjusted *= species.ruptureDamageMul;
    }
    state.lastDamageKind = kind;
    state.integrity = clamp(state.integrity - adjusted, 0, 100);
    state.safeWindow = 0.65;
    state.hitFlash = 0.32 * Math.max(0.35, getMotionScale());
    addCameraImpulse(1);
    addImpactSparks(hitX, hitY, "#ffb6c4", prefersReducedMotion ? 5 : 14);
    playAssayTone("damage");
    addFloater(hitX, hitY, `-${Math.round(adjusted)}`, "#ffb6c4");
    if (state.integrity <= 0) {
      endRun();
    }
    return true;
  }

  function completeRepairCycle() {
    const species = getSpecies();
    const scoreBonus = Math.round(320 * getModeModifiers().score + state.elapsed * 0.3);
    state.repairProgress = 0;
    state.assemblyCycles += 1;
    state.score += scoreBonus;
    state.integrity = clamp(state.integrity + 12 + species.healBonus, 0, 100);
    state.responseCharge = clamp(state.responseCharge + 18, 0, 100);
    state.safeWindow = Math.max(state.safeWindow, 0.85);
    addCameraImpulse(0.4);
    const radius = species.burstRadius;
    clearHazardsAroundPlayer(radius);
    state.pulses.push({
      x: state.player.x,
      y: state.player.y,
      radius: 10,
      maxRadius: radius + 24,
      lineWidth: 10,
      color: species.palette.pulse,
      life: 0.62
    });
    setBanner("Assembly complete", "A productive cycle cleared nearby stressors.");
    addFloater(state.player.x, state.player.y - 36, `+${scoreBonus}`, "#b9ffd4");
    addImpactSparks(state.player.x, state.player.y, species.palette.pulse, prefersReducedMotion ? 6 : 18);
    playAssayTone("repair");
  }

  function triggerStressResponse() {
    if (!state.running || state.paused || state.responseCharge < 100) return;
    const species = getSpecies();
    const choices = ["patch", "purge", "boost"];
    state.responseChoice = choices[state.assemblyCycles % choices.length];
    state.responseChoiceTimer = 1.2;
    state.responseCharge = 0;
    state.responseAnnounced = false;
    state.responseReadyFlash = 0;
    state.safeWindow = Math.max(state.safeWindow, 1.15);
    addCameraImpulse(0.72);
    let responseLabel = "Patch Wall";
    let burstRadius = species.burstRadius + 28;
    if (state.responseChoice === "patch") {
      state.integrity = clamp(state.integrity + 24 + species.healBonus, 0, 100);
    } else if (state.responseChoice === "purge") {
      responseLabel = "Purge Phages";
      burstRadius += 54;
      state.integrity = clamp(state.integrity + 10 + species.healBonus, 0, 100);
    } else {
      responseLabel = "Boost Motility";
      state.integrity = clamp(state.integrity + 12 + species.healBonus, 0, 100);
      state.safeWindow = Math.max(state.safeWindow, 1.65);
      state.boostWindow = 2.35;
    }
    clearHazardsAroundPlayer(burstRadius);
    state.pulses.push({
      x: state.player.x,
      y: state.player.y,
      radius: 16,
      maxRadius: burstRadius + 42,
      lineWidth: 14,
      color: species.palette.pulse,
      life: 0.74
    });
    addImpactSparks(state.player.x, state.player.y, species.palette.pulse, prefersReducedMotion ? 8 : 26);
    state.score += 120;
    setBanner(responseLabel, "Envelope stress response fired. Reposition before the next pressure wave.");
    addFloater(state.player.x, state.player.y - 40, responseLabel, "#d7fbff");
    playAssayTone("response");
    updateControlState();
  }

  function getDifficultyScalar() {
    return clamp(state.elapsed / 300, 0, 1);
  }

  function spawnFragment() {
    const kind = pick(FRAGMENT_TYPES);
    const margin = 72;
    let attempts = 0;
    let x = world.width * 0.5;
    let y = world.height * 0.5;
    while (attempts < 18) {
      x = randomRange(margin, world.width - margin);
      y = randomRange(margin, world.height - margin);
      const distanceToPlayer = Math.hypot(x - state.player.x, y - state.player.y);
      if (distanceToPlayer > 120) break;
      attempts += 1;
    }
    state.fragments.push({
      kind,
      x,
      y,
      radius: 14,
      pulse: randomRange(0, TAU),
      drift: randomRange(8, 20)
    });
  }

  function spawnPhage() {
    const difficulty = getDifficultyScalar();
    const paceScale = getPlayfieldPaceScale();
    const edge = Math.floor(activeRandom() * 4);
    let x = 0;
    let y = 0;
    if (edge === 0) {
      x = -28;
      y = randomRange(40, world.height - 40);
    } else if (edge === 1) {
      x = world.width + 28;
      y = randomRange(40, world.height - 40);
    } else if (edge === 2) {
      x = randomRange(40, world.width - 40);
      y = -28;
    } else {
      x = randomRange(40, world.width - 40);
      y = world.height + 28;
    }
    const speed = lerp(96, 182, difficulty) * paceScale;
    state.phages.push({
      x,
      y,
      vx: 0,
      vy: 0,
      radius: randomRange(12, 15),
      speed,
      turnRate: lerp(1.4, 2.5, difficulty),
      warning: TELEGRAPH.phage,
      maxWarning: TELEGRAPH.phage,
      nearActive: false,
      nearAwarded: false,
      spin: randomRange(0, TAU)
    });
  }

  function spawnWave() {
    const difficulty = getDifficultyScalar();
    const paceScale = getPlayfieldPaceScale();
    const axis = activeRandom() > 0.5 ? "x" : "y";
    const thickness = randomRange(84, 112);
    const fromNegative = activeRandom() > 0.5;
    const velocity = (fromNegative ? 1 : -1) * lerp(148, 236, difficulty) * paceScale;
    state.waves.push({
      axis,
      position: fromNegative ? -thickness : axis === "x" ? world.width + thickness : world.height + thickness,
      velocity,
      thickness,
      hue: activeRandom() > 0.5 ? "#77dfff" : "#91f3ff",
      warning: TELEGRAPH.wave,
      maxWarning: TELEGRAPH.wave
    });
  }

  function spawnRupture() {
    const difficulty = getDifficultyScalar();
    const paceScale = getPlayfieldPaceScale();
    const angle = pick([Math.PI / 4, -Math.PI / 4, (3 * Math.PI) / 4, (-3 * Math.PI) / 4]) + randomRange(-0.2, 0.2);
    const length = randomRange(260, 360);
    const directionX = Math.cos(angle);
    const directionY = Math.sin(angle);
    const normalX = -directionY;
    const normalY = directionX;
    const edge = Math.floor(activeRandom() * 4);
    let centerX = 0;
    let centerY = 0;
    if (edge === 0) {
      centerX = -80;
      centerY = randomRange(60, world.height - 60);
    } else if (edge === 1) {
      centerX = world.width + 80;
      centerY = randomRange(60, world.height - 60);
    } else if (edge === 2) {
      centerX = randomRange(60, world.width - 60);
      centerY = -80;
    } else {
      centerX = randomRange(60, world.width - 60);
      centerY = world.height + 80;
    }
    const half = length * 0.5;
    state.ruptures.push({
      x1: centerX - directionX * half,
      y1: centerY - directionY * half,
      x2: centerX + directionX * half,
      y2: centerY + directionY * half,
      vx: normalX * lerp(134, 220, difficulty) * paceScale,
      vy: normalY * lerp(134, 220, difficulty) * paceScale,
      width: randomRange(12, 18),
      warning: TELEGRAPH.rupture,
      maxWarning: TELEGRAPH.rupture,
      life: 6.6
    });
  }

  function updateSpawnTimers(dt) {
    const phase = getPhaseForElapsed(state.elapsed);
    const modifiers = getModeModifiers();
    const difficulty = getDifficultyScalar();
    const phageMul = phase.rates.phage * modifiers.phage * (0.74 + difficulty * 0.9);
    const waveMul = phase.rates.wave * modifiers.wave * (0.62 + difficulty * 0.72);
    const ruptureMul = phase.rates.rupture * modifiers.rupture * (0.58 + difficulty * 0.74);
    const fragmentMul = phase.rates.fragment * modifiers.fragment;

    state.spawnTimers.fragment -= dt * fragmentMul;
    if (state.fragments.length < 2 && state.spawnTimers.fragment <= 0) {
      spawnFragment();
      state.spawnTimers.fragment = randomRange(1.05, 1.75);
    }

    state.spawnTimers.phage -= dt * phageMul;
    if (state.spawnTimers.phage <= 0) {
      spawnPhage();
      state.spawnTimers.phage = randomRange(1.2, 1.95);
    }

    if (state.elapsed > 22) {
      state.spawnTimers.wave -= dt * waveMul;
      if (state.spawnTimers.wave <= 0) {
        spawnWave();
        state.spawnTimers.wave = randomRange(4.5, 7.1);
      }
    }

    if (state.elapsed > 38) {
      state.spawnTimers.rupture -= dt * ruptureMul;
      if (state.spawnTimers.rupture <= 0) {
        spawnRupture();
        state.spawnTimers.rupture = randomRange(5.2, 7.8);
      }
    }
  }

  function clearHazardsAroundPlayer(radius) {
    const px = state.player.x;
    const py = state.player.y;
    state.phages = state.phages.filter((phage) => {
      const distance = Math.hypot(phage.x - px, phage.y - py);
      if (distance <= radius + phage.radius) {
        addFloater(phage.x, phage.y, "+", "#c8fff1");
        return false;
      }
      return true;
    });
    state.waves = state.waves.filter((wave) => {
      const distance = wave.axis === "x" ? Math.abs(wave.position - px) : Math.abs(wave.position - py);
      return distance > radius + wave.thickness * 0.5;
    });
    state.ruptures = state.ruptures.filter((rupture) => {
      const distance = pointSegmentDistance(px, py, rupture.x1, rupture.y1, rupture.x2, rupture.y2);
      return distance > radius + rupture.width;
    });
  }

  function pointSegmentDistance(px, py, ax, ay, bx, by) {
    const abx = bx - ax;
    const aby = by - ay;
    const lengthSquared = abx * abx + aby * aby || 1;
    const t = clamp(((px - ax) * abx + (py - ay) * aby) / lengthSquared, 0, 1);
    const closestX = ax + abx * t;
    const closestY = ay + aby * t;
    return Math.hypot(px - closestX, py - closestY);
  }

  function isTypingTarget(target) {
    if (!(target instanceof Element)) return false;
    return target.matches("input, textarea, select");
  }

  function updatePlayer(dt) {
    const species = getSpecies();
    let moveX = 0;
    let moveY = 0;

    if (state.pointer.active) {
      moveX = state.pointer.x - state.player.x;
      moveY = state.pointer.y - state.player.y;
      const distance = Math.hypot(moveX, moveY);
      if (distance > 2) {
        moveX /= distance;
        moveY /= distance;
      } else {
        moveX = 0;
        moveY = 0;
      }
    } else {
      if (state.input.left) moveX -= 1;
      if (state.input.right) moveX += 1;
      if (state.input.up) moveY -= 1;
      if (state.input.down) moveY += 1;
      const length = Math.hypot(moveX, moveY);
      if (length > 0) {
        moveX /= length;
        moveY /= length;
      }
    }

    const baseSpeed = 294 * species.speedMul * getPlayfieldPaceScale() * (state.boostWindow > 0 ? 1.22 : 1);
    state.player.vx = moveX * baseSpeed;
    state.player.vy = moveY * baseSpeed;
    state.player.x = clamp(state.player.x + state.player.vx * dt, 36, world.width - 36);
    state.player.y = clamp(state.player.y + state.player.vy * dt, 36, world.height - 36);
    if (Math.abs(state.player.vx) + Math.abs(state.player.vy) > 12) {
      state.player.angle = Math.atan2(state.player.vy, state.player.vx);
    }
    const speed = Math.hypot(state.player.vx, state.player.vy);
    if (speed > 16) {
      state.playerTrail.unshift({
        x: state.player.x,
        y: state.player.y,
        angle: state.player.angle,
        speciesId: state.speciesId,
        life: 0.42,
        strength: clamp(speed / 320, 0.3, 1)
      });
      if (state.playerTrail.length > 9) {
        state.playerTrail.length = 9;
      }
    }
  }

  function updateFragments(dt) {
    const species = getSpecies();
    const magnetRadius = 96 + species.fragmentMagnet;
    for (let index = state.fragments.length - 1; index >= 0; index -= 1) {
      const fragment = state.fragments[index];
      fragment.pulse += dt * 2.1;
      const distance = Math.hypot(fragment.x - state.player.x, fragment.y - state.player.y);
      if (distance < magnetRadius && distance > 0.001) {
        const pull = clamp((magnetRadius - distance) / magnetRadius, 0, 1) * (84 + species.fragmentMagnet * 0.7);
        fragment.x -= ((fragment.x - state.player.x) / distance) * pull * dt;
        fragment.y -= ((fragment.y - state.player.y) / distance) * pull * dt;
      }

      if (distance < HITBOX.pickupRadius) {
        state.fragments.splice(index, 1);
        state.score += 60;
        state.repairProgress += fragment.kind.id === "lipid-ii" ? 2 : 1;
        if (fragment.kind.id === "hydrolase-restraint") {
          state.safeWindow = Math.max(state.safeWindow, 0.78);
          state.ruptures = state.ruptures.filter((rupture) => {
            const ruptureDistance = pointSegmentDistance(fragment.x, fragment.y, rupture.x1, rupture.y1, rupture.x2, rupture.y2);
            return ruptureDistance > 190;
          });
        }
        state.responseCharge = clamp(state.responseCharge + 19 * species.responseGainMul * getModeModifiers().response, 0, 100);
        addFloater(fragment.x, fragment.y, fragment.kind.label, fragment.kind.color);
        addImpactSparks(fragment.x, fragment.y, fragment.kind.color, prefersReducedMotion ? 4 : 10);
        playAssayTone("pickup");
        if (state.responseCharge >= 100) {
          state.responseReadyFlash = 0.48;
        }
        if (state.repairProgress >= state.repairNeeded) {
          completeRepairCycle();
        }
      }
    }
  }

  function updatePhages(dt) {
    const difficulty = getDifficultyScalar();
    for (let index = state.phages.length - 1; index >= 0; index -= 1) {
      const phage = state.phages[index];
      if (phage.warning > 0) {
        phage.warning = Math.max(0, phage.warning - dt);
        continue;
      }
      const toPlayerX = state.player.x - phage.x;
      const toPlayerY = state.player.y - phage.y;
      const distance = Math.hypot(toPlayerX, toPlayerY) || 1;
      const desiredX = (toPlayerX / distance) * phage.speed;
      const desiredY = (toPlayerY / distance) * phage.speed;
      phage.vx = lerp(phage.vx, desiredX, clamp(dt * phage.turnRate, 0, 1));
      phage.vy = lerp(phage.vy, desiredY, clamp(dt * phage.turnRate, 0, 1));
      phage.x += phage.vx * dt;
      phage.y += phage.vy * dt;
      phage.spin += dt * (1.3 + difficulty);

      const collisionRadius = HITBOX.playerRadius + phage.radius;
      if (distance <= collisionRadius) {
        state.phages.splice(index, 1);
        applyDamage(13, "phage", phage.x, phage.y);
        continue;
      }

      if (!phage.nearAwarded && distance < collisionRadius + 38) {
        phage.nearActive = true;
      } else if (phage.nearActive && distance > collisionRadius + 68) {
        phage.nearActive = false;
        phage.nearAwarded = true;
        state.score += 36;
        state.responseCharge = clamp(state.responseCharge + 4 * getSpecies().responseGainMul, 0, 100);
        addFloater(phage.x, phage.y, "Close call", "#d2faff");
      }

      if (phage.x < -60 || phage.x > world.width + 60 || phage.y < -60 || phage.y > world.height + 60) {
        state.phages.splice(index, 1);
      }
    }
  }

  function updateWaves(dt) {
    for (let index = state.waves.length - 1; index >= 0; index -= 1) {
      const wave = state.waves[index];
      if (wave.warning > 0) {
        wave.warning = Math.max(0, wave.warning - dt);
        continue;
      }
      wave.position += wave.velocity * dt;
      const collisionDistance = wave.axis === "x" ? Math.abs(state.player.x - wave.position) : Math.abs(state.player.y - wave.position);
      if (collisionDistance < wave.thickness * 0.5 + HITBOX.wavePadding) {
        state.waves.splice(index, 1);
        applyDamage(17, "wave", state.player.x, state.player.y);
        continue;
      }
      const limit = wave.axis === "x" ? world.width : world.height;
      if (wave.position < -wave.thickness * 1.5 || wave.position > limit + wave.thickness * 1.5) {
        state.waves.splice(index, 1);
      }
    }
  }

  function updateRuptures(dt) {
    for (let index = state.ruptures.length - 1; index >= 0; index -= 1) {
      const rupture = state.ruptures[index];
      if (rupture.warning > 0) {
        rupture.warning = Math.max(0, rupture.warning - dt);
        continue;
      }
      rupture.x1 += rupture.vx * dt;
      rupture.y1 += rupture.vy * dt;
      rupture.x2 += rupture.vx * dt;
      rupture.y2 += rupture.vy * dt;
      rupture.life -= dt;
      const distance = pointSegmentDistance(state.player.x, state.player.y, rupture.x1, rupture.y1, rupture.x2, rupture.y2);
      if (distance <= rupture.width + HITBOX.rupturePadding) {
        state.ruptures.splice(index, 1);
        applyDamage(16, "rupture", state.player.x, state.player.y);
        continue;
      }
      if (
        rupture.life <= 0 ||
        (rupture.x1 < -220 && rupture.x2 < -220) ||
        (rupture.x1 > world.width + 220 && rupture.x2 > world.width + 220) ||
        (rupture.y1 < -220 && rupture.y2 < -220) ||
        (rupture.y1 > world.height + 220 && rupture.y2 > world.height + 220)
      ) {
        state.ruptures.splice(index, 1);
      }
    }
  }

  function updateEffects(dt) {
    state.safeWindow = Math.max(0, state.safeWindow - dt);
    state.boostWindow = Math.max(0, state.boostWindow - dt);
    state.hitFlash = Math.max(0, state.hitFlash - dt);
    state.responseReadyFlash = Math.max(0, state.responseReadyFlash - dt);
    state.responseChoiceTimer = Math.max(0, state.responseChoiceTimer - dt);

    if (state.banner) {
      state.banner.timer -= dt;
      if (state.banner.timer <= 0) {
        state.banner = null;
      }
    }

    for (let index = state.floaters.length - 1; index >= 0; index -= 1) {
      const floater = state.floaters[index];
      floater.life -= dt;
      floater.y += floater.vy * dt;
      if (floater.life <= 0) {
        state.floaters.splice(index, 1);
      }
    }

    for (let index = state.playerTrail.length - 1; index >= 0; index -= 1) {
      const ghost = state.playerTrail[index];
      ghost.life -= dt;
      if (ghost.life <= 0) {
        state.playerTrail.splice(index, 1);
      }
    }

    for (let index = state.pulses.length - 1; index >= 0; index -= 1) {
      const pulse = state.pulses[index];
      pulse.life -= dt;
      const progress = 1 - pulse.life / 0.74;
      pulse.radius = lerp(pulse.radius, pulse.maxRadius, clamp(progress, 0, 1));
      if (pulse.life <= 0) {
        state.pulses.splice(index, 1);
      }
    }

    for (let index = state.sparks.length - 1; index >= 0; index -= 1) {
      const spark = state.sparks[index];
      spark.life -= dt;
      spark.x += spark.vx * dt;
      spark.y += spark.vy * dt;
      spark.vx *= 1 - Math.min(0.08, dt * 1.8);
      spark.vy *= 1 - Math.min(0.08, dt * 1.8);
      if (spark.life <= 0) {
        state.sparks.splice(index, 1);
      }
    }
  }

  function updateBackground(dt) {
    const focusX = ((state.player?.x || world.width * 0.5) - world.width * 0.5) / (world.width * 0.5);
    const focusY = ((state.player?.y || world.height * 0.55) - world.height * 0.56) / world.height;
    state.camera.idle += dt;
    state.camera.shake = Math.max(0, state.camera.shake - dt * 3.6);
    const shakeMagnitude = state.camera.shake * state.camera.shake * 10 * getMotionScale();
    const shockX = Math.sin(state.camera.idle * 52) * shakeMagnitude;
    const shockY = Math.cos(state.camera.idle * 47) * shakeMagnitude * 0.7;
    const targetX = -focusX * 34 + Math.sin(state.camera.idle * 0.43) * 4 + shockX;
    const targetY = -focusY * 30 + Math.cos(state.camera.idle * 0.37) * 3 + shockY;
    const targetZoom = 1 + state.responseReadyFlash * 0.008 + (state.safeWindow > 0 ? 0.012 : 0) + (state.dying ? 0.03 : 0);
    state.camera.x = lerp(state.camera.x, targetX, clamp(dt * 3.2, 0, 1));
    state.camera.y = lerp(state.camera.y, targetY, clamp(dt * 3, 0, 1));
    state.camera.zoom = lerp(state.camera.zoom, targetZoom, clamp(dt * 2.3, 0, 1));

    state.backgroundMotes.forEach((mote) => {
      mote.twinkle += dt * mote.twinkleSpeed;
      mote.y += mote.drift * mote.depth * dt;
      mote.x += mote.driftX * mote.depth * dt;
      if (mote.y > world.height + 8) {
        mote.y = -8;
        mote.x = randomRange(0, world.width);
      }
      if (mote.x < -12) mote.x = world.width + 12;
      if (mote.x > world.width + 12) mote.x = -12;
    });
  }

  function update(dt) {
    state.elapsed += dt;
    const previousPhase = PHASES[state.phaseIndex];
    const nextPhase = getPhaseForElapsed(state.elapsed);
    const nextPhaseIndex = PHASES.findIndex((phase) => phase.id === nextPhase.id);
    if (nextPhaseIndex !== state.phaseIndex) {
      state.phaseIndex = nextPhaseIndex;
      setBanner(nextPhase.title, nextPhase.note);
      playAssayTone("phase");
    }

    state.score += dt * 28 * getModeModifiers().score;
    state.responseCharge = clamp(
      state.responseCharge + dt * 3.9 * getSpecies().responseGainMul * getModeModifiers().response,
      0,
      100
    );
    if (state.responseCharge >= 100 && state.responseReadyFlash <= 0.001) {
      state.responseReadyFlash = 0.48;
    }

    updateSpawnTimers(dt);
    updatePlayer(dt);
    updateFragments(dt);
    updatePhages(dt);
    updateWaves(dt);
    updateRuptures(dt);
    updateEffects(dt);
    updateBackground(dt);

    if (Math.floor(state.elapsed * 10) % 5 === 0 && previousPhase.id !== nextPhase.id) {
      updateHud();
    }
  }

  function updateHud(force = false) {
    const phase = getPhaseForElapsed(state.elapsed);
    const best = getCurrentBest(state.currentBoard);
    if (scoreEl) scoreEl.textContent = String(Math.round(state.score));
    if (timeEl) timeEl.textContent = formatDuration(state.elapsed);
    if (integrityEl) integrityEl.textContent = `${Math.round(state.integrity)}%`;
    if (integrityBarEl) integrityBarEl.style.width = `${clamp(state.integrity, 0, 100)}%`;
    if (repairEl) repairEl.textContent = `${state.repairProgress} / ${state.repairNeeded}`;
    if (repairBarEl) repairBarEl.style.width = `${(clamp(state.repairProgress, 0, state.repairNeeded) / state.repairNeeded) * 100}%`;
    if (responseChargeEl) responseChargeEl.textContent = `${Math.round(state.responseCharge)}%`;
    if (responseBarEl) responseBarEl.style.width = `${clamp(state.responseCharge, 0, 100)}%`;
    if (state.responseCharge >= 100 && !state.responseAnnounced && state.running) {
      state.responseAnnounced = true;
      announce("Stress response ready.");
      playAssayTone("phase");
    } else if (state.responseCharge < 100) {
      state.responseAnnounced = false;
    }
    if (phaseEl) phaseEl.textContent = phase.title;
    if (phaseNoteEl) phaseNoteEl.textContent = phase.note;
    if (traitTitleEl) traitTitleEl.textContent = getSpecies().passiveTitle;
    if (traitCopyEl) traitCopyEl.textContent = getSpecies().passiveCopy;
    if (!state.lastPlacement && rankSummaryEl && force) {
      rankSummaryEl.textContent =
        best > 0
          ? `Best on this board: ${best}. Finish another run to improve your placement.`
          : "Finish a run to see your placement and best score summary.";
    }
    updateControlState();
  }

  function drawBackground() {
    const phase = getPhaseForElapsed(state.elapsed);
    const gradient = ctx.createLinearGradient(0, 0, world.width, world.height);
    gradient.addColorStop(0, "#06101b");
    gradient.addColorStop(0.45, "#0b2034");
    gradient.addColorStop(1, "#040912");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, world.width, world.height);

    const accent = ctx.createRadialGradient(world.width * 0.2, world.height * 0.18, 10, world.width * 0.2, world.height * 0.18, world.width * 0.72);
    accent.addColorStop(0, phase.tintA);
    accent.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = accent;
    ctx.fillRect(0, 0, world.width, world.height);

    const accentB = ctx.createRadialGradient(world.width * 0.82, world.height * 0.8, 10, world.width * 0.82, world.height * 0.8, world.width * 0.62);
    accentB.addColorStop(0, phase.tintB);
    accentB.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = accentB;
    ctx.fillRect(0, 0, world.width, world.height);

    ctx.save();
    const stress = clamp(state.elapsed / 280, 0, 1);
    const drift = state.camera.idle * 0.24;
    const bands = [
      { y: 0.15, thickness: 34, color: "rgba(136, 229, 232, 0.12)", edge: "rgba(198, 247, 248, 0.2)" },
      { y: 0.5, thickness: 22, color: "rgba(101, 194, 205, 0.09)", edge: "rgba(165, 235, 239, 0.16)" },
      { y: 0.84, thickness: 38, color: "rgba(155, 226, 205, 0.12)", edge: "rgba(218, 255, 236, 0.18)" }
    ];
    bands.forEach((band, index) => {
      const y = world.height * band.y + Math.sin(drift + index * 1.8) * 8 + state.camera.y * 0.18;
      const thickness = band.thickness + Math.sin(drift * 0.8 + index) * 4;
      const membrane = ctx.createLinearGradient(0, y - thickness, 0, y + thickness);
      membrane.addColorStop(0, "rgba(255,255,255,0)");
      membrane.addColorStop(0.45, band.color);
      membrane.addColorStop(0.55, band.color);
      membrane.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = membrane;
      ctx.fillRect(0, y - thickness, world.width, thickness * 2);
      ctx.strokeStyle = band.edge;
      ctx.lineWidth = 1.2;
      for (let strand = -1; strand <= 1; strand += 2) {
        ctx.beginPath();
        for (let x = -40; x <= world.width + 40; x += 36) {
          const waveY = y + strand * thickness * 0.42 + Math.sin(x * 0.018 + drift + index) * 5;
          if (x === -40) ctx.moveTo(x, waveY);
          else ctx.lineTo(x, waveY);
        }
        ctx.stroke();
      }
    });

    ctx.lineWidth = 1;
    for (let row = 0; row < 9; row += 1) {
      const y = world.height * 0.24 + row * world.height * 0.065 + Math.sin(drift + row) * 7;
      ctx.strokeStyle = `rgba(167, 236, 220, ${0.055 + stress * 0.04})`;
      ctx.beginPath();
      for (let x = -80; x <= world.width + 80; x += 46) {
        const offset = Math.sin(x * 0.016 + drift * 1.5 + row) * 12;
        if (x === -80) ctx.moveTo(x, y + offset);
        else ctx.lineTo(x, y + offset);
      }
      ctx.stroke();
    }
    for (let column = 0; column < 16; column += 1) {
      const x = column * (world.width / 15) + Math.sin(drift + column) * 12;
      ctx.strokeStyle = `rgba(117, 202, 214, ${0.035 + stress * 0.04})`;
      ctx.beginPath();
      ctx.moveTo(x, world.height * 0.2);
      ctx.bezierCurveTo(
        x + Math.sin(column) * 26,
        world.height * 0.42,
        x - Math.cos(column) * 32,
        world.height * 0.64,
        x + Math.sin(column * 1.7) * 24,
        world.height * 0.82
      );
      ctx.stroke();
    }
    ctx.restore();

    state.backgroundMotes.forEach((mote) => {
      const twinkle = 0.72 + Math.sin(mote.twinkle) * 0.28;
      const x = mote.x + state.camera.x * mote.depth * 0.6;
      const y = mote.y + state.camera.y * mote.depth * 0.9;
      const radius = mote.radius * (0.7 + mote.depth * 0.7);
      ctx.fillStyle = `rgba(178, 235, 245, ${mote.alpha * twinkle * (1 + stress * 0.35)})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, TAU);
      ctx.fill();
      if (mote.depth > 0.72) {
        ctx.strokeStyle = `rgba(168, 255, 210, ${mote.alpha * 0.6})`;
        ctx.beginPath();
        ctx.arc(x, y, radius + 4, 0, TAU);
        ctx.stroke();
      }
    });

    if (state.hitFlash > 0) {
      ctx.fillStyle = `rgba(255, 120, 147, ${state.hitFlash * 0.22})`;
      ctx.fillRect(0, 0, world.width, world.height);
    }
  }

  function drawAtmosphereOverlay() {
    const phase = getPhaseForElapsed(state.elapsed);
    const beamGradient = ctx.createLinearGradient(world.width * 0.5, 0, world.width * 0.5, world.height * 0.72);
    beamGradient.addColorStop(0, "rgba(194, 241, 246, 0.12)");
    beamGradient.addColorStop(0.35, "rgba(194, 241, 246, 0.05)");
    beamGradient.addColorStop(1, "rgba(194, 241, 246, 0)");

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = beamGradient;
    ctx.beginPath();
    ctx.moveTo(world.width * 0.34 + state.camera.x * 0.4, 0);
    ctx.lineTo(world.width * 0.46 + state.camera.x * 0.28, 0);
    ctx.lineTo(world.width * 0.62 + state.camera.x * 0.1, world.height * 0.74);
    ctx.lineTo(world.width * 0.22 + state.camera.x * 0.2, world.height * 0.74);
    ctx.closePath();
    ctx.fill();

    const phaseGlow = ctx.createRadialGradient(
      world.width * 0.78,
      world.height * 0.14,
      20,
      world.width * 0.78,
      world.height * 0.14,
      world.width * 0.34
    );
    phaseGlow.addColorStop(0, phase.tintB.replace(/0\.\d+\)/, "0.22)"));
    phaseGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = phaseGlow;
    ctx.fillRect(0, 0, world.width, world.height);
    ctx.restore();

    const vignette = ctx.createRadialGradient(
      world.width * 0.5,
      world.height * 0.52,
      world.width * 0.2,
      world.width * 0.5,
      world.height * 0.52,
      world.width * 0.82
    );
    vignette.addColorStop(0, "rgba(4, 9, 17, 0)");
    vignette.addColorStop(0.72, "rgba(4, 9, 17, 0.1)");
    vignette.addColorStop(1, "rgba(4, 9, 17, 0.42)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, world.width, world.height);
  }

  function drawFragments() {
    state.fragments.forEach((fragment) => {
      const bob = Math.sin(fragment.pulse) * 4;
      const depth = getDepthScale(fragment.y);
      drawGroundShadow(fragment.x, fragment.y + 16, 24 * depth, 8 * depth, 0.18);
      ctx.save();
      ctx.translate(fragment.x, fragment.y + bob);
      ctx.scale(depth, depth);
      ctx.beginPath();
      ctx.ellipse(0, 10, 18, 6, 0, 0, TAU);
      ctx.fillStyle = fragment.kind.halo;
      ctx.fill();

      ctx.shadowColor = fragment.kind.color;
      ctx.shadowBlur = prefersReducedMotion ? 0 : 14;
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(244, 255, 255, 0.84)";
      ctx.fillStyle = fragment.kind.color;
      if (fragment.kind.id === "lipid-ii") {
        ctx.beginPath();
        ctx.ellipse(0, 0, 10, 15, 0.22, 0, TAU);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(2, -4);
        ctx.lineTo(12, -14);
        ctx.moveTo(4, 1);
        ctx.lineTo(15, -4);
        ctx.stroke();
      } else if (fragment.kind.id === "hydrolase-restraint") {
        roundRect(ctx, -14, -10, 28, 20, 6);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-8, 0);
        ctx.lineTo(8, 0);
        ctx.moveTo(0, -7);
        ctx.lineTo(0, 7);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, 11, 0, TAU);
        ctx.fill();
        ctx.stroke();
        for (let index = 0; index < 6; index += 1) {
          const angle = (index / 6) * TAU;
          ctx.beginPath();
          ctx.moveTo(Math.cos(angle) * 10, Math.sin(angle) * 10);
          ctx.lineTo(Math.cos(angle) * 17, Math.sin(angle) * 17);
          ctx.stroke();
        }
      }
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(3, 18, 28, 0.64)";
      ctx.font = "800 8px Manrope, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(fragment.kind.id === "lipid-ii" ? "LII" : fragment.kind.id === "hydrolase-restraint" ? "HR" : "PG", 0, 3);
      ctx.restore();
    });
  }

  function drawPhages() {
    state.phages.forEach((phage) => {
      const depth = getDepthScale(phage.y);
      if (phage.warning > 0) {
        const alpha = clamp(phage.warning / phage.maxWarning, 0, 1);
        ctx.save();
        ctx.strokeStyle = `rgba(210, 248, 255, ${0.26 + alpha * 0.34})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        ctx.arc(phage.x, phage.y, 38 * depth + (1 - alpha) * 18, 0, TAU);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = `rgba(210, 248, 255, ${0.08 + alpha * 0.12})`;
        ctx.beginPath();
        ctx.arc(phage.x, phage.y, 16 * depth, 0, TAU);
        ctx.fill();
        ctx.restore();
        return;
      }
      drawGroundShadow(phage.x, phage.y + phage.radius + 12, 17 * depth, 7 * depth, 0.22);
      ctx.save();
      ctx.translate(phage.x, phage.y);
      ctx.rotate(phage.spin);
      ctx.scale(depth, depth);
      ctx.strokeStyle = "rgba(209, 244, 255, 0.92)";
      const bodyGradient = ctx.createRadialGradient(-4, -5, 2, 0, 0, phage.radius + 5);
      bodyGradient.addColorStop(0, "rgba(200, 248, 255, 0.98)");
      bodyGradient.addColorStop(0.45, "rgba(106, 208, 236, 0.96)");
      bodyGradient.addColorStop(1, "rgba(53, 129, 166, 0.95)");
      ctx.fillStyle = bodyGradient;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, phage.radius, 0, TAU);
      ctx.fill();
      ctx.stroke();
      for (let index = 0; index < 6; index += 1) {
        const angle = (index / 6) * TAU;
        const inner = phage.radius + 1;
        const outer = phage.radius + 7;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
        ctx.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(0, phage.radius + 2);
      ctx.lineTo(0, phage.radius + 22);
      ctx.moveTo(-8, phage.radius + 14);
      ctx.lineTo(8, phage.radius + 14);
      ctx.moveTo(-10, phage.radius + 24);
      ctx.lineTo(0, phage.radius + 17);
      ctx.lineTo(10, phage.radius + 24);
      ctx.stroke();
      if (phage.nearActive) {
        ctx.strokeStyle = "rgba(255, 226, 160, 0.78)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, phage.radius + 18 + Math.sin(state.camera.idle * 12) * 2, 0, TAU);
        ctx.stroke();
      }
      ctx.restore();
    });
  }

  function drawWaves() {
    state.waves.forEach((wave) => {
      ctx.save();
      const coreAlpha = wave.hue === "#77dfff" ? 0.26 : 0.22;
      const warningAlpha = wave.warning > 0 ? clamp(1 - wave.warning / wave.maxWarning, 0, 1) : 1;
      ctx.fillStyle =
        wave.hue === "#77dfff"
          ? `rgba(119, 223, 255, ${coreAlpha * warningAlpha})`
          : `rgba(145, 243, 255, ${coreAlpha * warningAlpha})`;
      ctx.strokeStyle = wave.hue;
      ctx.lineWidth = wave.warning > 0 ? 1.5 : 2.5;
      if (wave.warning > 0) ctx.setLineDash([12, 10]);
      if (wave.axis === "x") {
        ctx.fillRect(wave.position - wave.thickness * 0.5, 0, wave.thickness, world.height);
        ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
        ctx.fillRect(wave.position - wave.thickness * 0.18, 0, wave.thickness * 0.1, world.height);
        ctx.beginPath();
        ctx.moveTo(wave.position, 0);
        ctx.lineTo(wave.position, world.height);
        ctx.stroke();
      } else {
        ctx.fillRect(0, wave.position - wave.thickness * 0.5, world.width, wave.thickness);
        ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
        ctx.fillRect(0, wave.position - wave.thickness * 0.18, world.width, wave.thickness * 0.1);
        ctx.beginPath();
        ctx.moveTo(0, wave.position);
        ctx.lineTo(world.width, wave.position);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      if (wave.warning <= 0) {
        ctx.globalCompositeOperation = "screen";
        ctx.fillStyle = "rgba(207, 255, 255, 0.08)";
        if (wave.axis === "x") ctx.fillRect(wave.position - 3, 0, 6, world.height);
        else ctx.fillRect(0, wave.position - 3, world.width, 6);
      }
      ctx.restore();
    });
  }

  function drawRuptures() {
    state.ruptures.forEach((rupture) => {
      const depth = getDepthScale((rupture.y1 + rupture.y2) * 0.5);
      ctx.save();
      const warning = rupture.warning > 0;
      const warningProgress = warning ? clamp(1 - rupture.warning / rupture.maxWarning, 0, 1) : 1;
      ctx.strokeStyle = warning ? `rgba(255, 212, 150, ${0.28 + warningProgress * 0.36})` : "rgba(255, 196, 145, 0.95)";
      ctx.shadowColor = "rgba(255, 174, 109, 0.55)";
      ctx.shadowBlur = warning ? 8 * depth : 18 * depth;
      ctx.lineWidth = rupture.width * depth;
      ctx.lineCap = "round";
      ctx.setLineDash(warning ? [6, 12] : [12, 10]);
      ctx.beginPath();
      ctx.moveTo(rupture.x1, rupture.y1);
      ctx.lineTo(rupture.x2, rupture.y2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = "rgba(255, 239, 214, 0.9)";
      ctx.lineWidth = warning ? 1 : 2;
      ctx.beginPath();
      ctx.moveTo(rupture.x1, rupture.y1);
      ctx.lineTo(rupture.x2, rupture.y2);
      ctx.stroke();
      if (!warning) {
        ctx.strokeStyle = "rgba(255, 123, 88, 0.42)";
        ctx.lineWidth = 1.2;
        for (let index = 1; index < 5; index += 1) {
          const t = index / 5;
          const x = lerp(rupture.x1, rupture.x2, t);
          const y = lerp(rupture.y1, rupture.y2, t);
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + Math.sin(index * 2.4) * 24, y + Math.cos(index * 1.7) * 18);
          ctx.stroke();
        }
      }
      ctx.restore();
    });
  }

  function drawPulses() {
    state.pulses.forEach((pulse) => {
      ctx.save();
      ctx.strokeStyle = pulse.color;
      ctx.lineWidth = pulse.lineWidth;
      ctx.globalAlpha = clamp(pulse.life / 0.74, 0, 1);
      ctx.shadowColor = pulse.color;
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(pulse.x, pulse.y, pulse.radius, 0, TAU);
      ctx.stroke();
      ctx.globalAlpha *= 0.45;
      ctx.lineWidth *= 0.45;
      ctx.beginPath();
      ctx.arc(pulse.x, pulse.y, pulse.radius * 0.72, 0, TAU);
      ctx.stroke();
      ctx.restore();
    });
  }

  function drawSparks() {
    state.sparks.forEach((spark) => {
      const alpha = clamp(spark.life / spark.maxLife, 0, 1);
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = alpha;
      ctx.fillStyle = spark.color;
      ctx.shadowColor = spark.color;
      ctx.shadowBlur = prefersReducedMotion ? 0 : 10;
      ctx.beginPath();
      ctx.arc(spark.x, spark.y, spark.radius, 0, TAU);
      ctx.fill();
      ctx.restore();
    });
  }

  function drawPlayerTrail() {
    state.playerTrail.forEach((ghost, index) => {
      const species = getSpecies(ghost.speciesId);
      const depth = getDepthScale(ghost.y) * lerp(0.92, 0.68, index / Math.max(1, state.playerTrail.length));
      const alpha = clamp(ghost.life / 0.42, 0, 1) * 0.2 * ghost.strength;
      drawGroundShadow(ghost.x, ghost.y + 16, 20 * depth, 8 * depth, alpha * 0.9);
      ctx.save();
      ctx.translate(ghost.x, ghost.y);
      ctx.rotate(ghost.angle);
      ctx.scale(depth, depth);
      ctx.globalAlpha = alpha;
      ctx.filter = prefersReducedMotion ? "none" : "blur(1.6px)";
      drawCellGlyph(species, 0);
      ctx.restore();
    });
  }

  function drawCellGlyph(species, crackPhase = 0) {
    const gradient = ctx.createLinearGradient(-24, -8, 24, 8);
    gradient.addColorStop(0, species.palette.bodyA);
    gradient.addColorStop(1, species.palette.bodyB);
    ctx.fillStyle = gradient;
    ctx.strokeStyle = species.palette.outline;
    ctx.lineWidth = 2.5;

    if (species.shape === "encapsulated-rod" || species.shape === "diplococcus") {
      ctx.save();
      ctx.globalAlpha = 0.34;
      ctx.strokeStyle = species.palette.pulse;
      ctx.lineWidth = 5;
      if (species.shape === "diplococcus") {
        ctx.beginPath();
        ctx.ellipse(-10, 0, 21, 18, 0, 0, TAU);
        ctx.ellipse(10, 0, 21, 18, 0, 0, TAU);
        ctx.stroke();
      } else {
        roundRect(ctx, -34, -20, 68, 40, 19);
        ctx.stroke();
      }
      ctx.restore();
    }

    if (species.shape === "coccus") {
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, TAU);
      ctx.fill();
      ctx.stroke();
    } else if (species.shape === "diplococcus") {
      ctx.beginPath();
      ctx.arc(-10, 0, 14, 0, TAU);
      ctx.arc(10, 0, 14, 0, TAU);
      ctx.fill();
      ctx.stroke();
    } else {
      const radius = species.shape === "coccobacillus" ? 12 : 14;
      const halfLength =
        species.shape === "encapsulated-rod" ? 26 : species.shape === "curved-rod" ? 25 : species.shape === "coryneform" ? 24 : 23;
      ctx.beginPath();
      ctx.moveTo(-halfLength + radius, -radius);
      ctx.lineTo(halfLength - radius, -radius);
      ctx.quadraticCurveTo(halfLength, -radius, halfLength, 0);
      ctx.quadraticCurveTo(halfLength, radius, halfLength - radius, radius);
      ctx.lineTo(-halfLength + radius, radius);
      ctx.quadraticCurveTo(-halfLength, radius, -halfLength, 0);
      ctx.quadraticCurveTo(-halfLength, -radius, -halfLength + radius, -radius);
      if (species.shape === "curved-rod") {
        ctx.transform(1, -0.08, 0.08, 1, 0, 0);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      if (species.shape === "coryneform") {
        ctx.beginPath();
        ctx.moveTo(-6, -12);
        ctx.lineTo(6, 12);
        ctx.stroke();
      }
    }

    ctx.save();
    ctx.globalAlpha = 0.42;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.78)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(0, -13);
    ctx.lineTo(0, 13);
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = species.palette.core;
    ctx.beginPath();
    ctx.ellipse(0, 0, 10, 7, 0, 0, TAU);
    ctx.fill();

    ctx.strokeStyle = "rgba(4, 19, 31, 0.34)";
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(-7, -1);
    ctx.bezierCurveTo(-2, -8, 4, 7, 9, 0);
    ctx.stroke();

    ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
    ctx.beginPath();
    ctx.ellipse(-6, -6, 6, 3, -0.4, 0, TAU);
    ctx.fill();

    if (crackPhase > 0.02) {
      ctx.save();
      ctx.globalAlpha = clamp(crackPhase * 0.92, 0, 0.92);
      ctx.strokeStyle = "rgba(248, 252, 255, 0.96)";
      ctx.lineWidth = 1.7;
      ctx.beginPath();
      ctx.moveTo(-12, -11);
      ctx.lineTo(-3, -2);
      ctx.lineTo(-7, 8);
      ctx.moveTo(6, -9);
      ctx.lineTo(0, 1);
      ctx.lineTo(9, 11);
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawLysisSequence() {
    const animation = state.deathAnimation;
    if (!animation) return;
    const species = getSpecies(animation.speciesId);
    const progress = clamp(animation.elapsed / animation.duration, 0, 1);
    const swell = clamp(progress / 0.22, 0, 1);
    const rupture = clamp((progress - 0.16) / 0.2, 0, 1);
    const debris = clamp((progress - 0.22) / 0.78, 0, 1);

    ctx.save();
    ctx.translate(animation.x, animation.y);
    ctx.rotate(animation.angle);

    const haloRadius = 30 + swell * 18 + rupture * 20;
    const halo = ctx.createRadialGradient(0, 0, 8, 0, 0, haloRadius);
    halo.addColorStop(0, `rgba(255, 243, 212, ${0.22 + swell * 0.18})`);
    halo.addColorStop(0.55, `rgba(255, 184, 130, ${0.14 + rupture * 0.18})`);
    halo.addColorStop(1, "rgba(255, 184, 130, 0)");
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(0, 0, haloRadius, 0, TAU);
    ctx.fill();

    ctx.globalAlpha = clamp(1 - debris * 0.9, 0, 1);
    const scale = 1 + swell * 0.16 - rupture * 0.04;
    ctx.scale(scale, scale);
    drawCellGlyph(species, rupture);
    ctx.restore();

    if (rupture > 0.04) {
      ctx.save();
      ctx.strokeStyle = `rgba(255, 214, 171, ${0.6 - progress * 0.25})`;
      ctx.lineWidth = 7 - progress * 2.5;
      ctx.globalAlpha = clamp(0.78 - progress * 0.5, 0, 1);
      ctx.beginPath();
      ctx.arc(animation.x, animation.y, 24 + rupture * 92, 0, TAU);
      ctx.stroke();
      ctx.restore();
    }

    animation.shards.forEach((shard) => {
      const shardProgress = clamp((animation.elapsed - shard.delay) / (animation.duration - shard.delay), 0, 1);
      if (shardProgress <= 0) return;
      const distance = shard.speed * shardProgress * (0.68 + 0.32 * shardProgress);
      const x = animation.x + Math.cos(shard.angle) * distance;
      const y = animation.y + Math.sin(shard.angle) * distance + shard.lift * shardProgress * 0.18;
      const alpha = clamp(1 - shardProgress * 1.08, 0, 1) * (prefersReducedMotion ? 0.72 : 1);
      const scale = 1 - shardProgress * 0.5;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(shard.angle + shard.spin * shardProgress);
      ctx.scale(scale, scale);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = shard.color;
      ctx.shadowColor = shard.color;
      ctx.shadowBlur = prefersReducedMotion ? 0 : 16;
      if (shard.kind === "droplet") {
        ctx.beginPath();
        ctx.ellipse(0, 0, shard.sizeX * 0.45, shard.sizeY * 0.7, 0, 0, TAU);
        ctx.fill();
      } else {
        roundRect(ctx, -shard.sizeX * 0.5, -shard.sizeY * 0.5, shard.sizeX, shard.sizeY, shard.sizeY * 0.45);
        ctx.fill();
      }
      ctx.restore();
    });
  }

  function drawPlayer() {
    if (state.dying && state.deathAnimation) {
      drawLysisSequence();
      return;
    }
    const species = getSpecies();
    const { x, y, angle } = state.player;
    const depth = getDepthScale(y);
    drawGroundShadow(x, y + 18, 26 * depth, 10 * depth, state.safeWindow > 0 ? 0.16 : 0.26);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(depth, depth);
    if (state.safeWindow > 0 || state.boostWindow > 0) {
      ctx.fillStyle = state.boostWindow > 0 ? "rgba(255, 226, 147, 0.18)" : `rgba(179, 245, 255, ${0.12 + state.safeWindow * 0.16})`;
      ctx.beginPath();
      ctx.ellipse(0, 4, state.boostWindow > 0 ? 42 : 34, state.boostWindow > 0 ? 28 : 24, 0, 0, TAU);
      ctx.fill();
    }

    drawCellGlyph(species, 0);
    ctx.restore();
  }

  function drawAttractScene() {
    if (state.running || state.dying || state.overlayMode !== "start") return;
    const species = getSpecies(state.selectedSpeciesId);
    const centerX = world.width * 0.67;
    const centerY = world.height * 0.55;
    ctx.save();
    ctx.globalAlpha = 0.72;
    drawGroundShadow(centerX, centerY + 22, 44, 14, 0.22);
    ctx.translate(centerX, centerY);
    ctx.rotate(-0.18 + Math.sin(state.camera.idle * 0.8) * 0.04);
    ctx.scale(1.45, 1.45);
    drawCellGlyph(species, 0);
    ctx.restore();

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.strokeStyle = "rgba(255, 211, 143, 0.34)";
    ctx.lineWidth = 10;
    ctx.setLineDash([18, 18]);
    ctx.beginPath();
    ctx.moveTo(world.width * 0.12, world.height * 0.72);
    ctx.lineTo(world.width * 0.88, world.height * 0.28);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = "rgba(144, 236, 255, 0.42)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX - 190, centerY - 130, 34 + Math.sin(state.camera.idle * 2) * 4, 0, TAU);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(centerX + 210, centerY + 80, 46 + Math.cos(state.camera.idle * 2.4) * 5, 0, TAU);
    ctx.stroke();
    ctx.restore();
  }

  function drawBanner() {
    if (!state.banner) return;
    const width = 420;
    const height = 78;
    const x = (world.width - width) * 0.5;
    const y = 28;
    ctx.save();
    ctx.fillStyle = "rgba(7, 19, 31, 0.78)";
    ctx.strokeStyle = "rgba(170, 235, 243, 0.3)";
    ctx.lineWidth = 1.5;
    roundRect(ctx, x, y, width, height, 18);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#f2fbff";
    ctx.font = "700 24px Manrope";
    ctx.fillText(state.banner.title, x + 20, y + 30);
    ctx.fillStyle = "rgba(219, 240, 248, 0.92)";
    ctx.font = "500 15px Manrope";
    ctx.fillText(state.banner.copy, x + 20, y + 54);
    ctx.restore();
  }

  function drawFloaters() {
    state.floaters.forEach((floater) => {
      ctx.save();
      ctx.globalAlpha = clamp(floater.life, 0, 1);
      ctx.fillStyle = floater.color;
      ctx.font = "700 15px Manrope";
      ctx.textAlign = "center";
      ctx.fillText(floater.text, floater.x, floater.y);
      ctx.restore();
    });
  }

  function roundRect(context, x, y, width, height, radius) {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius);
    context.lineTo(x + width, y + height - radius);
    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    context.lineTo(x + radius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.closePath();
  }

  function render() {
    ctx.setTransform(world.dpr, 0, 0, world.dpr, 0, 0);
    ctx.clearRect(0, 0, world.width, world.height);
    drawBackground();
    drawAtmosphereOverlay();
    ctx.save();
    applyWorldTransform();
    drawWaves();
    drawRuptures();
    drawFragments();
    drawPhages();
    drawPulses();
    drawSparks();
    drawPlayerTrail();
    if (state.running || state.dying || state.overlayMode !== "start") {
      drawPlayer();
    }
    drawAttractScene();
    drawFloaters();
    ctx.restore();
    drawBanner();
  }

  function getLeaderboardDescriptor() {
    const totalEntries = Math.max(state.leaderboard.length, Number(state.leaderboardStats.totalEntries) || 0);
    if (state.leaderboardMode === "global") {
      return {
        className: "is-global",
        pill: state.currentMode === "daily" ? "Shared daily board" : "Shared classic board",
        meta: `${totalEntries} recorded ${totalEntries === 1 ? "run" : "runs"}`,
        summaryPrefix: "Shared board"
      };
    }
    if (state.leaderboardMode === "fallback") {
      const isDailyFallback = state.currentMode === "daily" && !state.dailyBoardReady;
      return {
        className: "is-fallback",
        pill: isDailyFallback ? "Daily board local" : "Local fallback",
        meta: isDailyFallback
          ? "Daily challenge is saving on this device until the worker is updated."
          : `${totalEntries} local ${totalEntries === 1 ? "run" : "runs"} on this device`,
        summaryPrefix: isDailyFallback ? "Local daily board" : "Local fallback"
      };
    }
    return {
      className: "",
      pill: "Local board",
      meta: `${totalEntries} local ${totalEntries === 1 ? "run" : "runs"} on this device`,
      summaryPrefix: "Local board"
    };
  }

  function renderLeaderboard() {
    if (!leaderboardListEl || !leaderboardMetaEl || !networkPillEl) return;
    leaderboardListEl.innerHTML = "";
    const descriptor = getLeaderboardDescriptor();
    networkPillEl.textContent = descriptor.pill;
    networkPillEl.classList.remove("is-global", "is-fallback");
    leaderboardMetaEl.classList.remove("is-global", "is-fallback");
    if (descriptor.className) {
      networkPillEl.classList.add(descriptor.className);
      leaderboardMetaEl.classList.add(descriptor.className);
    }
    leaderboardMetaEl.textContent = descriptor.meta;
    if (state.leaderboard.length === 0) {
      const empty = document.createElement("li");
      empty.className = "is-empty";
      empty.textContent = "No scores recorded yet on this board.";
      leaderboardListEl.append(empty);
    } else {
      state.leaderboard.forEach((entry, index) => {
        const li = document.createElement("li");
        if (state.lastPlacement && entry.playedAt === state.lastPlacement.playedAt && entry.score === state.lastPlacement.score) {
          li.classList.add("is-player-entry");
        }
        const rank = document.createElement("span");
        rank.textContent = `#${index + 1}`;
        const main = document.createElement("div");
        main.className = "envelope-leaderboard-main";
        const label = document.createElement("strong");
        label.textContent = entry.name;
        const meta = document.createElement("span");
        meta.className = "envelope-leaderboard-meta-line";
        meta.textContent = `${entry.score.toLocaleString()} pts · ${getSpecies(entry.species).label}`;
        main.append(label, meta);
        li.append(rank, main);
        leaderboardListEl.append(li);
      });
    }
  }

  function findPlacement(entries, entry) {
    const index = (entries || []).findIndex(
      (candidate) =>
        candidate.name === entry.name &&
        candidate.score === entry.score &&
        candidate.playedAt === entry.playedAt &&
        candidate.board === entry.board
    );
    return index >= 0 ? index + 1 : computeLocalRank(entries, entry);
  }

  async function fetchLeaderboardPayload(board) {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const response = await window.fetch(`${GLOBAL_LEADERBOARD_URL}?board=${encodeURIComponent(board)}`, {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: controller.signal
      });
      if (!response.ok) throw new Error(`Leaderboard request failed with ${response.status}`);
      return await response.json();
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  async function postLeaderboardPayload(entry) {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const response = await window.fetch(GLOBAL_LEADERBOARD_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(entry),
        signal: controller.signal
      });
      if (!response.ok) throw new Error(`Leaderboard submit failed with ${response.status}`);
      return await response.json();
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  function acceptRemoteBoard(board, payloadBoard) {
    const normalizedPayloadBoard = payloadBoard ? normalizeBoard(payloadBoard) : "";
    if (normalizedPayloadBoard === board) return true;
    return board === "classic" && !normalizedPayloadBoard;
  }

  async function refreshLeaderboard(board) {
    const normalizedBoard = normalizeBoard(board);
    const requestId = state.leaderboardRequestId + 1;
    state.leaderboardRequestId = requestId;
    state.leaderboard = readLocalLeaderboard(normalizedBoard);
    state.leaderboardStats = { totalEntries: state.leaderboard.length, updatedAt: Date.now(), board: normalizedBoard };
    state.leaderboardMode = GLOBAL_LEADERBOARD_URL ? "fallback" : "local";
    renderLeaderboard();

    if (!GLOBAL_LEADERBOARD_URL) {
      return;
    }

    try {
      const payload = await fetchLeaderboardPayload(normalizedBoard);
      if (requestId !== state.leaderboardRequestId || normalizedBoard !== state.currentBoard) {
        return;
      }
      if (!acceptRemoteBoard(normalizedBoard, payload?.board)) {
        if (normalizedBoard !== "classic") state.dailyBoardReady = false;
        state.leaderboardMode = "fallback";
        renderLeaderboard();
        return;
      }

      if (normalizedBoard !== "classic") {
        state.dailyBoardReady = true;
      }

      state.leaderboard = normalizeLeaderboardEntries(payload?.entries, normalizedBoard);
      state.leaderboardStats = {
        totalEntries: Math.max(state.leaderboard.length, Math.floor(Number(payload?.totalEntries) || 0)),
        updatedAt: Math.floor(Number(payload?.updatedAt) || Date.now()),
        board: normalizedBoard
      };
      state.leaderboardMode = "global";
      writeLocalLeaderboard(normalizedBoard, state.leaderboard);
      renderLeaderboard();
    } catch {
      if (requestId !== state.leaderboardRequestId || normalizedBoard !== state.currentBoard) {
        return;
      }
      state.leaderboardMode = "fallback";
      renderLeaderboard();
    }
  }

  async function submitScore() {
    const entry = {
      name: getPlayerName(),
      score: Math.round(state.score),
      species: state.speciesId,
      playedAt: Date.now(),
      board: state.currentBoard
    };

    const best = Math.max(getCurrentBest(state.currentBoard), entry.score);
    setCurrentBest(state.currentBoard, entry.score);

    if (!GLOBAL_LEADERBOARD_URL) {
      state.leaderboard = normalizeLeaderboardEntries([entry, ...readLocalLeaderboard(state.currentBoard)], state.currentBoard);
      state.leaderboardMode = "local";
      writeLocalLeaderboard(state.currentBoard, state.leaderboard);
      const rank = findPlacement(state.leaderboard, entry);
      state.lastPlacement = {
        score: entry.score,
        playedAt: entry.playedAt,
        summary: `Saved on the local board at ${formatRank(rank)} place. Best on this board: ${best}.`
      };
      rankSummaryEl.textContent = state.lastPlacement.summary;
      renderLeaderboard();
      return;
    }

    try {
      const payload = await postLeaderboardPayload(entry);
      if (!acceptRemoteBoard(state.currentBoard, payload?.board)) {
        throw new Error("Remote board mismatch");
      }
      if (state.currentMode === "daily") state.dailyBoardReady = true;
      state.leaderboard = normalizeLeaderboardEntries(payload?.entries, state.currentBoard);
      state.leaderboardStats = {
        totalEntries: Math.max(state.leaderboard.length, Math.floor(Number(payload?.totalEntries) || 0)),
        updatedAt: Math.floor(Number(payload?.updatedAt) || Date.now()),
        board: state.currentBoard
      };
      state.leaderboardMode = "global";
      writeLocalLeaderboard(state.currentBoard, state.leaderboard);
      const rank = Math.max(1, Math.floor(Number(payload?.rank) || computeLocalRank(state.leaderboard, entry)));
      state.lastPlacement = {
        score: entry.score,
        playedAt: entry.playedAt,
        summary: `${state.currentBoardLabel} saved at ${formatRank(rank)} place on the shared board. Best on this board: ${best}.`
      };
      rankSummaryEl.textContent = state.lastPlacement.summary;
      renderLeaderboard();
    } catch {
      state.leaderboard = normalizeLeaderboardEntries([entry, ...readLocalLeaderboard(state.currentBoard)], state.currentBoard);
      state.leaderboardMode = "fallback";
      writeLocalLeaderboard(state.currentBoard, state.leaderboard);
      const rank = findPlacement(state.leaderboard, entry);
      state.lastPlacement = {
        score: entry.score,
        playedAt: entry.playedAt,
        summary:
          state.currentMode === "daily" && !state.dailyBoardReady
            ? `Saved on this device at ${formatRank(rank)} place. Redeploy the worker to share daily scores globally.`
            : `Saved on the local fallback board at ${formatRank(rank)} place. Best on this board: ${best}.`
      };
      rankSummaryEl.textContent = state.lastPlacement.summary;
      renderLeaderboard();
    }
  }

  function endRun() {
    if (!state.running) return;
    state.running = false;
    state.dying = true;
    state.paused = false;
    state.banner = null;
    resetInputState();
    addCameraImpulse(1.4);
    state.deathAnimation = createLysisAnimation();
    playAssayTone("lysis");
    updateControlState();
  }

  function handlePrimaryAction() {
    if (state.overlayMode === "paused") {
      resumeRun();
      return;
    }
    if (state.overlayMode === "ended") {
      resetRun(state.currentMode);
      return;
    }
    resetRun("classic");
  }

  function handleSecondaryAction() {
    if (state.overlayMode === "paused") {
      resetRun(state.currentMode);
      return;
    }
    if (state.overlayMode === "ended") {
      resetRun(state.currentMode === "daily" ? "classic" : "daily");
      return;
    }
    resetRun("daily");
  }

  function openModal() {
    if (modal.open) return;
    refreshDailyChallenge();
    if (state.dying) {
      state.dying = false;
      state.deathAnimation = null;
    }
    if (!state.running) {
      state.currentMode = "classic";
      state.currentBoard = "classic";
      state.currentBoardLabel = "Classic board";
      state.speciesId = state.selectedSpeciesId;
      setScoresOpen(false);
    }
    updateDailyNote();
    updateSpeciesInfo();
    if (playerNameInput) {
      playerNameInput.value = state.playerName;
      updatePlayerNameFeedback();
    }
    if (state.running || state.paused) {
      showOverlay("paused");
    } else {
      showOverlay("start");
    }
    state.open = true;
    modal.showModal();
    refreshLeaderboard(state.currentBoard);
    window.requestAnimationFrame(() => {
      syncPlayfieldSize({ preserveState: state.running || state.paused || state.dying });
      render();
      if (!rafId) {
        rafId = window.requestAnimationFrame(loop);
      }
    });
  }

  function closeModal() {
    if (state.running) {
      pauseRun();
    }
    if (state.dying) {
      state.dying = false;
      state.deathAnimation = null;
    }
    state.open = false;
    resetInputState();
    modal.close();
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }

  function loop(now) {
    if (!state.open) {
      rafId = 0;
      return;
    }
    const dt = state.lastFrame ? Math.min(0.033, (now - state.lastFrame) / 1000) : 0.016;
    state.lastFrame = now;
    if (state.running && !state.paused) {
      update(dt);
      updateHud();
    } else if (state.dying) {
      updateBackground(dt);
      updateLysisAnimation(dt);
    }
    render();
    rafId = window.requestAnimationFrame(loop);
  }

  function onKeyChange(event, isPressed) {
    if (isTypingTarget(event.target)) return;
    const key = event.key.toLowerCase();
    if (key === "arrowup" || key === "w") state.input.up = isPressed;
    if (key === "arrowdown" || key === "s") state.input.down = isPressed;
    if (key === "arrowleft" || key === "a") state.input.left = isPressed;
    if (key === "arrowright" || key === "d") state.input.right = isPressed;
    if (!isPressed && key !== " " && key !== "p" && key !== "escape") return;

    if (isPressed && key === " ") {
      event.preventDefault();
      triggerStressResponse();
    }

    if (isPressed && (key === "p" || key === "escape")) {
      event.preventDefault();
      if (state.running && !state.paused) pauseRun();
      else if (state.running && state.paused) resumeRun();
    }
  }

  trigger.addEventListener("click", openModal);
  closeButton.addEventListener("click", closeModal);
  startButton.addEventListener("click", handlePrimaryAction);
  dailyStartButton.addEventListener("click", handleSecondaryAction);
  pauseButton.addEventListener("click", () => {
    if (!state.running) return;
    if (state.paused) resumeRun();
    else pauseRun();
  });
  restartButton.addEventListener("click", () => {
    const mode = state.running || state.overlayMode === "ended" ? state.currentMode : "classic";
    resetRun(mode);
  });
  responseButton.addEventListener("click", triggerStressResponse);
  scoresToggleButton.addEventListener("click", () => {
    setScoresOpen(!state.scoresOpen);
  });
  modal.addEventListener("close", () => {
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }
    state.open = false;
    resetInputState();
  });
  modelSelect.addEventListener("change", () => {
    state.selectedSpeciesId = normalizeSpeciesId(modelSelect.value);
    writeStorageText(MODEL_KEY, state.selectedSpeciesId);
    if (!state.running || state.paused) {
      state.speciesId = state.selectedSpeciesId;
    }
    updateSpeciesInfo();
  });
  if (playerNameInput) {
    playerNameInput.addEventListener("input", () => {
      state.playerName = normalizeName(playerNameInput.value);
      writeStorageText(NAME_KEY, playerNameInput.value);
      updatePlayerNameFeedback();
    });
  }
  if (audioToggleButton) {
    audioToggleButton.addEventListener("click", () => {
      state.audioEnabled = !state.audioEnabled;
      writeStorageText(SOUND_KEY, state.audioEnabled ? "on" : "off");
      updateAudioControl();
      if (state.audioEnabled) playAssayTone("pickup");
    });
  }
  if (motionSelect) {
    motionSelect.addEventListener("change", () => {
      state.motionMode = normalizeMotionMode(motionSelect.value);
      writeStorageText(MOTION_KEY, state.motionMode);
      updateMotionControl();
    });
  }

  canvas.addEventListener("pointerdown", (event) => {
    const point = pointToCanvas(event);
    state.pointer.active = true;
    state.pointer.x = point.x;
    state.pointer.y = point.y;
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointermove", (event) => {
    if (!state.pointer.active && event.pointerType !== "touch" && event.buttons === 0) return;
    const point = pointToCanvas(event);
    state.pointer.active = true;
    state.pointer.x = point.x;
    state.pointer.y = point.y;
  });
  canvas.addEventListener("pointerup", () => {
    state.pointer.active = false;
  });
  canvas.addEventListener("pointercancel", () => {
    state.pointer.active = false;
  });
  canvas.addEventListener("pointerleave", (event) => {
    if (event.pointerType !== "mouse") {
      state.pointer.active = false;
    }
  });

  window.addEventListener("keydown", (event) => onKeyChange(event, true));
  window.addEventListener("keyup", (event) => onKeyChange(event, false));
  let resizeFrame = 0;
  window.addEventListener("resize", () => {
    if (!state.open) return;
    if (resizeFrame) {
      window.cancelAnimationFrame(resizeFrame);
    }
    resizeFrame = window.requestAnimationFrame(() => {
      resizeFrame = 0;
      if (syncPlayfieldSize({ preserveState: state.running || state.paused || state.dying })) {
        render();
      }
    });
  });

  updateDailyNote();
  updateSpeciesInfo();
  updateAudioControl();
  updateMotionControl();
  if (playerNameInput) {
    playerNameInput.value = state.playerName;
    updatePlayerNameFeedback();
  }
  syncPlayfieldSize({ preserveState: false });
  updateHud(true);
  setScoresOpen(false);
  renderLeaderboard();
  render();
})();
