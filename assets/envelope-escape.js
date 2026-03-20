(() => {
  const trigger = document.getElementById("envelope-trigger");
  const modal = document.getElementById("envelope-modal");
  const closeButton = document.getElementById("envelope-close");
  const startButton = document.getElementById("envelope-start");
  const dailyStartButton = document.getElementById("envelope-daily-start");
  const pauseButton = document.getElementById("envelope-pause");
  const restartButton = document.getElementById("envelope-restart");
  const responseButton = document.getElementById("envelope-response");
  const canvas = document.getElementById("envelope-canvas");
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

  if (
    !trigger ||
    !modal ||
    !closeButton ||
    !startButton ||
    !dailyStartButton ||
    !pauseButton ||
    !restartButton ||
    !responseButton ||
    !canvas ||
    !overlay
  ) {
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const STORAGE_VERSION = "v2";
  const BEST_KEY = `bernhardt-envelope-escape-best-${STORAGE_VERSION}`;
  const BOARD_PREFIX = `bernhardt-envelope-escape-board-${STORAGE_VERSION}-`;
  const MODEL_KEY = `bernhardt-envelope-escape-model-${STORAGE_VERSION}`;
  const NAME_KEY = `bernhardt-envelope-escape-name-${STORAGE_VERSION}`;
  const LEADERBOARD_SIZE = 25;
  const GLOBAL_LEADERBOARD_URL = String(window.ENVELOPE_LEADERBOARD_URL || "").trim();
  const REQUEST_TIMEOUT_MS = 9000;
  const LAB_TIMEZONE = "America/New_York";
  const TAU = Math.PI * 2;
  const BOARD_PATTERN = /^(classic|daily-\d{4}-\d{2}-\d{2})$/;
  const prefersReducedMotion =
    typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const SPECIES = {
    ecoli: {
      label: "Escherichia coli",
      passiveTitle: "Balanced repair",
      passiveCopy: "Repair fragments build the stress response a little faster.",
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
      passiveTitle: "Capsule rebound",
      passiveCopy: "Completed repairs grant a longer, stronger stabilization burst.",
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
      passiveTitle: "Capsule dragnet",
      passiveCopy: "Repair fragments begin drifting toward the cell a little earlier.",
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
      passiveCopy: "The stress response meter charges faster from survival and pickups.",
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
      title: "Onset stress",
      note: "Sparse hazards. Build rhythm and collect repair fragments.",
      rates: { fragment: 1.12, phage: 0.68, wave: 0.52, rupture: 0.45 },
      tintA: "rgba(21, 93, 112, 0.22)",
      tintB: "rgba(28, 128, 149, 0.1)"
    },
    {
      id: "antibiotic",
      start: 60,
      title: "Antibiotic sweep",
      note: "Broad drug fronts arrive more often and cut off easy routes.",
      rates: { fragment: 1.02, phage: 0.9, wave: 0.92, rupture: 0.62 },
      tintA: "rgba(24, 116, 129, 0.28)",
      tintB: "rgba(52, 156, 176, 0.13)"
    },
    {
      id: "mixed",
      start: 150,
      title: "Mixed assault",
      note: "Phages, waves, and rupture fronts begin to overlap more aggressively.",
      rates: { fragment: 0.97, phage: 1.16, wave: 1.08, rupture: 0.92 },
      tintA: "rgba(53, 132, 160, 0.28)",
      tintB: "rgba(120, 183, 211, 0.14)"
    },
    {
      id: "critical",
      start: 240,
      title: "Critical rupture",
      note: "The envelope is failing fast. Repair cycles buy only brief breathing room.",
      rates: { fragment: 0.93, phage: 1.36, wave: 1.22, rupture: 1.18 },
      tintA: "rgba(91, 142, 172, 0.3)",
      tintB: "rgba(177, 214, 235, 0.18)"
    }
  ];

  const DAILY_PROFILES = [
    {
      id: "phage-bloom",
      name: "Phage Bloom",
      subtitle: "More phages, faster stress-response gain.",
      modifiers: { phage: 1.35, wave: 0.92, rupture: 0.95, fragment: 1.08, response: 1.2, score: 1.08, repairNeeded: 4 }
    },
    {
      id: "beta-lactam-surge",
      name: "Beta-Lactam Surge",
      subtitle: "Denser antibiotic waves with slightly richer fragment spawns.",
      modifiers: { phage: 0.98, wave: 1.34, rupture: 0.94, fragment: 1.14, response: 1, score: 1.1, repairNeeded: 4 }
    },
    {
      id: "Rupture Field",
      name: "Rupture Field",
      subtitle: "More shear fronts. Positioning matters more than raw speed.",
      modifiers: { phage: 0.95, wave: 1.02, rupture: 1.42, fragment: 1.06, response: 1, score: 1.12, repairNeeded: 4 }
    },
    {
      id: "repair-rationing",
      name: "Repair Rationing",
      subtitle: "Repair fragments are rarer, but each completed cycle pays out more.",
      modifiers: { phage: 1.08, wave: 1.06, rupture: 1.08, fragment: 0.84, response: 1.08, score: 1.18, repairNeeded: 5 }
    }
  ];

  const FRAGMENT_TYPES = [
    { id: "mesh", label: "PG mesh", color: "#a8ffd2", halo: "rgba(168, 255, 210, 0.34)" },
    { id: "sealant", label: "Membrane sealant", color: "#9fe7ff", halo: "rgba(159, 231, 255, 0.34)" },
    { id: "chaperone", label: "Stress chaperone", color: "#ffdca0", halo: "rgba(255, 220, 160, 0.34)" }
  ];

  const state = createState();
  let rafId = 0;

  function createState() {
    const selectedSpeciesId = normalizeSpeciesId(readStorageText(MODEL_KEY)) || "ecoli";
    return {
      open: false,
      running: false,
      paused: false,
      overlayMode: "start",
      lastFrame: 0,
      selectedSpeciesId,
      speciesId: selectedSpeciesId,
      dailyChallenge: buildDailyChallenge(),
      currentMode: "classic",
      currentBoard: "classic",
      currentBoardLabel: "Classic board",
      playerName: readStorageText(NAME_KEY),
      bestByBoard: readStorageJson(BEST_KEY, {}),
      leaderboard: [],
      leaderboardMode: GLOBAL_LEADERBOARD_URL ? "fallback" : "local",
      leaderboardStats: { totalEntries: 0, updatedAt: 0, board: "classic" },
      leaderboardMessage: "",
      dailyBoardReady: false,
      lastPlacement: null,
      elapsed: 0,
      score: 0,
      integrity: 100,
      repairProgress: 0,
      repairNeeded: 4,
      responseCharge: 0,
      responseReadyFlash: 0,
      safeWindow: 0,
      phaseIndex: 0,
      hitFlash: 0,
      banner: null,
      input: { up: false, down: false, left: false, right: false },
      pointer: { active: false, x: canvas.width * 0.5, y: canvas.height * 0.5 },
      fragments: [],
      phages: [],
      waves: [],
      ruptures: [],
      pulses: [],
      floaters: [],
      backgroundMotes: seedBackgroundMotes(),
      spawnTimers: { fragment: 0.3, phage: 1.4, wave: 4.4, rupture: 5.2 },
      player: createPlayer(selectedSpeciesId)
    };
  }

  function seedBackgroundMotes() {
    return Array.from({ length: 34 }, () => ({
      x: randomRange(0, canvas.width),
      y: randomRange(0, canvas.height),
      radius: randomRange(1, 4),
      drift: randomRange(10, 28),
      alpha: randomRange(0.06, 0.18)
    }));
  }

  function createPlayer(speciesId) {
    return {
      x: canvas.width * 0.5,
      y: canvas.height * 0.55,
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

  function randomRange(min, max) {
    return min + Math.random() * (max - min);
  }

  function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
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
    if (!rect.width || !rect.height) return { x: canvas.width * 0.5, y: canvas.height * 0.5 };
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height
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

  function hideOverlay() {
    overlay.classList.add("is-hidden");
  }

  function showOverlay(mode) {
    state.overlayMode = mode;
    overlay.classList.remove("is-hidden");

    if (mode === "start") {
      overlayTitle.textContent = "Keep the envelope intact.";
      overlayCopy.textContent =
        "Collect repair fragments, trigger stabilization bursts, and survive phages, antibiotic waves, and rupture fronts long enough to climb the board.";
      overlayStatus.textContent = "Repair the cell envelope before stress overwhelms the bacterium.";
      setOverlayPoints([
        "Collect 4 repair fragments to trigger a stabilization burst.",
        "Use your stress response when the meter is full for a short safe window.",
        "Difficulty rises slowly, so smart movement matters more than memorizing patterns."
      ]);
      startButton.textContent = "Start Classic Run";
      dailyStartButton.textContent = "Play Daily Challenge";
    } else if (mode === "paused") {
      overlayTitle.textContent = "Run paused";
      overlayCopy.textContent = `${state.currentBoardLabel}. Resume when you are ready to keep the bacterium intact.`;
      overlayStatus.textContent = `Current score ${Math.round(state.score)} after ${formatDuration(state.elapsed)}.`;
      setOverlayPoints([
        `${Math.round(state.integrity)}% integrity remaining.`,
        `${state.repairProgress} of ${state.repairNeeded} repair fragments collected.`,
        "Use the stress response proactively when lanes start collapsing."
      ]);
      startButton.textContent = "Resume Run";
      dailyStartButton.textContent = "Restart Run";
    } else {
      const best = Math.max(getCurrentBest(state.currentBoard), Math.round(state.score));
      overlayTitle.textContent = "Envelope compromised";
      overlayCopy.textContent = `${state.currentBoardLabel}. Survived ${formatDuration(state.elapsed)} with ${Math.round(
        state.score
      )} points.`;
      overlayStatus.textContent = state.lastPlacement
        ? state.lastPlacement.summary
        : "Score saved. Use a different strain or jump into the daily challenge for a new rhythm.";
      setOverlayPoints([
        `${Math.round(state.integrity)}% integrity at collapse.`,
        `Personal best on this board: ${best}.`,
        `Species used: ${getSpecies().label}.`
      ]);
      startButton.textContent = state.currentMode === "daily" ? "Replay Daily Challenge" : "Run Classic Again";
      dailyStartButton.textContent = state.currentMode === "daily" ? "Play Classic" : "Try Daily Challenge";
    }

    updateControlState();
  }

  function updateControlState() {
    const activeRun = state.running && !state.paused;
    pauseButton.disabled = !state.running;
    restartButton.disabled = !state.running && state.overlayMode === "start";
    responseButton.disabled = !activeRun || state.responseCharge < 100;
    responseButton.classList.toggle("is-ready", activeRun && state.responseCharge >= 100);
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
    dailyNote.textContent = `${challenge.dateLabel} daily challenge: ${challenge.profile.name}. Locked to ${species.label}. ${challenge.profile.subtitle}`;
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
  }

  function addFloater(x, y, text, color = "#d8fbff") {
    state.floaters.push({ x, y, text, color, life: 1.15, vy: -24 });
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
    state.elapsed = 0;
    state.score = 0;
    state.integrity = 100;
    state.responseCharge = 0;
    state.responseReadyFlash = 0;
    state.safeWindow = 0;
    state.hitFlash = 0;
    state.phaseIndex = 0;
    state.repairNeeded = Math.max(4, Math.floor(getModeModifiers().repairNeeded || 4));
    state.repairProgress = 0;
    state.lastPlacement = null;
    state.banner = null;
    state.fragments = [];
    state.phages = [];
    state.waves = [];
    state.ruptures = [];
    state.pulses = [];
    state.floaters = [];
    state.player = createPlayer(state.speciesId);
    state.spawnTimers = { fragment: 0.2, phage: 1.3, wave: 4.8, rupture: 5.6 };
    spawnInitialFragments();
    state.running = true;
    state.paused = false;
    state.lastFrame = 0;
    hideOverlay();
    setBanner("Envelope initiated", "Collect repair fragments to trigger your first stabilization burst.");
    refreshLeaderboard(state.currentBoard);
    updateHud(true);
    updateControlState();
  }

  function pauseRun() {
    if (!state.running) return;
    state.paused = true;
    showOverlay("paused");
  }

  function resumeRun() {
    if (!state.running) return;
    state.paused = false;
    state.lastFrame = 0;
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
    state.integrity = clamp(state.integrity - adjusted, 0, 100);
    state.safeWindow = 0.65;
    state.hitFlash = 0.32;
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
    state.score += scoreBonus;
    state.integrity = clamp(state.integrity + 12 + species.healBonus, 0, 100);
    state.responseCharge = clamp(state.responseCharge + 18, 0, 100);
    state.safeWindow = Math.max(state.safeWindow, 0.85);
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
    setBanner("Envelope stabilized", "Nearby stressors were cleared by a successful repair cycle.");
    addFloater(state.player.x, state.player.y - 36, `+${scoreBonus}`, "#b9ffd4");
  }

  function triggerStressResponse() {
    if (!state.running || state.paused || state.responseCharge < 100) return;
    const species = getSpecies();
    state.responseCharge = 0;
    state.responseReadyFlash = 0;
    state.safeWindow = Math.max(state.safeWindow, 1.15);
    state.integrity = clamp(state.integrity + 14 + species.healBonus, 0, 100);
    clearHazardsAroundPlayer(species.burstRadius + 28);
    state.pulses.push({
      x: state.player.x,
      y: state.player.y,
      radius: 16,
      maxRadius: species.burstRadius + 64,
      lineWidth: 14,
      color: species.palette.pulse,
      life: 0.74
    });
    state.score += 120;
    setBanner("Stress response", "A short safe window is active. Reposition before pressure closes again.");
    addFloater(state.player.x, state.player.y - 40, "Stress response", "#d7fbff");
    updateControlState();
  }

  function getDifficultyScalar() {
    return clamp(state.elapsed / 300, 0, 1);
  }

  function spawnFragment() {
    const kind = pick(FRAGMENT_TYPES);
    const margin = 72;
    let attempts = 0;
    let x = canvas.width * 0.5;
    let y = canvas.height * 0.5;
    while (attempts < 18) {
      x = randomRange(margin, canvas.width - margin);
      y = randomRange(margin, canvas.height - margin);
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
    const edge = Math.floor(Math.random() * 4);
    let x = 0;
    let y = 0;
    if (edge === 0) {
      x = -28;
      y = randomRange(40, canvas.height - 40);
    } else if (edge === 1) {
      x = canvas.width + 28;
      y = randomRange(40, canvas.height - 40);
    } else if (edge === 2) {
      x = randomRange(40, canvas.width - 40);
      y = -28;
    } else {
      x = randomRange(40, canvas.width - 40);
      y = canvas.height + 28;
    }
    const speed = lerp(96, 182, difficulty);
    state.phages.push({
      x,
      y,
      vx: 0,
      vy: 0,
      radius: randomRange(12, 15),
      speed,
      turnRate: lerp(1.4, 2.5, difficulty),
      nearActive: false,
      nearAwarded: false,
      spin: randomRange(0, TAU)
    });
  }

  function spawnWave() {
    const difficulty = getDifficultyScalar();
    const axis = Math.random() > 0.5 ? "x" : "y";
    const thickness = randomRange(84, 112);
    const fromNegative = Math.random() > 0.5;
    const velocity = (fromNegative ? 1 : -1) * lerp(148, 236, difficulty);
    state.waves.push({
      axis,
      position: fromNegative ? -thickness : axis === "x" ? canvas.width + thickness : canvas.height + thickness,
      velocity,
      thickness,
      hue: Math.random() > 0.5 ? "#77dfff" : "#91f3ff"
    });
  }

  function spawnRupture() {
    const difficulty = getDifficultyScalar();
    const angle = pick([Math.PI / 4, -Math.PI / 4, (3 * Math.PI) / 4, (-3 * Math.PI) / 4]) + randomRange(-0.2, 0.2);
    const length = randomRange(260, 360);
    const directionX = Math.cos(angle);
    const directionY = Math.sin(angle);
    const normalX = -directionY;
    const normalY = directionX;
    const edge = Math.floor(Math.random() * 4);
    let centerX = 0;
    let centerY = 0;
    if (edge === 0) {
      centerX = -80;
      centerY = randomRange(60, canvas.height - 60);
    } else if (edge === 1) {
      centerX = canvas.width + 80;
      centerY = randomRange(60, canvas.height - 60);
    } else if (edge === 2) {
      centerX = randomRange(60, canvas.width - 60);
      centerY = -80;
    } else {
      centerX = randomRange(60, canvas.width - 60);
      centerY = canvas.height + 80;
    }
    const half = length * 0.5;
    state.ruptures.push({
      x1: centerX - directionX * half,
      y1: centerY - directionY * half,
      x2: centerX + directionX * half,
      y2: centerY + directionY * half,
      vx: normalX * lerp(134, 220, difficulty),
      vy: normalY * lerp(134, 220, difficulty),
      width: randomRange(12, 18),
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

    const baseSpeed = 294 * species.speedMul;
    state.player.vx = moveX * baseSpeed;
    state.player.vy = moveY * baseSpeed;
    state.player.x = clamp(state.player.x + state.player.vx * dt, 36, canvas.width - 36);
    state.player.y = clamp(state.player.y + state.player.vy * dt, 36, canvas.height - 36);
    if (Math.abs(state.player.vx) + Math.abs(state.player.vy) > 12) {
      state.player.angle = Math.atan2(state.player.vy, state.player.vx);
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

      if (distance < 26) {
        state.fragments.splice(index, 1);
        state.score += 60;
        state.repairProgress += 1;
        state.responseCharge = clamp(state.responseCharge + 19 * species.responseGainMul * getModeModifiers().response, 0, 100);
        addFloater(fragment.x, fragment.y, fragment.kind.label, fragment.kind.color);
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

      const collisionRadius = 22 + phage.radius;
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

      if (phage.x < -60 || phage.x > canvas.width + 60 || phage.y < -60 || phage.y > canvas.height + 60) {
        state.phages.splice(index, 1);
      }
    }
  }

  function updateWaves(dt) {
    for (let index = state.waves.length - 1; index >= 0; index -= 1) {
      const wave = state.waves[index];
      wave.position += wave.velocity * dt;
      const collisionDistance = wave.axis === "x" ? Math.abs(state.player.x - wave.position) : Math.abs(state.player.y - wave.position);
      if (collisionDistance < wave.thickness * 0.5 + 18) {
        state.waves.splice(index, 1);
        applyDamage(17, "wave", state.player.x, state.player.y);
        continue;
      }
      const limit = wave.axis === "x" ? canvas.width : canvas.height;
      if (wave.position < -wave.thickness * 1.5 || wave.position > limit + wave.thickness * 1.5) {
        state.waves.splice(index, 1);
      }
    }
  }

  function updateRuptures(dt) {
    for (let index = state.ruptures.length - 1; index >= 0; index -= 1) {
      const rupture = state.ruptures[index];
      rupture.x1 += rupture.vx * dt;
      rupture.y1 += rupture.vy * dt;
      rupture.x2 += rupture.vx * dt;
      rupture.y2 += rupture.vy * dt;
      rupture.life -= dt;
      const distance = pointSegmentDistance(state.player.x, state.player.y, rupture.x1, rupture.y1, rupture.x2, rupture.y2);
      if (distance <= rupture.width + 14) {
        state.ruptures.splice(index, 1);
        applyDamage(16, "rupture", state.player.x, state.player.y);
        continue;
      }
      if (
        rupture.life <= 0 ||
        (rupture.x1 < -220 && rupture.x2 < -220) ||
        (rupture.x1 > canvas.width + 220 && rupture.x2 > canvas.width + 220) ||
        (rupture.y1 < -220 && rupture.y2 < -220) ||
        (rupture.y1 > canvas.height + 220 && rupture.y2 > canvas.height + 220)
      ) {
        state.ruptures.splice(index, 1);
      }
    }
  }

  function updateEffects(dt) {
    state.safeWindow = Math.max(0, state.safeWindow - dt);
    state.hitFlash = Math.max(0, state.hitFlash - dt);
    state.responseReadyFlash = Math.max(0, state.responseReadyFlash - dt);

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

    for (let index = state.pulses.length - 1; index >= 0; index -= 1) {
      const pulse = state.pulses[index];
      pulse.life -= dt;
      const progress = 1 - pulse.life / 0.74;
      pulse.radius = lerp(pulse.radius, pulse.maxRadius, clamp(progress, 0, 1));
      if (pulse.life <= 0) {
        state.pulses.splice(index, 1);
      }
    }
  }

  function updateBackground(dt) {
    state.backgroundMotes.forEach((mote) => {
      mote.y += mote.drift * dt;
      if (mote.y > canvas.height + 8) {
        mote.y = -8;
        mote.x = randomRange(0, canvas.width);
      }
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
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#071522");
    gradient.addColorStop(0.5, "#0c2237");
    gradient.addColorStop(1, "#08131f");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const accent = ctx.createRadialGradient(canvas.width * 0.2, canvas.height * 0.18, 10, canvas.width * 0.2, canvas.height * 0.18, canvas.width * 0.72);
    accent.addColorStop(0, phase.tintA);
    accent.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = accent;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const accentB = ctx.createRadialGradient(canvas.width * 0.82, canvas.height * 0.8, 10, canvas.width * 0.82, canvas.height * 0.8, canvas.width * 0.62);
    accentB.addColorStop(0, phase.tintB);
    accentB.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = accentB;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.strokeStyle = "rgba(165, 227, 241, 0.08)";
    ctx.lineWidth = 1;
    for (let x = 40; x < canvas.width; x += 80) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 40; y < canvas.height; y += 80) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    ctx.restore();

    state.backgroundMotes.forEach((mote) => {
      ctx.fillStyle = `rgba(178, 235, 245, ${mote.alpha})`;
      ctx.beginPath();
      ctx.arc(mote.x, mote.y, mote.radius, 0, TAU);
      ctx.fill();
    });

    if (state.hitFlash > 0) {
      ctx.fillStyle = `rgba(255, 120, 147, ${state.hitFlash * 0.22})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  function drawFragments() {
    state.fragments.forEach((fragment) => {
      const bob = Math.sin(fragment.pulse) * 4;
      ctx.save();
      ctx.translate(fragment.x, fragment.y + bob);
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, TAU);
      ctx.fillStyle = fragment.kind.halo;
      ctx.fill();
      ctx.fillStyle = fragment.kind.color;
      ctx.beginPath();
      for (let index = 0; index < 6; index += 1) {
        const angle = -Math.PI / 2 + (index / 6) * TAU;
        const radius = index % 2 === 0 ? 10 : 6;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });
  }

  function drawPhages() {
    state.phages.forEach((phage) => {
      ctx.save();
      ctx.translate(phage.x, phage.y);
      ctx.rotate(phage.spin);
      ctx.strokeStyle = "rgba(209, 244, 255, 0.92)";
      ctx.fillStyle = "rgba(106, 208, 236, 0.92)";
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
      ctx.lineTo(0, phage.radius + 16);
      ctx.moveTo(-7, phage.radius + 11);
      ctx.lineTo(7, phage.radius + 11);
      ctx.stroke();
      ctx.restore();
    });
  }

  function drawWaves() {
    state.waves.forEach((wave) => {
      ctx.save();
      ctx.fillStyle = wave.hue === "#77dfff" ? "rgba(119, 223, 255, 0.22)" : "rgba(145, 243, 255, 0.18)";
      ctx.strokeStyle = wave.hue;
      ctx.lineWidth = 2.5;
      if (wave.axis === "x") {
        ctx.fillRect(wave.position - wave.thickness * 0.5, 0, wave.thickness, canvas.height);
        ctx.beginPath();
        ctx.moveTo(wave.position, 0);
        ctx.lineTo(wave.position, canvas.height);
        ctx.stroke();
      } else {
        ctx.fillRect(0, wave.position - wave.thickness * 0.5, canvas.width, wave.thickness);
        ctx.beginPath();
        ctx.moveTo(0, wave.position);
        ctx.lineTo(canvas.width, wave.position);
        ctx.stroke();
      }
      ctx.restore();
    });
  }

  function drawRuptures() {
    state.ruptures.forEach((rupture) => {
      ctx.save();
      ctx.strokeStyle = "rgba(255, 196, 145, 0.95)";
      ctx.lineWidth = rupture.width;
      ctx.lineCap = "round";
      ctx.setLineDash([12, 10]);
      ctx.beginPath();
      ctx.moveTo(rupture.x1, rupture.y1);
      ctx.lineTo(rupture.x2, rupture.y2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = "rgba(255, 239, 214, 0.9)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(rupture.x1, rupture.y1);
      ctx.lineTo(rupture.x2, rupture.y2);
      ctx.stroke();
      ctx.restore();
    });
  }

  function drawPulses() {
    state.pulses.forEach((pulse) => {
      ctx.save();
      ctx.strokeStyle = pulse.color;
      ctx.lineWidth = pulse.lineWidth;
      ctx.globalAlpha = clamp(pulse.life / 0.74, 0, 1);
      ctx.beginPath();
      ctx.arc(pulse.x, pulse.y, pulse.radius, 0, TAU);
      ctx.stroke();
      ctx.restore();
    });
  }

  function drawPlayer() {
    const species = getSpecies();
    const { x, y, angle } = state.player;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    if (state.safeWindow > 0) {
      ctx.fillStyle = `rgba(179, 245, 255, ${0.12 + state.safeWindow * 0.16})`;
      ctx.beginPath();
      ctx.arc(0, 0, 34, 0, TAU);
      ctx.fill();
    }

    const gradient = ctx.createLinearGradient(-24, -8, 24, 8);
    gradient.addColorStop(0, species.palette.bodyA);
    gradient.addColorStop(1, species.palette.bodyB);
    ctx.fillStyle = gradient;
    ctx.strokeStyle = species.palette.outline;
    ctx.lineWidth = 2.5;

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

    ctx.fillStyle = species.palette.core;
    ctx.beginPath();
    ctx.ellipse(0, 0, 10, 7, 0, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  function drawBanner() {
    if (!state.banner) return;
    const width = 360;
    const height = 74;
    const x = (canvas.width - width) * 0.5;
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
    drawBackground();
    drawFragments();
    drawWaves();
    drawRuptures();
    drawPhages();
    drawPulses();
    drawPlayer();
    drawBanner();
    drawFloaters();
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
    state.leaderboard = readLocalLeaderboard(normalizedBoard);
    state.leaderboardStats = { totalEntries: state.leaderboard.length, updatedAt: Date.now(), board: normalizedBoard };
    state.leaderboardMode = GLOBAL_LEADERBOARD_URL ? "fallback" : "local";
    renderLeaderboard();

    if (!GLOBAL_LEADERBOARD_URL) {
      return;
    }

    try {
      const payload = await fetchLeaderboardPayload(normalizedBoard);
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
    state.paused = false;
    updateControlState();
    showOverlay("ended");
    submitScore();
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
    if (!state.running) {
      state.currentMode = "classic";
      state.currentBoard = "classic";
      state.currentBoardLabel = "Classic board";
      state.speciesId = state.selectedSpeciesId;
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
    render();
    if (!rafId) {
      rafId = window.requestAnimationFrame(loop);
    }
  }

  function closeModal() {
    if (state.running) {
      pauseRun();
    }
    state.open = false;
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
  modal.addEventListener("close", () => {
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }
    state.open = false;
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

  updateDailyNote();
  updateSpeciesInfo();
  if (playerNameInput) {
    playerNameInput.value = state.playerName;
    updatePlayerNameFeedback();
  }
  updateHud(true);
  renderLeaderboard();
  render();
})();
