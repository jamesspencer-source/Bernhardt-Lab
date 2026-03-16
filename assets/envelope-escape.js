(() => {
  const trigger = document.getElementById("envelope-trigger");
  const modal = document.getElementById("envelope-modal");
  const closeButton = document.getElementById("envelope-close");
  const startButton = document.getElementById("envelope-start");
  const tutorialStartButton = document.getElementById("envelope-tutorial-start");
  const pauseButton = document.getElementById("envelope-pause");
  const restartButton = document.getElementById("envelope-restart");
  const canvas = document.getElementById("envelope-canvas");
  const overlay = document.getElementById("envelope-overlay");
  const overlayTitle = document.getElementById("envelope-overlay-title");
  const overlayCopy = document.getElementById("envelope-overlay-copy");

  if (!trigger || !modal || !closeButton || !startButton || !pauseButton || !restartButton || !canvas || !overlay) {
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const scoreEl = document.getElementById("envelope-score");
  const bestEl = document.getElementById("envelope-best");
  const timeEl = document.getElementById("envelope-time");
  const pressureEl = document.getElementById("envelope-pressure");
  const integrityEl = document.getElementById("envelope-integrity");
  const integrityBarEl = document.getElementById("envelope-integrity-bar");
  const shieldEl = document.getElementById("envelope-shield");
  const shieldBarEl = document.getElementById("envelope-shield-bar");
  const boostEl = document.getElementById("envelope-boost");
  const boostBarEl = document.getElementById("envelope-boost-bar");
  const leaderboardListEl = document.getElementById("envelope-leaderboard-list");
  const leaderboardMetaEl = document.getElementById("envelope-leaderboard-meta");
  const nameFormEl = document.getElementById("envelope-name-form");
  const nameInputEl = document.getElementById("envelope-name-input");
  const nameLabelEl = document.getElementById("envelope-name-label");
  const nameSkipEl = document.getElementById("envelope-name-skip");
  const nameFeedbackEl = document.getElementById("envelope-name-feedback");
  const playerNameInputEl = document.getElementById("envelope-player-name");
  const playerNameFeedbackEl = document.getElementById("envelope-player-name-feedback");
  const tutorialNoteEl = document.getElementById("envelope-tutorial-note");
  const modelSelectEl = document.getElementById("envelope-model-select");
  const modelNoteEl = document.getElementById("envelope-model-note");
  const precursorKeyListEl = document.getElementById("envelope-precursor-key-list");

  const prefersReducedMotion =
    typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const STORAGE_KEY = "bernhardt-envelope-escape-best";
  const LEADERBOARD_KEY = "bernhardt-envelope-escape-leaderboard-v1";
  const PENDING_LEADERBOARD_KEY = "bernhardt-envelope-escape-pending-v1";
  const MODEL_KEY = "bernhardt-envelope-escape-model";
  const PLAYER_NAME_KEY = "bernhardt-envelope-escape-player-name";
  const TUTORIAL_SEEN_KEY = "bernhardt-envelope-escape-tutorial-seen";
  const LEADERBOARD_SIZE = 25;
  const PENDING_LEADERBOARD_LIMIT = 120;
  const LEADERBOARD_REQUEST_TIMEOUT_MS = 9000;
  const GLOBAL_LEADERBOARD_URL = String(window.ENVELOPE_LEADERBOARD_URL || "").trim();

  const BACTERIA_MODELS = {
    ecoli: {
      label: "Escherichia coli",
      morphology: "Straight rod",
      shape: "rod",
      radiusScale: 1,
      lengthScale: 2.72,
      palette: {
        membraneA: "#6ae7ee",
        membraneB: "#9af9ff",
        membraneC: "#4ec8d8",
        core: "rgba(9, 41, 69, 0.9)",
        accent: "rgba(161, 245, 255, 0.8)",
        shield: "rgba(125, 243, 255, 0.7)"
      }
    },
    kpneumoniae: {
      label: "Klebsiella pneumoniae",
      morphology: "Encapsulated rod",
      shape: "encapsulated-rod",
      radiusScale: 1.08,
      lengthScale: 2.5,
      palette: {
        membraneA: "#7fe6d3",
        membraneB: "#a6ffe5",
        membraneC: "#59c8bb",
        core: "rgba(17, 52, 74, 0.88)",
        accent: "rgba(190, 255, 236, 0.78)",
        shield: "rgba(171, 255, 224, 0.68)"
      }
    },
    abaumannii: {
      label: "Acinetobacter baumannii",
      morphology: "Coccobacillus",
      shape: "coccobacillus",
      radiusScale: 0.98,
      lengthScale: 2.1,
      palette: {
        membraneA: "#86d8ff",
        membraneB: "#b8e9ff",
        membraneC: "#63b7ef",
        core: "rgba(12, 40, 70, 0.88)",
        accent: "rgba(175, 227, 255, 0.8)",
        shield: "rgba(139, 226, 255, 0.68)"
      }
    },
    saureus: {
      label: "Staphylococcus aureus",
      morphology: "Coccus",
      shape: "coccus",
      radiusScale: 1.05,
      lengthScale: 2,
      palette: {
        membraneA: "#ffd88f",
        membraneB: "#ffe8b8",
        membraneC: "#f5b15a",
        core: "rgba(88, 48, 20, 0.76)",
        accent: "rgba(255, 226, 170, 0.76)",
        shield: "rgba(255, 228, 173, 0.66)"
      }
    },
    paeruginosa: {
      label: "Pseudomonas aeruginosa",
      morphology: "Slightly curved rod",
      shape: "curved-rod",
      radiusScale: 0.94,
      lengthScale: 2.85,
      palette: {
        membraneA: "#8deed7",
        membraneB: "#b5ffe8",
        membraneC: "#60cdb7",
        core: "rgba(12, 52, 59, 0.88)",
        accent: "rgba(191, 255, 239, 0.8)",
        shield: "rgba(169, 254, 228, 0.7)"
      }
    },
    spneumoniae: {
      label: "Streptococcus pneumoniae",
      morphology: "Lancet diplococcus",
      shape: "diplococcus",
      radiusScale: 0.96,
      lengthScale: 2.05,
      palette: {
        membraneA: "#ffb3c8",
        membraneB: "#ffd1df",
        membraneC: "#f08fae",
        core: "rgba(92, 33, 58, 0.82)",
        accent: "rgba(255, 214, 229, 0.84)",
        shield: "rgba(255, 197, 222, 0.68)"
      }
    },
    cglutamicum: {
      label: "Corynebacterium glutamicum",
      morphology: "Coryneform rod",
      shape: "coryneform",
      radiusScale: 0.95,
      lengthScale: 2.38,
      palette: {
        membraneA: "#c6d4ff",
        membraneB: "#e2e8ff",
        membraneC: "#9db2ff",
        core: "rgba(25, 33, 79, 0.84)",
        accent: "rgba(218, 228, 255, 0.8)",
        shield: "rgba(191, 208, 255, 0.72)"
      }
    }
  };

  // Species-aware precursor set for game pickups (PG/Lipid II, Gram-negative OM glycoconjugates,
  // Gram-positive teichoic acids, and Corynebacteriales arabinogalactan-mycolate layers).
  const ENVELOPE_PRECURSORS = {
    lipidII: {
      label: "Lipid II",
      shortLabel: "Lipid II",
      points: 120,
      icon: "lipid-ii",
      coreShape: "hex",
      glowColor: "rgba(181, 255, 218, 0.9)",
      fillColor: "rgba(162, 255, 205, 0.95)",
      strokeColor: "rgba(31, 98, 78, 0.58)",
      detailColor: "rgba(230, 255, 243, 0.78)",
      burstColor: "#89ffca",
      floaterColor: "#b4ffd7"
    },
    phospholipid: {
      label: "Phospholipids",
      shortLabel: "Phospholipids",
      points: 90,
      icon: "phospholipid",
      coreShape: "disc",
      glowColor: "rgba(181, 218, 255, 0.9)",
      fillColor: "rgba(165, 208, 255, 0.95)",
      strokeColor: "rgba(42, 78, 118, 0.62)",
      detailColor: "rgba(226, 240, 255, 0.82)",
      burstColor: "#9bc2ff",
      floaterColor: "#c4dcff"
    },
    lps: {
      label: "LPS",
      shortLabel: "LPS",
      points: 130,
      icon: "lps",
      coreShape: "hex",
      glowColor: "rgba(255, 216, 174, 0.88)",
      fillColor: "rgba(255, 200, 140, 0.95)",
      strokeColor: "rgba(112, 71, 33, 0.56)",
      detailColor: "rgba(255, 235, 210, 0.82)",
      burstColor: "#ffc288",
      floaterColor: "#ffd7af"
    },
    los: {
      label: "LOS",
      shortLabel: "LOS",
      points: 125,
      icon: "los",
      coreShape: "hex",
      glowColor: "rgba(255, 197, 195, 0.88)",
      fillColor: "rgba(255, 172, 172, 0.95)",
      strokeColor: "rgba(123, 52, 52, 0.56)",
      detailColor: "rgba(255, 228, 228, 0.82)",
      burstColor: "#ff9fa4",
      floaterColor: "#ffc7cb"
    },
    capsule: {
      label: "Capsule polysaccharide",
      shortLabel: "Capsule",
      points: 115,
      icon: "capsule",
      coreShape: "capsule",
      glowColor: "rgba(191, 255, 230, 0.9)",
      fillColor: "rgba(182, 255, 222, 0.95)",
      strokeColor: "rgba(38, 103, 87, 0.56)",
      detailColor: "rgba(236, 255, 247, 0.82)",
      burstColor: "#93ffd9",
      floaterColor: "#bbffe6"
    },
    wta: {
      label: "Wall teichoic acids",
      shortLabel: "WTA",
      points: 120,
      icon: "teichoic",
      coreShape: "rounded-rect",
      glowColor: "rgba(255, 218, 149, 0.9)",
      fillColor: "rgba(255, 194, 122, 0.95)",
      strokeColor: "rgba(117, 73, 27, 0.56)",
      detailColor: "rgba(255, 237, 201, 0.82)",
      burstColor: "#ffbf7f",
      floaterColor: "#ffd5a9"
    },
    lta: {
      label: "Lipoteichoic acids",
      shortLabel: "LTA",
      points: 110,
      icon: "teichoic-anchor",
      coreShape: "rounded-rect",
      glowColor: "rgba(255, 199, 150, 0.9)",
      fillColor: "rgba(255, 177, 124, 0.95)",
      strokeColor: "rgba(123, 65, 33, 0.56)",
      detailColor: "rgba(255, 229, 200, 0.82)",
      burstColor: "#ffb685",
      floaterColor: "#ffd2b5"
    },
    cholineTa: {
      label: "Choline-rich teichoic acids",
      shortLabel: "Teichoic acids",
      points: 120,
      icon: "teichoic",
      coreShape: "rounded-rect",
      glowColor: "rgba(255, 184, 218, 0.9)",
      fillColor: "rgba(255, 156, 202, 0.95)",
      strokeColor: "rgba(116, 43, 86, 0.56)",
      detailColor: "rgba(255, 221, 238, 0.82)",
      burstColor: "#ff9ad1",
      floaterColor: "#ffc3e3"
    },
    arabinogalactan: {
      label: "Arabinogalactan",
      shortLabel: "Arabinogalactan",
      points: 130,
      icon: "mesh",
      coreShape: "hex",
      glowColor: "rgba(218, 203, 255, 0.9)",
      fillColor: "rgba(198, 179, 255, 0.95)",
      strokeColor: "rgba(72, 51, 123, 0.56)",
      detailColor: "rgba(234, 224, 255, 0.82)",
      burstColor: "#c8b0ff",
      floaterColor: "#ddcdff"
    },
    mycolic: {
      label: "Mycolic acids",
      shortLabel: "Mycolic acids",
      points: 140,
      icon: "mycolic",
      coreShape: "capsule",
      glowColor: "rgba(183, 219, 255, 0.9)",
      fillColor: "rgba(164, 204, 255, 0.95)",
      strokeColor: "rgba(46, 71, 122, 0.56)",
      detailColor: "rgba(220, 236, 255, 0.82)",
      burstColor: "#9ebfff",
      floaterColor: "#c5dcff"
    }
  };

  const MODEL_PRECURSOR_POOLS = {
    ecoli: [
      { id: "lipidII", weight: 0.46 },
      { id: "lps", weight: 0.34 },
      { id: "phospholipid", weight: 0.2 }
    ],
    paeruginosa: [
      { id: "lipidII", weight: 0.44 },
      { id: "lps", weight: 0.34 },
      { id: "phospholipid", weight: 0.22 }
    ],
    kpneumoniae: [
      { id: "lipidII", weight: 0.35 },
      { id: "lps", weight: 0.26 },
      { id: "capsule", weight: 0.28 },
      { id: "phospholipid", weight: 0.11 }
    ],
    abaumannii: [
      { id: "lipidII", weight: 0.35 },
      { id: "los", weight: 0.31 },
      { id: "capsule", weight: 0.23 },
      { id: "phospholipid", weight: 0.11 }
    ],
    saureus: [
      { id: "lipidII", weight: 0.38 },
      { id: "wta", weight: 0.3 },
      { id: "lta", weight: 0.22 },
      { id: "phospholipid", weight: 0.1 }
    ],
    spneumoniae: [
      { id: "lipidII", weight: 0.38 },
      { id: "cholineTa", weight: 0.34 },
      { id: "capsule", weight: 0.28 }
    ],
    cglutamicum: [
      { id: "lipidII", weight: 0.34 },
      { id: "arabinogalactan", weight: 0.3 },
      { id: "mycolic", weight: 0.28 },
      { id: "phospholipid", weight: 0.08 }
    ]
  };

  const state = {
    width: 960,
    height: 540,
    dpr: 1,
    running: false,
    paused: false,
    elapsed: 0,
    score: 0,
    best: readBestScore(),
    integrity: 100,
    shield: 0,
    boostTimer: 0,
    combo: 0,
    invulnerable: 0,
    shake: 0,
    flowAngle: random(0, Math.PI * 2),
    flowTargetAngle: random(0, Math.PI * 2),
    flowStrength: 0,
    flowTargetStrength: 0,
    flowShiftIn: random(7, 12),
    phageSpawnIn: 1.45,
    pulseSpawnIn: 5.4,
    resourceSpawnIn: 1.2,
    surgeIn: 64,
    surgeTimer: 0,
    surgePulseIn: 0.44,
    nearMissCooldown: 0,
    collapseActive: false,
    collapseTimer: 0,
    collapseDuration: 2.7,
    collapseRuptureAt: 0.38,
    collapseReleased: false,
    lysisPhages: [],
    lysisRuptures: [],
    lysisFragments: [],
    lysisShockwaves: [],
    particles: [],
    phages: [],
    pulses: [],
    resources: [],
    bursts: [],
    floaters: [],
    trails: [],
    leaderboard: readLeaderboard(),
    pendingLeaderboard: readPendingLeaderboard(),
    leaderboardMode: GLOBAL_LEADERBOARD_URL ? "global" : "local",
    pendingScore: null,
    runMode: "ranked",
    tutorialTipStep: 0,
    tutorialSeen: readTutorialSeen(),
    playerName: readPlayerName(),
    modelId: readModelChoice(),
    player: {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      angle: 0,
      radius: 18,
      length: 50
    }
  };

  const keys = {
    up: false,
    down: false,
    left: false,
    right: false
  };

  const pointer = {
    active: false,
    x: 0,
    y: 0
  };

  function resetInputState() {
    keys.up = false;
    keys.down = false;
    keys.left = false;
    keys.right = false;
    pointer.active = false;
  }

  const seededBest = Math.max(state.best, getLeaderboardBest(state.leaderboard));
  state.best = seededBest;
  writeBestScore(seededBest);

  let rafId = null;
  let lastFrame = 0;
  let overlayMode = "start";
  let triggerTimer = null;

  function readBestScore() {
    try {
      const value = Number(window.localStorage.getItem(STORAGE_KEY) || "0");
      return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
    } catch {
      return 0;
    }
  }

  function writeBestScore(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(Math.max(0, Math.floor(value))));
    } catch {
      /* no-op */
    }
  }

  function sanitizeName(value) {
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

  function setNameFeedback(message = "") {
    if (!nameFeedbackEl) return;
    nameFeedbackEl.textContent = message;
    nameFeedbackEl.hidden = !message;
  }

  function normalizeSpeciesId(value) {
    const key = String(value || "").trim().toLowerCase();
    if (key && BACTERIA_MODELS[key]) return key;
    return "unknown";
  }

  function getSpeciesLabel(speciesId) {
    const key = normalizeSpeciesId(speciesId);
    if (key === "unknown") return "Model not recorded";
    return getModel(key).label;
  }

  const SPECIES_INLINE_PATTERNS = [
    /\bEscherichia\s+coli\b/gi,
    /\bPseudomonas\s+aeruginosa\b/gi,
    /\bStaphylococcus\s+aureus\b/gi,
    /\bStreptococcus\s+pneumoniae\b/gi,
    /\bCorynebacterium\s+glutamicum\b/gi,
    /\bKlebsiella\s+pneumoniae\b/gi,
    /\bAcinetobacter\s+baumannii\b/gi,
    /\bE\.\s*coli\b/gi,
    /\bP\.\s*aeruginosa\b/gi,
    /\bS\.\s*aureus\b/gi,
    /\bS\.\s*pneumoniae\b/gi,
    /\bC\.\s*glutamicum\b/gi,
    /\bK\.\s*pneumoniae\b/gi,
    /\bA\.\s*baumannii\b/gi
  ];

  function escapeHtml(value = "") {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatSpeciesAwareHtml(value = "") {
    const escaped = escapeHtml(value);
    return SPECIES_INLINE_PATTERNS.reduce(
      (result, pattern) => result.replace(pattern, (match) => `<em class="species-name">${match}</em>`),
      escaped
    );
  }

  function formatLeaderboardTimestamp(ms) {
    const time = Number(ms) || Date.now();
    const stamp = new Date(time);
    if (!Number.isFinite(stamp.getTime())) return "Unknown time";
    const pad = (value) => String(value).padStart(2, "0");
    return `${stamp.getFullYear()}-${pad(stamp.getMonth() + 1)}-${pad(stamp.getDate())} ${pad(stamp.getHours())}:${pad(stamp.getMinutes())}`;
  }

  function normalizeLeaderboardEntry(entry) {
    const cleanedName = sanitizeName(entry?.name) || "Anonymous";
    const playedAt = Math.max(0, Number(entry?.playedAt ?? entry?.createdAt) || Date.now());
    const score = Math.max(0, Math.floor(Number(entry?.score) || 0));
    return {
      name: isNameAllowed(cleanedName) ? cleanedName : "Anonymous",
      score,
      species: normalizeSpeciesId(entry?.species ?? entry?.speciesId ?? entry?.modelId),
      playedAt,
      createdAt: playedAt
    };
  }

  function normalizeLeaderboardEntries(entries) {
    if (!Array.isArray(entries)) return [];
    return entries
      .map((entry) => normalizeLeaderboardEntry(entry))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => (b.score - a.score !== 0 ? b.score - a.score : a.createdAt - b.createdAt))
      .slice(0, LEADERBOARD_SIZE);
  }

  function readLeaderboard() {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(LEADERBOARD_KEY) || "[]");
      return normalizeLeaderboardEntries(parsed);
    } catch {
      return [];
    }
  }

  function writeLeaderboard(entries) {
    try {
      window.localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
    } catch {
      /* no-op */
    }
  }

  function readPendingLeaderboard() {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(PENDING_LEADERBOARD_KEY) || "[]");
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map((entry) => normalizeLeaderboardEntry(entry))
        .filter((entry) => entry.score > 0)
        .slice(-PENDING_LEADERBOARD_LIMIT);
    } catch {
      return [];
    }
  }

  function writePendingLeaderboard(entries) {
    try {
      window.localStorage.setItem(PENDING_LEADERBOARD_KEY, JSON.stringify(entries.slice(-PENDING_LEADERBOARD_LIMIT)));
    } catch {
      /* no-op */
    }
  }

  function readPlayerName() {
    try {
      return sanitizeName(window.localStorage.getItem(PLAYER_NAME_KEY) || "") || "Anonymous";
    } catch {
      return "Anonymous";
    }
  }

  function writePlayerName(name) {
    try {
      window.localStorage.setItem(PLAYER_NAME_KEY, sanitizeName(name) || "Anonymous");
    } catch {
      /* no-op */
    }
  }

  function setPlayerNameFeedback(message = "") {
    if (!playerNameFeedbackEl) return;
    playerNameFeedbackEl.textContent = message;
    playerNameFeedbackEl.hidden = !message;
  }

  function readTutorialSeen() {
    try {
      return window.localStorage.getItem(TUTORIAL_SEEN_KEY) === "1";
    } catch {
      return false;
    }
  }

  function writeTutorialSeen(seen = true) {
    try {
      window.localStorage.setItem(TUTORIAL_SEEN_KEY, seen ? "1" : "0");
    } catch {
      /* no-op */
    }
  }

  function syncPlayerNameInput() {
    if (!playerNameInputEl) return;
    playerNameInputEl.value = state.playerName || "Anonymous";
  }

  function updateTutorialNote() {
    if (!tutorialNoteEl) return;
    tutorialNoteEl.textContent = state.tutorialSeen
      ? "Need a refresher? Tutorial Mode is easier and does not affect the leaderboard."
      : "First time? Try Tutorial Mode (easier, not ranked).";
  }

  function setLeaderboardMeta(mode) {
    if (!leaderboardMetaEl) return;
    leaderboardMetaEl.classList.remove("is-global", "is-fallback");

    if (mode === "global") {
      leaderboardMetaEl.textContent = "Shared leaderboard";
      leaderboardMetaEl.classList.add("is-global");
      return;
    }
    if (mode === "fallback") {
      leaderboardMetaEl.textContent = "Global offline · using local copy";
      leaderboardMetaEl.classList.add("is-fallback");
      return;
    }
    leaderboardMetaEl.textContent = "Local leaderboard";
  }

  async function fetchJsonWithTimeout(url, options = {}, timeoutMs = LEADERBOARD_REQUEST_TIMEOUT_MS) {
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timeoutId = controller
      ? window.setTimeout(() => {
          controller.abort();
        }, timeoutMs)
      : null;

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller ? controller.signal : undefined
      });
      return response;
    } finally {
      if (timeoutId !== null) window.clearTimeout(timeoutId);
    }
  }


  async function fetchGlobalLeaderboard() {
    if (!GLOBAL_LEADERBOARD_URL) return null;
    const response = await fetchJsonWithTimeout(GLOBAL_LEADERBOARD_URL, {
      method: "GET",
      headers: { Accept: "application/json" }
    });
    if (!response.ok) {
      throw new Error(`Leaderboard fetch failed (${response.status})`);
    }
    const payload = await response.json();
    const entries = Array.isArray(payload) ? payload : payload?.entries;
    return normalizeLeaderboardEntries(entries);
  }

  async function submitGlobalScore(name, score, species, playedAt) {
    if (!GLOBAL_LEADERBOARD_URL) return;
    const response = await fetchJsonWithTimeout(GLOBAL_LEADERBOARD_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        name: sanitizeName(name) || "Anonymous",
        score: Math.max(0, Math.floor(score)),
        species: normalizeSpeciesId(species),
        playedAt: Math.max(0, Math.floor(Number(playedAt) || Date.now()))
      })
    });
    if (!response.ok) {
      let errorCode = `http_${response.status}`;
      try {
        const payload = await response.json();
        if (payload?.errorCode) errorCode = String(payload.errorCode);
      } catch {
        /* no-op */
      }
      const error = new Error(`Leaderboard submit failed (${response.status})`);
      error.code = errorCode;
      throw error;
    }
  }

  function enqueuePendingLeaderboardEntry(entry) {
    const normalized = normalizeLeaderboardEntry(entry);
    if (normalized.score <= 0) return;
    state.pendingLeaderboard.push(normalized);
    state.pendingLeaderboard = state.pendingLeaderboard.slice(-PENDING_LEADERBOARD_LIMIT);
    writePendingLeaderboard(state.pendingLeaderboard);
  }

  async function flushPendingLeaderboard(maxAttempts = 25) {
    if (!GLOBAL_LEADERBOARD_URL || !state.pendingLeaderboard.length) return 0;

    const queue = [...state.pendingLeaderboard].sort((a, b) => a.playedAt - b.playedAt);
    const remaining = [];
    let sent = 0;
    let attempts = 0;

    for (let i = 0; i < queue.length; i += 1) {
      const entry = queue[i];

      if (attempts >= maxAttempts) {
        remaining.push(...queue.slice(i));
        break;
      }

      attempts += 1;

      try {
        await submitGlobalScore(entry.name, entry.score, entry.species, entry.playedAt);
        sent += 1;
      } catch (error) {
        if (error && error.code === "invalid_name") {
          continue;
        }
        remaining.push(entry, ...queue.slice(i + 1));
        break;
      }
    }

    state.pendingLeaderboard = remaining.slice(-PENDING_LEADERBOARD_LIMIT);
    writePendingLeaderboard(state.pendingLeaderboard);
    return sent;
  }

  async function refreshLeaderboardFromSource() {
    if (!GLOBAL_LEADERBOARD_URL) {
      state.leaderboardMode = "local";
      setLeaderboardMeta("local");
      renderLeaderboard();
      return;
    }

    try {
      await flushPendingLeaderboard(50);
      const remoteEntries = await fetchGlobalLeaderboard();
      state.leaderboard = remoteEntries || [];
      writeLeaderboard(state.leaderboard);
      state.leaderboardMode = "global";
      setLeaderboardMeta("global");
      state.best = Math.max(state.best, getLeaderboardBest(state.leaderboard));
      writeBestScore(state.best);
      updateHud();
      renderLeaderboard();
    } catch {
      state.leaderboard = readLeaderboard();
      state.leaderboardMode = "fallback";
      setLeaderboardMeta("fallback");
      renderLeaderboard();
    }
  }

  function getLeaderboardBest(entries) {
    if (!entries.length) return 0;
    return Math.max(0, Math.floor(entries[0].score));
  }

  function renderLeaderboard() {
    if (!leaderboardListEl) return;

    leaderboardListEl.innerHTML = "";
    for (let i = 0; i < LEADERBOARD_SIZE; i += 1) {
      const li = document.createElement("li");
      const entry = state.leaderboard[i];

      if (entry) {
        const score = document.createElement("strong");
        score.textContent = String(entry.score);

        const mainLine = document.createElement("div");
        mainLine.className = "envelope-leaderboard-main";
        mainLine.append(score, document.createTextNode(` — ${entry.name}`));

        const metaLine = document.createElement("span");
        metaLine.className = "envelope-leaderboard-meta-line";
        metaLine.innerHTML = `${formatSpeciesAwareHtml(getSpeciesLabel(entry.species))} · ${escapeHtml(formatLeaderboardTimestamp(entry.playedAt || entry.createdAt))}`;

        li.append(mainLine, metaLine);
      } else {
        li.classList.add("is-empty");
        li.textContent = "—";
      }

      leaderboardListEl.append(li);
    }
  }

  function hideNameForm() {
    state.pendingScore = null;
    if (nameFormEl) nameFormEl.hidden = true;
    if (nameInputEl) nameInputEl.value = "";
    setNameFeedback("");
  }

  function openNameForm(score) {
    const cleanedScore = Math.max(0, Math.floor(score));
    if (cleanedScore <= 0) return;

    state.pendingScore = cleanedScore;

    if (!nameFormEl) {
      const rawName = window.prompt(`Top 25 score (${cleanedScore}). Enter your name:`);
      if (rawName === null) {
        state.pendingScore = null;
        return;
      }
      const fallbackName = sanitizeName(rawName);
      const savedName = fallbackName || "Anonymous";
      if (!isNameAllowed(savedName)) {
        state.pendingScore = null;
        showOverlay("Score not saved", "Name unavailable. Try another name.", "Play Again", "restart");
        return;
      }
      addLeaderboardEntry(savedName, cleanedScore).then(() => {
        showOverlay(
          "Score saved",
          `${savedName} saved with ${cleanedScore} points. Best score: ${Math.floor(state.best)}.`,
          "Play Again",
          "restart"
        );
      });
      return;
    }

    if (nameLabelEl) nameLabelEl.textContent = `Top 25 score (${cleanedScore}): enter your name`;
    nameFormEl.hidden = false;
    setNameFeedback("");
    if (nameInputEl) {
      nameInputEl.value = "";
      nameInputEl.focus({ preventScroll: true });
    }
  }

  async function addLeaderboardEntry(name, score) {
    const playedAt = Date.now();
    const entry = {
      name: sanitizeName(name) || "Anonymous",
      score: Math.max(0, Math.floor(score)),
      species: normalizeSpeciesId(state.modelId),
      playedAt,
      createdAt: playedAt
    };
    if (entry.score <= 0) return false;
    if (!isNameAllowed(entry.name)) return false;

    if (GLOBAL_LEADERBOARD_URL) {
      try {
        await submitGlobalScore(entry.name, entry.score, entry.species, entry.playedAt);
        await flushPendingLeaderboard(50);
        const remoteEntries = await fetchGlobalLeaderboard();
        state.leaderboard = remoteEntries || [];
        writeLeaderboard(state.leaderboard);
        state.leaderboardMode = "global";
        setLeaderboardMeta("global");
      } catch (error) {
        if (error && error.code === "invalid_name") {
          state.leaderboardMode = "global";
          setLeaderboardMeta("global");
          return false;
        }
        enqueuePendingLeaderboardEntry(entry);
        state.leaderboard.push(entry);
        state.leaderboard = normalizeLeaderboardEntries(state.leaderboard);
        writeLeaderboard(state.leaderboard);
        state.leaderboardMode = "fallback";
        setLeaderboardMeta("fallback");
      }
    } else {
      state.leaderboard.push(entry);
      state.leaderboard = normalizeLeaderboardEntries(state.leaderboard);
      writeLeaderboard(state.leaderboard);
      state.leaderboardMode = "local";
      setLeaderboardMeta("local");
    }

    state.best = Math.max(state.best, getLeaderboardBest(state.leaderboard));
    writeBestScore(state.best);
    renderLeaderboard();
    updateHud();
    return true;
  }

  function readModelChoice() {
    try {
      const stored = String(window.localStorage.getItem(MODEL_KEY) || "").toLowerCase();
      if (stored && BACTERIA_MODELS[stored]) return stored;
    } catch {
      /* no-op */
    }
    return "ecoli";
  }

  function writeModelChoice(modelId) {
    try {
      window.localStorage.setItem(MODEL_KEY, modelId);
    } catch {
      /* no-op */
    }
  }

  function getModel(modelId) {
    return BACTERIA_MODELS[modelId] || BACTERIA_MODELS.ecoli;
  }

  function getPrecursorPool(modelId = state.modelId) {
    return MODEL_PRECURSOR_POOLS[modelId] || MODEL_PRECURSOR_POOLS.ecoli;
  }

  function getPrecursorDefinition(precursorId) {
    return ENVELOPE_PRECURSORS[precursorId] || ENVELOPE_PRECURSORS.lipidII;
  }

  function pickModelPrecursor(modelId = state.modelId) {
    const pool = getPrecursorPool(modelId);
    const totalWeight = pool.reduce((sum, entry) => sum + Math.max(0, Number(entry.weight) || 0), 0);
    if (totalWeight <= 0) return ENVELOPE_PRECURSORS.lipidII;

    let roll = Math.random() * totalWeight;
    for (let i = 0; i < pool.length; i += 1) {
      const entry = pool[i];
      roll -= Math.max(0, Number(entry.weight) || 0);
      if (roll <= 0) {
        return getPrecursorDefinition(entry.id);
      }
    }

    return getPrecursorDefinition(pool[pool.length - 1].id);
  }

  function getPrecursorLabels(modelId = state.modelId) {
    const seen = new Set();
    const labels = [];
    const pool = getPrecursorPool(modelId);

    pool.forEach((entry) => {
      const def = getPrecursorDefinition(entry.id);
      const key = def.shortLabel || def.label;
      if (seen.has(key)) return;
      seen.add(key);
      labels.push(key);
    });

    return labels;
  }

  function getPrecursorKeyEntries(modelId = state.modelId) {
    const seen = new Set();
    const entries = [];
    const pool = getPrecursorPool(modelId);

    pool.forEach((entry) => {
      const def = getPrecursorDefinition(entry.id);
      const key = def.shortLabel || def.label;
      if (seen.has(key)) return;
      seen.add(key);
      entries.push({
        label: key,
        points: Math.max(1, Math.floor(Number(def.points) || 100))
      });
    });

    return entries;
  }

  function renderPrecursorKey() {
    if (!precursorKeyListEl) return;
    const entries = getPrecursorKeyEntries(state.modelId);
    precursorKeyListEl.innerHTML = "";
    entries.forEach((entry) => {
      const li = document.createElement("li");
      const label = document.createElement("span");
      label.textContent = entry.label;
      const points = document.createElement("strong");
      points.textContent = `+${entry.points}`;
      li.append(label, points);
      precursorKeyListEl.append(li);
    });
  }

  function applyModelGeometry() {
    const model = getModel(state.modelId);
    const baseRadius = clamp(Math.round(state.height * 0.035), 15, 24);
    state.player.radius = clamp(baseRadius * model.radiusScale, 13, 27);
    state.player.length = Math.round(state.player.radius * model.lengthScale);
  }

  function updateModelUi() {
    const model = getModel(state.modelId);
    if (modelSelectEl && modelSelectEl.value !== state.modelId) {
      modelSelectEl.value = state.modelId;
    }
    if (modelNoteEl) {
      modelNoteEl.innerHTML = `${formatSpeciesAwareHtml(model.label)} · ${escapeHtml(model.morphology)} · Envelope inputs: ${escapeHtml(getPrecursorLabels(state.modelId).join(", "))}`;
    }
    renderPrecursorKey();
  }

  function setModel(modelId, persist = true) {
    const next = BACTERIA_MODELS[modelId] ? modelId : "ecoli";
    state.modelId = next;
    if (persist) writeModelChoice(next);
    applyModelGeometry();
    updateModelUi();
  }

  function capturePlayerNameForRun() {
    const proposed = sanitizeName(playerNameInputEl ? playerNameInputEl.value : state.playerName) || "Anonymous";
    if (!isNameAllowed(proposed)) {
      setPlayerNameFeedback("Name unavailable. Please choose a different name.");
      if (playerNameInputEl) {
        playerNameInputEl.focus({ preventScroll: true });
        playerNameInputEl.select();
      }
      return false;
    }

    state.playerName = proposed;
    writePlayerName(proposed);
    syncPlayerNameInput();
    setPlayerNameFeedback("");
    return true;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function random(min, max) {
    return min + Math.random() * (max - min);
  }

  function smoothstep(value) {
    const t = clamp(value, 0, 1);
    return t * t * (3 - 2 * t);
  }

  function getDifficultyProfile() {
    if (state.runMode === "tutorial") {
      const ramp = smoothstep(state.elapsed / 220);
      return {
        intensity: 0.32 + ramp * 0.48,
        phageSpeedMul: 0.5 + ramp * 0.3,
        pulseSpeedMul: 0.42 + ramp * 0.26,
        phageSpawnMul: 0.36 + ramp * 0.52,
        pulseSpawnMul: 0.34 + ramp * 0.46,
        resourceSpawnMul: 2.02 - ramp * 0.26,
        darterChance: 0.02 + ramp * 0.08,
        damageMul: 0.46 + ramp * 0.22,
        surgeCooldownMul: 2.5,
        surgeDurationMul: 0.6,
        surgeCadenceMul: 0.58
      };
    }

    const ramp = smoothstep(state.elapsed / 480);
    return {
      intensity: 0.58 + ramp * 1.82,
      phageSpeedMul: 0.82 + ramp * 0.95,
      pulseSpeedMul: 0.78 + ramp * 1.0,
      phageSpawnMul: 0.68 + ramp * 1.78,
      pulseSpawnMul: 0.64 + ramp * 1.44,
      resourceSpawnMul: 1.26 - ramp * 0.42,
      darterChance: 0.1 + ramp * 0.34,
      damageMul: 0.88 + ramp * 0.44,
      surgeCooldownMul: 1.32 - ramp * 0.44,
      surgeDurationMul: 0.9 + ramp * 0.34,
      surgeCadenceMul: 0.92 + ramp * 0.4
    };
  }

  function formatDuration(seconds) {
    const total = Math.max(0, Math.floor(seconds));
    const minutes = Math.floor(total / 60);
    const remainder = total % 60;
    return `${minutes}:${String(remainder).padStart(2, "0")}`;
  }

  function getPressureState(profile) {
    if (state.runMode === "tutorial") {
      return { label: "Tutorial", className: "envelope-pressure-calm" };
    }
    if (state.surgeTimer > 0) {
      return { label: "Surge", className: "envelope-pressure-surge" };
    }
    if (profile.intensity < 1.02) {
      return { label: "Calm", className: "envelope-pressure-calm" };
    }
    if (profile.intensity < 1.45) {
      return { label: "Ramping", className: "envelope-pressure-ramping" };
    }
    if (profile.intensity < 1.95) {
      return { label: "Strained", className: "envelope-pressure-strained" };
    }
    return { label: "Critical", className: "envelope-pressure-critical" };
  }

  function normalizeAngle(angle) {
    let next = angle;
    while (next <= -Math.PI) next += Math.PI * 2;
    while (next > Math.PI) next -= Math.PI * 2;
    return next;
  }

  function updateFlowField(dt, profile) {
    state.flowShiftIn -= dt;
    if (state.flowShiftIn <= 0) {
      const intensity = profile.intensity;
      state.flowTargetAngle = random(0, Math.PI * 2);
      state.flowTargetStrength = random(4, 22 + intensity * 10);
      state.flowShiftIn = random(6.4, 10.8) / (0.88 + intensity * 0.13);
    }

    const angleDelta = normalizeAngle(state.flowTargetAngle - state.flowAngle);
    state.flowAngle += angleDelta * dt * 1.05;
    state.flowStrength += (state.flowTargetStrength - state.flowStrength) * dt * 0.9;
    state.flowStrength = clamp(state.flowStrength, 0, 36);
  }

  function isModalOpen() {
    return modal.hasAttribute("open");
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(320, Math.round(rect.width || 960));
    const height = Math.max(180, Math.round(rect.height || 540));
    const prevWidth = state.width || width;
    const prevHeight = state.height || height;

    state.width = width;
    state.height = height;
    state.dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(state.width * state.dpr);
    canvas.height = Math.floor(state.height * state.dpr);

    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);

    if (state.player.x === 0 && state.player.y === 0) {
      placePlayerCenter();
    } else {
      applyModelGeometry();
      const xRatio = prevWidth > 0 ? state.player.x / prevWidth : 0.5;
      const yRatio = prevHeight > 0 ? state.player.y / prevHeight : 0.5;
      state.player.x = xRatio * state.width;
      state.player.y = yRatio * state.height;
      state.player.x = clamp(state.player.x, state.player.radius, state.width - state.player.radius);
      state.player.y = clamp(state.player.y, state.player.radius, state.height - state.player.radius);
    }
  }

  function placePlayerCenter() {
    applyModelGeometry();
    state.player.x = Math.round(state.width * 0.33);
    state.player.y = Math.round(state.height * 0.5);
    state.player.vx = 0;
    state.player.vy = 0;
    state.player.angle = 0;
  }

  function resetSimulation() {
    state.elapsed = 0;
    state.score = 0;
    state.integrity = 100;
    state.shield = 0;
    state.boostTimer = 0;
    state.combo = 0;
    state.invulnerable = 0;
    state.shake = 0;
    state.flowAngle = random(0, Math.PI * 2);
    state.flowTargetAngle = state.flowAngle;
    state.flowStrength = random(0, 6);
    state.flowTargetStrength = state.flowStrength;
    state.flowShiftIn = random(6.8, 10.6);
    state.phageSpawnIn = 1.45;
    state.pulseSpawnIn = 5.4;
    state.resourceSpawnIn = 1.2;
    state.surgeIn = state.runMode === "tutorial" ? 9999 : random(58, 86);
    state.surgeTimer = 0;
    state.surgePulseIn = 0.44;
    state.tutorialTipStep = 0;
    state.nearMissCooldown = 0;
    state.collapseActive = false;
    state.collapseTimer = 0;
    state.collapseRuptureAt = 0.38;
    state.collapseReleased = false;
    state.lysisPhages = [];
    state.lysisRuptures = [];
    state.lysisFragments = [];
    state.lysisShockwaves = [];
    state.phages = [];
    state.pulses = [];
    state.resources = [];
    state.bursts = [];
    state.floaters = [];
    state.trails = [];
    buildAmbientParticles();
    placePlayerCenter();
    updateHud();
  }

  function buildAmbientParticles() {
    const count = clamp(Math.round((state.width * state.height) / 15000), 36, 96);
    state.particles = Array.from({ length: count }, () => ({
      x: random(0, state.width),
      y: random(0, state.height),
      r: random(1, 3.2),
      vx: random(8, 26),
      vy: random(-6, 6),
      twinkle: random(0, Math.PI * 2)
    }));
  }

  function showOverlay(title, copy, actionText, mode) {
    overlayMode = mode;
    overlayTitle.textContent = title;
    overlayCopy.textContent = copy;
    startButton.textContent = actionText;
    if (tutorialStartButton) tutorialStartButton.hidden = mode !== "start";
    if (tutorialNoteEl) tutorialNoteEl.hidden = mode !== "start";
    overlay.classList.remove("is-hidden");
  }

  function hideOverlay() {
    overlay.classList.add("is-hidden");
  }

  function updateHud() {
    const profile = getDifficultyProfile();
    const pressure = getPressureState(profile);
    const integrityPct = clamp(state.integrity, 0, 100);
    const shieldPct = clamp(state.shield, 0, 100);
    const boostPct = clamp((state.boostTimer / 7.2) * 100, 0, 100);

    if (scoreEl) scoreEl.textContent = String(Math.floor(state.score));
    if (bestEl) bestEl.textContent = String(Math.floor(state.best));
    if (timeEl) timeEl.textContent = formatDuration(state.elapsed);
    if (pressureEl) {
      pressureEl.textContent = pressure.label;
      pressureEl.classList.remove(
        "envelope-pressure-calm",
        "envelope-pressure-ramping",
        "envelope-pressure-strained",
        "envelope-pressure-critical",
        "envelope-pressure-surge"
      );
      pressureEl.classList.add(pressure.className);
    }
    if (integrityEl) integrityEl.textContent = `${Math.floor(integrityPct)}%`;
    if (shieldEl) shieldEl.textContent = `${Math.floor(shieldPct)}%`;
    if (boostEl) boostEl.textContent = `${Math.floor(boostPct)}%`;
    if (integrityBarEl) integrityBarEl.style.width = `${integrityPct.toFixed(1)}%`;
    if (shieldBarEl) shieldBarEl.style.width = `${shieldPct.toFixed(1)}%`;
    if (boostBarEl) boostBarEl.style.width = `${boostPct.toFixed(1)}%`;
  }

  function pointerToWorld(event) {
    const rect = canvas.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    pointer.x = clamp(px * state.width, 0, state.width);
    pointer.y = clamp(py * state.height, 0, state.height);
  }

  function openModal() {
    if (isModalOpen()) return;

    if (typeof modal.showModal === "function") {
      modal.showModal();
    } else {
      modal.setAttribute("open", "");
    }

    resizeCanvas();
    resetSimulation();
    hideNameForm();
        state.runMode = "ranked";
    state.running = false;
    state.paused = false;
    pauseButton.textContent = "Pause";
    setLeaderboardMeta(state.leaderboardMode === "global" ? "global" : "local");
    renderLeaderboard();
    refreshLeaderboardFromSource();
    updateModelUi();
    syncPlayerNameInput();
    setPlayerNameFeedback("");
    updateTutorialNote();

    showOverlay(
      "Envelope Escape",
      "Guide your bacterium through phage attacks and antibiotic waves. Collect species-specific envelope precursors, shields, and catalytic boosts to stay intact.",
      "Start Run",
      "start"
    );

    ensureLoop();
  }

  function closeModal() {
    if (typeof modal.close === "function") {
      modal.close();
    } else {
      modal.removeAttribute("open");
    }

    state.running = false;
    state.paused = false;
    resetInputState();
    hideNameForm();
    
    if (rafId !== null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function startSimulation(mode = state.runMode || "ranked") {
    state.runMode = mode === "tutorial" ? "tutorial" : "ranked";
    if (state.runMode === "tutorial") {
      state.tutorialSeen = true;
      writeTutorialSeen(true);
      updateTutorialNote();
    }

    resetSimulation();
    hideNameForm();
        state.running = true;
    state.paused = false;
    pauseButton.textContent = "Pause";
    hideOverlay();
    lastFrame = performance.now();
    if (state.runMode === "tutorial") {
      addFloater(state.width * 0.5, 54, "Tutorial mode: scores are not ranked.", "#c9f5ff");
    }
    ensureLoop();
  }

  function resumeSimulation() {
    state.paused = false;
    pauseButton.textContent = "Pause";
    hideOverlay();
    lastFrame = performance.now();
    ensureLoop();
  }

  function pauseSimulation() {
    if (!state.running) return;
    state.paused = true;
    pauseButton.textContent = "Resume";
    showOverlay(
      "Paused",
      "Dodge phages and antibiotic waves, then collect precursors to rebuild your envelope.",
      "Resume",
      "resume"
    );
  }

  function endSimulation() {
    state.running = false;
    state.paused = false;
    pauseButton.textContent = "Pause";
    const finalScore = Math.floor(state.score);
    const savedName = state.playerName || "Anonymous";

    if (state.runMode === "tutorial") {
      hideNameForm();
      showOverlay(
        "Tutorial complete",
        `Tutorial score: ${finalScore}. Tutorial runs are practice only and are not submitted to the leaderboard.`,
        "Start Ranked Run",
        "start"
      );
      state.runMode = "ranked";
      updateHud();
      renderLeaderboard();
      return;
    }

    if (finalScore > state.best) {
      state.best = finalScore;
      writeBestScore(state.best);
    }

    updateHud();
    renderLeaderboard();

    hideNameForm();

    showOverlay(
      "Envelope collapsed",
      `Final score: ${finalScore}. Best score: ${Math.floor(state.best)}. Saving to leaderboard...`,
      "Play Again",
      "restart"
    );

    if (finalScore <= 0) {
      showOverlay(
        "Envelope collapsed",
        `Final score: ${finalScore}. Best score: ${Math.floor(state.best)}.`,
        "Play Again",
        "restart"
      );
      return;
    }

    addLeaderboardEntry(savedName, finalScore).then(async (accepted) => {
      if (state.running || state.collapseActive) return;
      if (accepted) {
        showOverlay(
          "Envelope collapsed",
          `Final score: ${finalScore}. Best score: ${Math.floor(state.best)}. Saved as ${savedName}.`,
          "Play Again",
          "restart"
        );
        return;
      }

      if (savedName !== "Anonymous") {
        await addLeaderboardEntry("Anonymous", finalScore);
        if (state.running || state.collapseActive) return;
        showOverlay(
          "Envelope collapsed",
          `Final score: ${finalScore}. Best score: ${Math.floor(state.best)}. Saved as Anonymous.`,
          "Play Again",
          "restart"
        );
        return;
      }

      showOverlay(
        "Envelope collapsed",
        `Final score: ${finalScore}. Best score: ${Math.floor(state.best)}.`,
        "Play Again",
        "restart"
      );
    });
  }

  function spawnPhage(kind = "hunter") {
    const margin = 48;
    const edge = Math.floor(Math.random() * 4);
    let x = 0;
    let y = 0;

    if (edge === 0) {
      x = -margin;
      y = random(0, state.height);
    } else if (edge === 1) {
      x = state.width + margin;
      y = random(0, state.height);
    } else if (edge === 2) {
      x = random(0, state.width);
      y = -margin;
    } else {
      x = random(0, state.width);
      y = state.height + margin;
    }

    const profile = getDifficultyProfile();
    const baseSpeed = random(70, 96) * profile.phageSpeedMul + profile.intensity * 7;
    const isDarter = kind === "darter";
    const speed = isDarter ? baseSpeed * random(1.12, 1.27) : baseSpeed;
    const angle = Math.atan2(state.player.y - y, state.player.x - x) + random(-0.35, 0.35);

    state.phages.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: isDarter ? random(9, 12.5) : random(11, 16),
      spin: random(-2.4, 2.4),
      rot: random(0, Math.PI * 2),
      wobble: random(0, Math.PI * 2),
      wobbleAmp: isDarter ? random(2, 8) : random(4, 12),
      kind,
      nearScored: false
    });
  }

  function spawnPulse() {
    const profile = getDifficultyProfile();
    const margin = 64;
    state.pulses.push({
      x: random(margin, state.width - margin),
      y: random(margin, state.height - margin),
      r: random(10, 26),
      thickness: random(11, 16),
      speed: (random(68, 98) * profile.pulseSpeedMul + profile.intensity * 9) * (state.surgeTimer > 0 ? 1.08 : 1),
      maxR: Math.max(state.width, state.height) * random(0.52, 0.82),
      hitLock: 0,
      nearScored: false
    });
  }

  function spawnResource() {
    const kindRoll = Math.random();
    let kind = "precursor";
    if (kindRoll < 0.14) kind = "shield";
    else if (kindRoll > 0.86) kind = "boost";
    const precursor = kind === "precursor" ? pickModelPrecursor(state.modelId) : null;

    state.resources.push({
      x: random(30, state.width - 30),
      y: random(30, state.height - 30),
      r: kind === "shield" ? 12 : kind === "boost" ? 11 : precursor?.coreShape === "capsule" ? 11 : 10,
      kind,
      precursor,
      phase: random(0, Math.PI * 2),
      life: 0
    });
  }

  function addBurst(x, y, color, amount = 14) {
    for (let i = 0; i < amount; i += 1) {
      const angle = random(0, Math.PI * 2);
      const speed = random(28, 180);
      state.bursts.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: random(0.24, 0.62),
        maxLife: random(0.24, 0.62),
        color,
        size: random(1.6, 4.8)
      });
    }
  }

  function addFloater(x, y, text, color) {
    state.floaters.push({
      x,
      y,
      text,
      color,
      life: 1.2,
      maxLife: 1.2
    });
  }

  function spawnPhageSwarm(count) {
    for (let i = 0; i < count; i += 1) {
      const kind = Math.random() < 0.45 ? "darter" : "hunter";
      spawnPhage(kind);
    }
  }

  function triggerPressureSurge() {
    if (state.runMode === "tutorial") {
      state.surgeIn = 9999;
      return;
    }
    const profile = getDifficultyProfile();
    state.surgeTimer = random(4.8, 7.1) * profile.surgeDurationMul;
    state.surgePulseIn = random(0.28, 0.44) / profile.surgeCadenceMul;
    state.surgeIn = random(16, 24) * profile.surgeCooldownMul;
    state.shake = Math.max(state.shake, 6.5);
    addFloater(state.width * 0.5, 48, "Phage surge", "#98f0ff");
    addBurst(state.width * 0.5, 62, "#8eefff", 20);
    const swarmSize = 2 + Math.floor(state.elapsed / 85) + Math.round(profile.intensity * 0.65);
    spawnPhageSwarm(clamp(swarmSize, 2, 9));
  }

  function maybeShowTutorialHints() {
    if (state.runMode !== "tutorial") return;

    const hints = [
      { at: 1.2, text: "Collect precursors to rebuild your envelope." },
      { at: 6.2, text: "Avoid phages and pink antibiotic waves." },
      { at: 12.2, text: "Blue shields absorb incoming damage." },
      { at: 18.2, text: "Catalytic boosts raise speed and score gain." }
    ];

    while (state.tutorialTipStep < hints.length && state.elapsed >= hints[state.tutorialTipStep].at) {
      const hint = hints[state.tutorialTipStep];
      addFloater(state.width * 0.5, 62 + state.tutorialTipStep * 8, hint.text, "#bdefff");
      state.tutorialTipStep += 1;
    }
  }

  function localToWorldPoint(originX, originY, angle, localX, localY) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: originX + localX * cos - localY * sin,
      y: originY + localX * sin + localY * cos
    };
  }

  function buildLysisRuptures(model) {
    const isRound = model.shape === "coccus" || model.shape === "diplococcus";
    const count = prefersReducedMotion ? (isRound ? 2 : 3) : isRound ? 4 : 5;
    const ruptures = [];

    for (let i = 0; i < count; i += 1) {
      if (isRound) {
        const theta = (Math.PI * 2 * i) / count + random(-0.26, 0.26);
        const radius = random(0.38, 0.62);
        ruptures.push({
          xRatio: Math.cos(theta) * radius,
          yRatio: Math.sin(theta) * radius,
          size: random(2.2, 4.2),
          crackAngle: theta + random(-0.3, 0.3)
        });
      } else {
        const t = count === 1 ? 0 : i / (count - 1);
        const xRatio = -0.56 + t * 1.12 + random(-0.08, 0.08);
        const yBase = i % 2 === 0 ? -0.38 : 0.38;
        ruptures.push({
          xRatio,
          yRatio: yBase + random(-0.12, 0.12),
          size: random(2.2, 4.6),
          crackAngle: random(-1.15, 1.15)
        });
      }
    }

    return ruptures;
  }

  function ruptureWorldPoint(site) {
    return localToWorldPoint(
      state.player.x,
      state.player.y,
      state.player.angle,
      site.xRatio * state.player.length * 0.44,
      site.yRatio * state.player.radius * 0.95
    );
  }

  function triggerRuptureBurstEffect(model) {
    if (state.collapseReleased) return;
    state.collapseReleased = true;
    state.shake = Math.max(state.shake, 22);

    const fragmentPool = prefersReducedMotion ? 18 : 34;
    const colorA = model?.palette?.membraneB || "#9af9ff";
    const colorB = model?.palette?.membraneC || "#6ae7ee";

    state.lysisRuptures.forEach((site) => {
      const point = ruptureWorldPoint(site);

      state.lysisShockwaves.push({
        x: point.x,
        y: point.y,
        r: state.player.radius * 0.2,
        maxR: state.player.radius * random(2.8, 4.2),
        thickness: random(2.8, 4.2),
        life: random(0.34, 0.56),
        maxLife: random(0.34, 0.56)
      });

      addBurst(point.x, point.y, "#ff9fc9", 10);
      addBurst(point.x, point.y, "#9af2ff", 8);

      const fragCount = Math.max(3, Math.floor(fragmentPool / Math.max(1, state.lysisRuptures.length)));
      for (let i = 0; i < fragCount; i += 1) {
        const theta = Math.atan2(site.yRatio, site.xRatio) + state.player.angle + random(-0.75, 0.75);
        const speed = random(70, 250);
        state.lysisFragments.push({
          x: point.x + random(-2.4, 2.4),
          y: point.y + random(-2.4, 2.4),
          vx: Math.cos(theta) * speed,
          vy: Math.sin(theta) * speed,
          angle: random(0, Math.PI * 2),
          spin: random(-9.5, 9.5),
          length: random(4.6, 10.2),
          width: random(1.8, 3.6),
          life: random(0.52, 1.2),
          maxLife: random(0.52, 1.2),
          color: Math.random() < 0.5 ? colorA : colorB
        });
      }
    });
  }

  function triggerLysisSequence() {
    if (state.collapseActive) return;

    const model = getModel(state.modelId);
    state.collapseActive = true;
    state.collapseTimer = 0;
    state.collapseRuptureAt = prefersReducedMotion ? 0.28 : 0.38;
    state.collapseReleased = false;
    state.running = false;
    state.paused = false;
    pauseButton.textContent = "Pause";
    state.invulnerable = 0;
    state.shield = 0;
    state.shake = 14;
    state.phages = [];
    state.pulses = [];
    state.resources = [];
    state.trails = [];
    state.lysisFragments = [];
    state.lysisShockwaves = [];
    state.lysisRuptures = buildLysisRuptures(model);

    const sourceX = state.player.x;
    const sourceY = state.player.y;
    const releaseCount = prefersReducedMotion ? 28 : 68;
    state.lysisPhages = Array.from({ length: releaseCount }, () => {
      const site = state.lysisRuptures[Math.floor(random(0, state.lysisRuptures.length))];
      const localX = site.xRatio * state.player.length * 0.44 + random(-2.4, 2.4);
      const localY = site.yRatio * state.player.radius * 0.95 + random(-2.4, 2.4);
      const spawn = localToWorldPoint(sourceX, sourceY, state.player.angle, localX, localY);
      const theta = Math.atan2(localY, localX) + state.player.angle + random(-0.6, 0.6);
      const speed = random(52, 240);
      return {
        x: spawn.x,
        y: spawn.y,
        vx: Math.cos(theta) * speed,
        vy: Math.sin(theta) * speed,
        r: random(2.6, 5.4),
        spin: random(-4, 4),
        rot: random(0, Math.PI * 2),
        wobble: random(0, Math.PI * 2),
        wobbleAmp: random(0.6, 2.2),
        launch: random(0.1, 0.28),
        delay: state.collapseRuptureAt + random(0.02, prefersReducedMotion ? 0.42 : 0.94),
        released: false,
        kind: Math.random() < 0.34 ? "darter" : "hunter",
        life: random(1.8, 3.2),
        maxLife: random(1.8, 3.2)
      };
    });

    addFloater(sourceX, sourceY - 34, "Cell lysis", "#ffafcb");
    addBurst(sourceX, sourceY, "#ff8cb2", 26);
    addBurst(sourceX, sourceY, "#9ef7ff", 22);
    updateHud();
  }

  function updateLysisSequence(dt) {
    state.collapseTimer += dt;
    const model = getModel(state.modelId);

    if (!state.collapseReleased && state.collapseTimer >= state.collapseRuptureAt) {
      triggerRuptureBurstEffect(model);
    }

    for (let i = state.lysisPhages.length - 1; i >= 0; i -= 1) {
      const phage = state.lysisPhages[i];
      phage.delay -= dt;
      phage.rot += phage.spin * dt;
      phage.wobble += dt * 9;

      if (phage.delay > 0) {
        phage.x += Math.cos(phage.wobble) * phage.wobbleAmp * 0.08;
        phage.y += Math.sin(phage.wobble) * phage.wobbleAmp * 0.08;
        continue;
      }

      if (!phage.released) {
        phage.released = true;
        if (Math.random() < 0.44) addBurst(phage.x, phage.y, "#ffd2e5", 4);
      }

      phage.life -= dt;
      if (phage.launch > 0) {
        phage.vx *= 1.028;
        phage.vy *= 1.028;
        phage.launch -= dt;
      }
      phage.x += phage.vx * dt + Math.cos(phage.wobble) * phage.wobbleAmp;
      phage.y += phage.vy * dt + Math.sin(phage.wobble) * phage.wobbleAmp;
      phage.vx *= 0.986;
      phage.vy *= 0.986;
      if (phage.life <= 0) state.lysisPhages.splice(i, 1);
    }

    for (let i = state.lysisShockwaves.length - 1; i >= 0; i -= 1) {
      const wave = state.lysisShockwaves[i];
      wave.life -= dt;
      wave.r += (wave.maxR / wave.maxLife) * dt;
      if (wave.life <= 0 || wave.r >= wave.maxR) state.lysisShockwaves.splice(i, 1);
    }

    for (let i = state.lysisFragments.length - 1; i >= 0; i -= 1) {
      const fragment = state.lysisFragments[i];
      fragment.life -= dt;
      fragment.x += fragment.vx * dt;
      fragment.y += fragment.vy * dt;
      fragment.vx *= 0.973;
      fragment.vy *= 0.973;
      fragment.angle += fragment.spin * dt;
      if (fragment.life <= 0) state.lysisFragments.splice(i, 1);
    }

    for (let i = state.bursts.length - 1; i >= 0; i -= 1) {
      const burst = state.bursts[i];
      burst.life -= dt;
      burst.x += burst.vx * dt;
      burst.y += burst.vy * dt;
      burst.vx *= 0.97;
      burst.vy *= 0.97;
      if (burst.life <= 0) state.bursts.splice(i, 1);
    }

    for (let i = state.floaters.length - 1; i >= 0; i -= 1) {
      const floater = state.floaters[i];
      floater.life -= dt;
      floater.y -= 24 * dt;
      if (floater.life <= 0) state.floaters.splice(i, 1);
    }

    if (state.collapseReleased && state.collapseTimer > state.collapseRuptureAt && state.collapseTimer < 1.5) {
      if (Math.random() < dt * 11) {
        addBurst(
          state.player.x + random(-18, 18),
          state.player.y + random(-18, 18),
          Math.random() < 0.5 ? "#ff8cb2" : "#95f3ff",
          8
        );
      }
    }

    if (state.collapseTimer >= state.collapseDuration) {
      state.collapseActive = false;
      endSimulation();
    }
  }

  function applyDamage(amount, label) {
    if (state.collapseActive || state.invulnerable > 0) return;
    const profile = getDifficultyProfile();
    const scaledAmount = amount * profile.damageMul;

    if (state.shield > 0) {
      const absorbed = Math.min(state.shield, scaledAmount * 1.2);
      state.shield = Math.max(0, state.shield - absorbed);
      addFloater(state.player.x, state.player.y - 26, "Shield absorbed", "#7deaf2");
      addBurst(state.player.x, state.player.y, "#7deaf2", 10);
    } else {
      state.integrity -= scaledAmount;
      addFloater(state.player.x, state.player.y - 26, label, "#ff9db5");
      addBurst(state.player.x, state.player.y, "#ff7b9b", 12);
    }

    state.invulnerable = 0.42;
    state.shake = 9;
    state.combo = 0;
  }

  function collectResource(resource, index) {
    if (resource.kind === "shield") {
      state.shield = clamp(state.shield + 42, 0, 100);
      state.integrity = clamp(state.integrity + 5, 0, 100);
      state.score += 190 + state.combo * 12;
      addFloater(resource.x, resource.y, "SigmaE shield", "#86f5ff");
      addBurst(resource.x, resource.y, "#86f5ff", 16);
    } else if (resource.kind === "boost") {
      state.boostTimer = clamp(state.boostTimer + 7.2, 0, 12);
      state.score += 140 + state.combo * 14;
      addFloater(resource.x, resource.y, "Catalytic boost", "#c3dcff");
      addBurst(resource.x, resource.y, "#b9d5ff", 16);
    } else {
      const precursor = resource.precursor || ENVELOPE_PRECURSORS.lipidII;
      const precursorPoints = Math.max(1, Math.floor(Number(precursor.points) || 100));
      state.integrity = clamp(state.integrity + 8, 0, 100);
      state.score += precursorPoints + state.combo * 16;
      addFloater(
        resource.x,
        resource.y,
        `+${precursor.shortLabel} +${precursorPoints}${state.combo > 0 ? ` x${state.combo + 1}` : ""}`,
        precursor.floaterColor || "#b2ffd6"
      );
      addBurst(resource.x, resource.y, precursor.burstColor || "#89ffca", 12);
    }

    state.combo = clamp(state.combo + 1, 0, 12);
    state.resources.splice(index, 1);
  }

  function updatePlayer(dt) {
    const moveSpeedBase = clamp(state.height * 0.68, 210, 360);
    const boostFactor = state.boostTimer > 0 ? 1.32 : 1;
    const moveSpeed = moveSpeedBase * boostFactor;
    const flowX = Math.cos(state.flowAngle) * state.flowStrength;
    const flowY = Math.sin(state.flowAngle) * state.flowStrength;
    let inputX = 0;
    let inputY = 0;

    if (keys.left) inputX -= 1;
    if (keys.right) inputX += 1;
    if (keys.up) inputY -= 1;
    if (keys.down) inputY += 1;

    if (pointer.active) {
      const dx = pointer.x - state.player.x;
      const dy = pointer.y - state.player.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 6) {
        inputX += dx / dist;
        inputY += dy / dist;
      }
    }

    const mag = Math.hypot(inputX, inputY) || 1;
    const desiredVx = (inputX / mag) * moveSpeed;
    const desiredVy = (inputY / mag) * moveSpeed;

    state.player.vx += (desiredVx - state.player.vx) * 8.4 * dt;
    state.player.vy += (desiredVy - state.player.vy) * 8.4 * dt;

    state.player.x += (state.player.vx + flowX * 0.72) * dt;
    state.player.y += (state.player.vy + flowY * 0.72) * dt;

    state.player.x = clamp(state.player.x, state.player.radius, state.width - state.player.radius);
    state.player.y = clamp(state.player.y, state.player.radius, state.height - state.player.radius);

    if (Math.hypot(state.player.vx, state.player.vy) > 1) {
      state.player.angle = Math.atan2(state.player.vy, state.player.vx);
    }
  }

  function updateSimulation(dt) {
    state.elapsed += dt;
    const profile = getDifficultyProfile();
    maybeShowTutorialHints();
    updateFlowField(dt, profile);
    const surgeStrength = state.surgeTimer > 0 ? 1.35 : 1;
    const boostScoreMul = state.boostTimer > 0 ? 1.22 : 1;
    state.score += dt * (16 + state.elapsed * 0.22 + state.combo * 0.8) * surgeStrength * boostScoreMul;

    state.invulnerable = Math.max(0, state.invulnerable - dt);
    state.shake = Math.max(0, state.shake - dt * 22);
    state.shield = Math.max(0, state.shield - dt * 1.8);
    state.boostTimer = Math.max(0, state.boostTimer - dt);
    state.nearMissCooldown = Math.max(0, state.nearMissCooldown - dt);

    state.surgeIn -= dt;
    if (state.surgeIn <= 0 && !state.collapseActive) {
      triggerPressureSurge();
    }
    if (state.surgeTimer > 0) {
      state.surgeTimer = Math.max(0, state.surgeTimer - dt);
      state.surgePulseIn -= dt;
      if (state.surgePulseIn <= 0) {
        const surgeDarterChance = clamp(profile.darterChance + 0.16, 0.2, 0.72);
        spawnPhage(Math.random() < surgeDarterChance ? "darter" : "hunter");
        state.surgePulseIn = random(0.24, 0.42) / profile.surgeCadenceMul;
      }
    }

    updatePlayer(dt);
    state.trails.push({
      x: state.player.x,
      y: state.player.y,
      angle: state.player.angle,
      life: 0.5,
      maxLife: 0.5
    });
    if (state.trails.length > 28) state.trails.shift();

    for (let i = state.trails.length - 1; i >= 0; i -= 1) {
      const trail = state.trails[i];
      trail.life -= dt;
      if (trail.life <= 0) state.trails.splice(i, 1);
    }

    const pulsePressure = state.surgeTimer > 0 ? 0.78 : 1;
    const phagePressure = state.surgeTimer > 0 ? 0.66 : 1;
    const flowX = Math.cos(state.flowAngle) * state.flowStrength;
    const flowY = Math.sin(state.flowAngle) * state.flowStrength;

    state.phageSpawnIn -= dt;
    state.pulseSpawnIn -= dt;
    state.resourceSpawnIn -= dt;

    if (state.phageSpawnIn <= 0) {
      const kind = Math.random() < profile.darterChance ? "darter" : "hunter";
      spawnPhage(kind);
      state.phageSpawnIn = clamp((random(1.18, 2.15) / profile.phageSpawnMul) * phagePressure, 0.26, 2.4);
    }

    if (state.pulseSpawnIn <= 0) {
      spawnPulse();
      state.pulseSpawnIn = clamp((random(3.6, 6.2) / profile.pulseSpawnMul) * pulsePressure, 1.05, 6.6);
    }

    if (state.resourceSpawnIn <= 0) {
      spawnResource();
      state.resourceSpawnIn = clamp(random(0.95, 1.65) / profile.resourceSpawnMul, 0.72, 1.95);
    }

    state.particles.forEach((particle) => {
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.twinkle += dt * random(0.2, 0.55);

      if (particle.x > state.width + 10) particle.x = -8;
      if (particle.y > state.height + 10) particle.y = -8;
      if (particle.y < -10) particle.y = state.height + 8;
    });

    for (let i = state.phages.length - 1; i >= 0; i -= 1) {
      const phage = state.phages[i];
      const targetAngle = Math.atan2(state.player.y - phage.y, state.player.x - phage.x);
      const phageSteer = phage.kind === "darter" ? 0.56 : 0.4;
      const steer = phageSteer * dt;
      const currentAngle = Math.atan2(phage.vy, phage.vx);
      const newAngle = currentAngle + clamp(targetAngle - currentAngle, -steer, steer);
      const speed = Math.hypot(phage.vx, phage.vy);
      const accel = phage.kind === "darter" ? 1.015 : 1.004;

      phage.vx = Math.cos(newAngle) * speed * accel;
      phage.vy = Math.sin(newAngle) * speed * accel;
      phage.wobble += dt * 6;
      phage.rot += phage.spin * dt;
      const flowDrift = phage.kind === "darter" ? 0.2 : 0.28;
      phage.x += phage.vx * dt + Math.cos(phage.wobble) * phage.wobbleAmp * dt + flowX * dt * flowDrift;
      phage.y += phage.vy * dt + Math.sin(phage.wobble) * phage.wobbleAmp * dt + flowY * dt * flowDrift;

      if (phage.x < -90 || phage.x > state.width + 90 || phage.y < -90 || phage.y > state.height + 90) {
        state.phages.splice(i, 1);
        continue;
      }

      const dist = Math.hypot(phage.x - state.player.x, phage.y - state.player.y);
      if (dist < phage.r + state.player.radius * 0.8) {
        applyDamage(17, "Phage impact");
        state.phages.splice(i, 1);
        continue;
      }

      const nearBand = phage.r + state.player.radius * 1.15;
      if (!phage.nearScored && dist < nearBand && state.nearMissCooldown <= 0) {
        phage.nearScored = true;
        state.nearMissCooldown = 0.18;
        const nearBonus = 24 + state.combo * 4;
        state.score += nearBonus;
        addFloater(phage.x, phage.y - 12, `Near miss +${nearBonus}`, "#9eeeff");
        addBurst(phage.x, phage.y, "#8cefff", 8);
      }
    }

    for (let i = state.pulses.length - 1; i >= 0; i -= 1) {
      const pulse = state.pulses[i];
      pulse.r += pulse.speed * dt;
      pulse.hitLock = Math.max(0, pulse.hitLock - dt);
      pulse.x = clamp(pulse.x + flowX * dt * 0.05, 24, state.width - 24);
      pulse.y = clamp(pulse.y + flowY * dt * 0.05, 24, state.height - 24);

      const dist = Math.hypot(pulse.x - state.player.x, pulse.y - state.player.y);
      const ringGap = Math.abs(dist - pulse.r);
      if (ringGap < pulse.thickness + state.player.radius * 0.15 && pulse.hitLock <= 0) {
        applyDamage(12, "Antibiotic pulse");
        pulse.hitLock = 0.46;
      }

      if (!pulse.nearScored && ringGap < pulse.thickness + state.player.radius * 1.25 && ringGap > pulse.thickness + state.player.radius * 0.28) {
        pulse.nearScored = true;
        const pulseBonus = 18 + state.combo * 3;
        state.score += pulseBonus;
        addFloater(state.player.x, state.player.y - 28, `Tight dodge +${pulseBonus}`, "#b0d8ff");
      }

      if (pulse.r > pulse.maxR) {
        state.pulses.splice(i, 1);
      }
    }

    for (let i = state.resources.length - 1; i >= 0; i -= 1) {
      const resource = state.resources[i];
      resource.life += dt;
      resource.phase += dt * 2.8;
      resource.y += Math.sin(resource.phase) * 7 * dt;
      resource.x = clamp(resource.x + flowX * dt * 0.08, 22, state.width - 22);

      if (resource.life > 15) {
        state.resources.splice(i, 1);
        continue;
      }

      const dist = Math.hypot(resource.x - state.player.x, resource.y - state.player.y);
      if (dist < resource.r + state.player.radius * 0.72) {
        collectResource(resource, i);
      }
    }

    for (let i = state.bursts.length - 1; i >= 0; i -= 1) {
      const burst = state.bursts[i];
      burst.life -= dt;
      burst.x += burst.vx * dt;
      burst.y += burst.vy * dt;
      burst.vx *= 0.97;
      burst.vy *= 0.97;
      if (burst.life <= 0) state.bursts.splice(i, 1);
    }

    for (let i = state.floaters.length - 1; i >= 0; i -= 1) {
      const floater = state.floaters[i];
      floater.life -= dt;
      floater.y -= 24 * dt;
      if (floater.life <= 0) state.floaters.splice(i, 1);
    }

    if (state.integrity <= 0) {
      state.integrity = 0;
      triggerLysisSequence();
    }

    updateHud();
  }

  function drawBackground(time) {
    const t = time * 0.001;
    const gradient = ctx.createLinearGradient(0, 0, state.width, state.height);
    gradient.addColorStop(0, "#040c18");
    gradient.addColorStop(0.42, "#08243d");
    gradient.addColorStop(1, "#0e3958");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, state.width, state.height);

    const bloomFields = [
      { x: 0.18, y: 0.2, r: 0.46, c0: "rgba(94, 199, 215, 0.21)", c1: "rgba(94, 199, 215, 0)" },
      { x: 0.78, y: 0.28, r: 0.38, c0: "rgba(90, 130, 255, 0.17)", c1: "rgba(90, 130, 255, 0)" },
      { x: 0.66, y: 0.78, r: 0.44, c0: "rgba(113, 246, 196, 0.13)", c1: "rgba(113, 246, 196, 0)" }
    ];

    bloomFields.forEach((field, index) => {
      const px = state.width * field.x + Math.cos(t * (0.12 + index * 0.05)) * 26;
      const py = state.height * field.y + Math.sin(t * (0.16 + index * 0.03)) * 22;
      const radius = Math.max(state.width, state.height) * field.r;
      const bloom = ctx.createRadialGradient(px, py, radius * 0.06, px, py, radius);
      bloom.addColorStop(0, field.c0);
      bloom.addColorStop(1, field.c1);
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, state.width, state.height);
    });

    if (state.surgeTimer > 0) {
      const pulse = 0.48 + 0.52 * Math.sin(time * 0.02);
      const surgeAlpha = clamp(state.surgeTimer / 8, 0, 1) * 0.24 * pulse;
      const surgeGlow = ctx.createRadialGradient(
        state.width * 0.5,
        state.height * 0.5,
        state.height * 0.12,
        state.width * 0.5,
        state.height * 0.5,
        state.width * 0.74
      );
      surgeGlow.addColorStop(0, `rgba(255, 148, 195, ${(surgeAlpha * 0.7).toFixed(3)})`);
      surgeGlow.addColorStop(1, "rgba(255, 148, 195, 0)");
      ctx.fillStyle = surgeGlow;
      ctx.fillRect(0, 0, state.width, state.height);
    }

    ctx.save();
    ctx.globalAlpha = 0.21;
    ctx.strokeStyle = "rgba(132, 204, 213, 0.2)";
    ctx.lineWidth = 1;

    const spacing = 32;
    const offset = (time * 0.015) % spacing;
    for (let x = -spacing; x < state.width + spacing; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x + offset, 0);
      ctx.lineTo(x + offset + state.height * 0.08, state.height);
      ctx.stroke();
    }

    ctx.globalAlpha = 0.16;
    const yOffset = (time * 0.008) % spacing;
    for (let y = -spacing; y < state.height + spacing; y += spacing) {
      ctx.beginPath();
      ctx.moveTo(0, y + yOffset);
      ctx.lineTo(state.width, y + yOffset);
      ctx.stroke();
    }
    ctx.restore();

    if (state.flowStrength > 1.5) {
      const flowAlpha = clamp(state.flowStrength / 36, 0, 1) * 0.26;
      const dx = Math.cos(state.flowAngle);
      const dy = Math.sin(state.flowAngle);
      ctx.save();
      ctx.strokeStyle = `rgba(178, 240, 252, ${flowAlpha.toFixed(3)})`;
      ctx.lineWidth = 1.2;
      ctx.lineCap = "round";
      for (let i = 0; i < 14; i += 1) {
        const px = ((i * 97 + time * (0.015 + i * 0.00025) * state.flowStrength) % (state.width + 140)) - 70;
        const py = ((i * 61 + time * (0.011 + i * 0.0002) * state.flowStrength) % (state.height + 140)) - 70;
        const len = 16 + flowAlpha * 26 + (i % 4) * 3;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + dx * len, py + dy * len);
        ctx.stroke();
      }
      ctx.restore();
    }

    if (state.boostTimer > 0) {
      const boostAlpha = clamp(state.boostTimer / 8, 0, 1) * (0.17 + Math.sin(time * 0.014) * 0.04);
      const boostGlow = ctx.createRadialGradient(
        state.player.x,
        state.player.y,
        state.player.radius * 0.4,
        state.player.x,
        state.player.y,
        state.player.radius * 7.4
      );
      boostGlow.addColorStop(0, `rgba(185, 218, 255, ${(boostAlpha * 0.88).toFixed(3)})`);
      boostGlow.addColorStop(1, "rgba(185, 218, 255, 0)");
      ctx.fillStyle = boostGlow;
      ctx.beginPath();
      ctx.arc(state.player.x, state.player.y, state.player.radius * 7.4, 0, Math.PI * 2);
      ctx.fill();
    }

    state.particles.forEach((particle) => {
      const alpha = 0.12 + 0.16 * (0.5 + 0.5 * Math.sin(particle.twinkle));
      const glow = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.r * 3.4);
      glow.addColorStop(0, `rgba(188, 244, 248, ${(alpha * 0.9).toFixed(3)})`);
      glow.addColorStop(1, "rgba(188, 244, 248, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.r * 3.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(150, 227, 233, ${(alpha + 0.08).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, Math.max(0.8, particle.r * 0.62), 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawPulse(pulse) {
    const ringAlpha = clamp(0.5 - pulse.r / (pulse.maxR * 1.2), 0.08, 0.44);
    const bloom = ctx.createRadialGradient(pulse.x, pulse.y, pulse.r * 0.75, pulse.x, pulse.y, pulse.r + pulse.thickness * 3);
    bloom.addColorStop(0, "rgba(255, 135, 175, 0)");
    bloom.addColorStop(1, `rgba(255, 144, 184, ${(ringAlpha * 0.34).toFixed(3)})`);
    ctx.fillStyle = bloom;
    ctx.beginPath();
    ctx.arc(pulse.x, pulse.y, pulse.r + pulse.thickness * 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = `rgba(255, 133, 167, ${(ringAlpha * 1.05).toFixed(3)})`;
    ctx.lineWidth = pulse.thickness * 1.05;
    ctx.beginPath();
    ctx.arc(pulse.x, pulse.y, pulse.r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = `rgba(168, 228, 255, ${(ringAlpha * 0.9).toFixed(3)})`;
    ctx.lineWidth = Math.max(2, pulse.thickness * 0.34);
    ctx.beginPath();
    ctx.arc(pulse.x, pulse.y, pulse.r, 0, Math.PI * 2);
    ctx.stroke();
  }

  function drawPhage(phage) {
    ctx.save();
    ctx.translate(phage.x, phage.y);
    ctx.rotate(phage.rot);
    const isDarter = phage.kind === "darter";

    const glow = ctx.createRadialGradient(0, 0, phage.r * 0.2, 0, 0, phage.r * 2.6);
    glow.addColorStop(0, isDarter ? "rgba(255, 178, 213, 0.44)" : "rgba(162, 247, 255, 0.42)");
    glow.addColorStop(1, isDarter ? "rgba(255, 178, 213, 0)" : "rgba(162, 247, 255, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, phage.r * 2.6, 0, Math.PI * 2);
    ctx.fill();

    const headGradient = ctx.createRadialGradient(-2, -2, 2, 0, 0, phage.r);
    if (isDarter) {
      headGradient.addColorStop(0, "rgba(255, 220, 237, 0.97)");
      headGradient.addColorStop(1, "rgba(206, 102, 144, 0.94)");
    } else {
      headGradient.addColorStop(0, "rgba(193, 248, 255, 0.96)");
      headGradient.addColorStop(1, "rgba(72, 165, 194, 0.94)");
    }
    ctx.fillStyle = headGradient;
    ctx.beginPath();
    for (let i = 0; i < 6; i += 1) {
      const a = (Math.PI / 3) * i;
      const px = Math.cos(a) * phage.r;
      const py = Math.sin(a) * phage.r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = isDarter ? "rgba(255, 225, 238, 0.9)" : "rgba(198, 251, 255, 0.92)";
    ctx.lineWidth = 1.8;
    ctx.stroke();

    ctx.strokeStyle = isDarter ? "rgba(252, 174, 214, 0.62)" : "rgba(143, 230, 241, 0.58)";
    ctx.lineWidth = 1.05;
    for (let i = 0; i < 3; i += 1) {
      const angle = (Math.PI / 3) * i;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * phage.r * 0.2, Math.sin(angle) * phage.r * 0.2);
      ctx.lineTo(Math.cos(angle) * phage.r * 0.78, Math.sin(angle) * phage.r * 0.78);
      ctx.stroke();
    }

    const tailBase = phage.r + phage.r * 0.18;
    const tailY = phage.r + phage.r * (isDarter ? 1.54 : 1.72);
    ctx.strokeStyle = isDarter ? "rgba(255, 212, 233, 0.86)" : "rgba(188, 248, 255, 0.86)";
    ctx.lineWidth = isDarter ? 1.65 : 2;
    ctx.beginPath();
    ctx.moveTo(0, tailBase);
    ctx.lineTo(0, tailY);
    ctx.stroke();

    ctx.strokeStyle = isDarter ? "rgba(255, 170, 213, 0.74)" : "rgba(144, 233, 246, 0.8)";
    ctx.lineWidth = isDarter ? 1.2 : 1.6;
    ctx.beginPath();
    ctx.moveTo(-phage.r * 0.42, tailBase + phage.r * 0.22);
    ctx.lineTo(phage.r * 0.42, tailBase + phage.r * 0.22);
    ctx.moveTo(-phage.r * 0.3, tailBase + phage.r * 0.55);
    ctx.lineTo(phage.r * 0.3, tailBase + phage.r * 0.55);
    ctx.stroke();

    ctx.strokeStyle = isDarter ? "rgba(255, 204, 228, 0.86)" : "rgba(162, 244, 255, 0.82)";
    ctx.lineWidth = isDarter ? 1.1 : 1.4;
    ctx.beginPath();
    ctx.moveTo(0, tailY);
    ctx.lineTo(-phage.r * 1.02, tailY + phage.r * 0.92);
    ctx.moveTo(0, tailY);
    ctx.lineTo(phage.r * 1.02, tailY + phage.r * 0.92);
    ctx.moveTo(-phage.r * 0.18, tailY + phage.r * 0.2);
    ctx.lineTo(-phage.r * 1.06, tailY + phage.r * 0.78);
    ctx.moveTo(phage.r * 0.18, tailY + phage.r * 0.2);
    ctx.lineTo(phage.r * 1.06, tailY + phage.r * 0.78);
    ctx.stroke();

    ctx.restore();
  }

  function drawPrecursorCore(precursor, radius) {
    if (precursor.coreShape === "disc") {
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.92, 0, Math.PI * 2);
      return;
    }

    if (precursor.coreShape === "rounded-rect") {
      drawCapsule(0, 0, radius * 1.56, radius * 0.72);
      return;
    }

    if (precursor.coreShape === "capsule") {
      drawCapsule(0, 0, radius * 1.88, radius * 0.82);
      return;
    }

    ctx.beginPath();
    for (let i = 0; i < 6; i += 1) {
      const a = (Math.PI / 3) * i;
      const px = Math.cos(a) * radius;
      const py = Math.sin(a) * radius;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  function drawPrecursorGlyph(precursor, radius) {
    ctx.strokeStyle = precursor.detailColor || "rgba(220, 255, 236, 0.62)";
    ctx.fillStyle = precursor.detailColor || "rgba(220, 255, 236, 0.62)";
    ctx.lineWidth = 1.2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    switch (precursor.icon) {
      case "lipid-ii": {
        ctx.beginPath();
        ctx.moveTo(-radius * 0.4, 0);
        ctx.lineTo(radius * 0.4, 0);
        ctx.moveTo(0, -radius * 0.36);
        ctx.lineTo(0, radius * 0.22);
        ctx.moveTo(-radius * 0.16, radius * 0.46);
        ctx.lineTo(-radius * 0.16, radius * 0.78);
        ctx.moveTo(radius * 0.16, radius * 0.42);
        ctx.lineTo(radius * 0.16, radius * 0.74);
        ctx.stroke();
        break;
      }
      case "phospholipid": {
        ctx.beginPath();
        ctx.arc(0, -radius * 0.1, radius * 0.26, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-radius * 0.18, radius * 0.05);
        ctx.lineTo(-radius * 0.26, radius * 0.68);
        ctx.moveTo(radius * 0.12, radius * 0.06);
        ctx.lineTo(radius * 0.28, radius * 0.7);
        ctx.stroke();
        break;
      }
      case "lps": {
        ctx.beginPath();
        ctx.moveTo(0, -radius * 0.5);
        ctx.lineTo(0, radius * 0.5);
        ctx.moveTo(0, -radius * 0.2);
        ctx.lineTo(-radius * 0.3, -radius * 0.42);
        ctx.moveTo(0, -radius * 0.2);
        ctx.lineTo(radius * 0.3, -radius * 0.42);
        ctx.moveTo(0, 0.02 * radius);
        ctx.lineTo(-radius * 0.34, -radius * 0.08);
        ctx.moveTo(0, 0.02 * radius);
        ctx.lineTo(radius * 0.34, -radius * 0.08);
        ctx.stroke();
        break;
      }
      case "los": {
        ctx.beginPath();
        ctx.moveTo(0, -radius * 0.42);
        ctx.lineTo(0, radius * 0.42);
        ctx.moveTo(0, -radius * 0.08);
        ctx.lineTo(-radius * 0.24, -radius * 0.3);
        ctx.moveTo(0, -radius * 0.08);
        ctx.lineTo(radius * 0.24, -radius * 0.3);
        ctx.stroke();
        break;
      }
      case "capsule": {
        ctx.beginPath();
        drawCapsule(0, 0, radius * 1.18, radius * 0.48);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(-radius * 0.22, 0, radius * 0.08, 0, Math.PI * 2);
        ctx.arc(radius * 0.22, 0, radius * 0.08, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case "teichoic": {
        ctx.beginPath();
        ctx.moveTo(-radius * 0.26, -radius * 0.5);
        ctx.lineTo(-radius * 0.26, radius * 0.5);
        ctx.moveTo(radius * 0.24, -radius * 0.5);
        ctx.lineTo(radius * 0.24, radius * 0.5);
        for (let y = -0.35; y <= 0.35; y += 0.22) {
          ctx.moveTo(-radius * 0.26, radius * y);
          ctx.lineTo(radius * 0.24, radius * y);
        }
        ctx.stroke();
        break;
      }
      case "teichoic-anchor": {
        ctx.beginPath();
        ctx.moveTo(-radius * 0.2, -radius * 0.48);
        ctx.lineTo(-radius * 0.2, radius * 0.28);
        ctx.moveTo(radius * 0.2, -radius * 0.48);
        ctx.lineTo(radius * 0.2, radius * 0.28);
        ctx.moveTo(-radius * 0.2, -radius * 0.18);
        ctx.lineTo(radius * 0.2, -radius * 0.18);
        ctx.moveTo(-radius * 0.2, 0.1 * radius);
        ctx.lineTo(radius * 0.2, 0.1 * radius);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-radius * 0.32, radius * 0.36);
        ctx.lineTo(radius * 0.32, radius * 0.36);
        ctx.moveTo(-radius * 0.2, radius * 0.36);
        ctx.lineTo(-radius * 0.1, radius * 0.56);
        ctx.moveTo(radius * 0.2, radius * 0.36);
        ctx.lineTo(radius * 0.1, radius * 0.56);
        ctx.stroke();
        break;
      }
      case "mesh": {
        ctx.beginPath();
        for (let x = -0.28; x <= 0.28; x += 0.28) {
          ctx.moveTo(radius * x, -radius * 0.42);
          ctx.lineTo(radius * x, radius * 0.42);
        }
        for (let y = -0.3; y <= 0.3; y += 0.3) {
          ctx.moveTo(-radius * 0.42, radius * y);
          ctx.lineTo(radius * 0.42, radius * y);
        }
        ctx.stroke();
        break;
      }
      case "mycolic": {
        ctx.beginPath();
        ctx.moveTo(-radius * 0.32, -radius * 0.4);
        ctx.lineTo(-radius * 0.14, -radius * 0.1);
        ctx.lineTo(-radius * 0.32, radius * 0.22);
        ctx.lineTo(-radius * 0.12, radius * 0.5);
        ctx.moveTo(radius * 0.12, -radius * 0.46);
        ctx.lineTo(radius * 0.3, -radius * 0.18);
        ctx.lineTo(radius * 0.12, radius * 0.16);
        ctx.lineTo(radius * 0.32, radius * 0.46);
        ctx.stroke();
        break;
      }
      default: {
        ctx.beginPath();
        ctx.moveTo(-radius * 0.4, 0);
        ctx.lineTo(radius * 0.4, 0);
        ctx.moveTo(0, -radius * 0.4);
        ctx.lineTo(0, radius * 0.4);
        ctx.stroke();
        break;
      }
    }
  }

  function drawResource(resource, time) {
    ctx.save();
    ctx.translate(resource.x, resource.y);
    ctx.rotate(time * 0.0007 + resource.phase * 0.5);

    if (resource.kind === "shield") {
      const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, resource.r * 2.1);
      glow.addColorStop(0, "rgba(139, 246, 255, 0.9)");
      glow.addColorStop(1, "rgba(62, 168, 201, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, resource.r * 2.1, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(150, 243, 255, 0.9)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, resource.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-resource.r * 0.55, 0);
      ctx.lineTo(resource.r * 0.55, 0);
      ctx.moveTo(0, -resource.r * 0.55);
      ctx.lineTo(0, resource.r * 0.55);
      ctx.stroke();
      ctx.strokeStyle = "rgba(182, 252, 255, 0.72)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(0, 0, resource.r * 0.58, 0, Math.PI * 2);
      ctx.stroke();
    } else if (resource.kind === "boost") {
      const glow = ctx.createRadialGradient(0, 0, 1, 0, 0, resource.r * 2.2);
      glow.addColorStop(0, "rgba(188, 214, 255, 0.9)");
      glow.addColorStop(1, "rgba(93, 110, 226, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, resource.r * 2.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(201, 221, 255, 0.92)";
      ctx.beginPath();
      ctx.moveTo(-resource.r * 0.55, resource.r * 0.14);
      ctx.lineTo(-resource.r * 0.08, resource.r * 0.14);
      ctx.lineTo(-resource.r * 0.22, resource.r * 0.7);
      ctx.lineTo(resource.r * 0.56, -resource.r * 0.2);
      ctx.lineTo(resource.r * 0.12, -resource.r * 0.2);
      ctx.lineTo(resource.r * 0.26, -resource.r * 0.74);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "rgba(234, 242, 255, 0.84)";
      ctx.lineWidth = 1.15;
      ctx.stroke();
    } else {
      const precursor = resource.precursor || ENVELOPE_PRECURSORS.lipidII;
      const glow = ctx.createRadialGradient(0, 0, 1, 0, 0, resource.r * 2.2);
      glow.addColorStop(0, precursor.glowColor || "rgba(175, 255, 214, 0.86)");
      glow.addColorStop(1, "rgba(83, 199, 154, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, resource.r * 2.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = precursor.fillColor || "rgba(167, 255, 213, 0.95)";
      drawPrecursorCore(precursor, resource.r);
      ctx.fill();

      ctx.strokeStyle = precursor.strokeColor || "rgba(34, 94, 81, 0.45)";
      ctx.lineWidth = 1;
      drawPrecursorCore(precursor, resource.r);
      ctx.stroke();

      drawPrecursorGlyph(precursor, resource.r);
    }

    ctx.restore();
  }

  function drawMorphologyPath(model, length, radius) {
    if (model.shape === "coccus") {
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.closePath();
      return;
    }
    if (model.shape === "diplococcus") {
      drawDiplococcus(0, 0, length, radius);
      return;
    }
    if (model.shape === "coccobacillus") {
      drawCapsule(0, 0, length * 0.84, radius * 0.92);
      return;
    }
    if (model.shape === "curved-rod") {
      drawCurvedCapsule(0, 0, length * 0.94, radius * 0.94);
      return;
    }
    if (model.shape === "coryneform") {
      drawCoryneform(0, 0, length * 0.92, radius);
      return;
    }
    drawCapsule(0, 0, length, radius);
  }

  function drawMorphologyAccents(model, length, radius, alpha) {
    if (model.shape === "coccus") {
      ctx.strokeStyle = `rgba(255, 238, 203, ${clamp(alpha * 0.7, 0, 1).toFixed(3)})`;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.55, 0, Math.PI * 2);
      ctx.stroke();

      for (let i = 0; i < 3; i += 1) {
        const theta = -0.8 + i * 0.8;
        const x = Math.cos(theta) * radius * 0.56;
        const y = Math.sin(theta) * radius * 0.48;
        ctx.beginPath();
        ctx.arc(x, y, radius * 0.2, 0, Math.PI * 2);
        ctx.stroke();
      }
      return;
    }

    if (model.shape === "diplococcus") {
      ctx.globalAlpha = clamp(alpha * 0.9, 0, 1);
      ctx.strokeStyle = "rgba(255, 226, 236, 0.86)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(0, -radius * 0.72);
      ctx.lineTo(0, radius * 0.72);
      ctx.stroke();

      const lobeRadius = radius * 0.86;
      const centerOffset = clamp(length * 0.2, radius * 0.3, radius * 0.55);
      for (let i = -1; i <= 1; i += 2) {
        ctx.beginPath();
        ctx.arc(i * centerOffset, 0, lobeRadius * 0.45, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      return;
    }

    ctx.globalAlpha = clamp(alpha * 0.82, 0, 1);
    if (model.shape === "curved-rod") {
      ctx.strokeStyle = "rgba(190, 255, 239, 0.8)";
      ctx.lineWidth = 1.2;
      for (let i = -2; i <= 2; i += 1) {
        const offset = i * 5.4;
        ctx.beginPath();
        ctx.moveTo(-length * 0.26, offset - radius * 0.08);
        ctx.quadraticCurveTo(0, offset - radius * 0.22, length * 0.26, offset + radius * 0.08);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      return;
    }

    if (model.shape === "coryneform") {
      ctx.strokeStyle = "rgba(219, 229, 255, 0.82)";
      ctx.lineWidth = 1.2;
      for (let i = -1; i <= 2; i += 1) {
        const x = -length * 0.23 + i * length * 0.16;
        ctx.beginPath();
        ctx.moveTo(x, -radius * 0.45 + i * radius * 0.03);
        ctx.lineTo(x + length * 0.16, radius * 0.48 + i * radius * 0.03);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      return;
    }

    ctx.strokeStyle = model.shape === "encapsulated-rod" ? "rgba(203, 255, 231, 0.76)" : "rgba(161, 245, 255, 0.8)";
    ctx.lineWidth = 1.2;
    for (let i = -2; i <= 2; i += 1) {
      const offset = i * 6;
      ctx.beginPath();
      ctx.moveTo(-length * 0.26, offset);
      ctx.lineTo(length * 0.26, offset);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    if (model.shape === "encapsulated-rod") {
      ctx.strokeStyle = "rgba(195, 255, 228, 0.44)";
      ctx.lineWidth = 1.8;
      drawCapsule(0, 0, length * 1.08, radius * 1.13);
      ctx.stroke();
    }
  }

  function drawTrails() {
    if (!state.trails.length) return;
    const model = getModel(state.modelId);

    state.trails.forEach((trail, index) => {
      const alpha = clamp((trail.life / trail.maxLife) * 0.44, 0, 0.44);
      const widthScale = clamp(index / state.trails.length, 0.3, 1);
      ctx.save();
      ctx.translate(trail.x, trail.y);
      ctx.rotate(trail.angle);
      const trailColor =
        state.boostTimer > 0
          ? "190, 217, 255"
          : model.shape === "coccus"
            ? "255, 224, 159"
            : "130, 228, 238";
      ctx.fillStyle = `rgba(${trailColor}, ${alpha.toFixed(3)})`;
      drawMorphologyPath(model, state.player.length * 0.72 * widthScale, state.player.radius * 0.58 * widthScale);
      ctx.fill();
      ctx.restore();
    });
  }

  function drawPlayer(time) {
    const model = getModel(state.modelId);
    const palette = model.palette;
    ctx.save();
    ctx.translate(state.player.x, state.player.y);
    ctx.rotate(state.player.angle);

    const outerLength = state.player.length;
    const outerRadius = state.player.radius;

    const membrane = ctx.createLinearGradient(-outerLength / 2, 0, outerLength / 2, 0);
    membrane.addColorStop(0, palette.membraneA);
    membrane.addColorStop(0.5, palette.membraneB);
    membrane.addColorStop(1, palette.membraneC);

    ctx.fillStyle = membrane;
    drawMorphologyPath(model, outerLength, outerRadius);
    ctx.fill();

    ctx.globalAlpha = 0.62;
    ctx.fillStyle = palette.core;
    drawMorphologyPath(model, outerLength * 0.78, outerRadius * 0.65);
    ctx.fill();

    ctx.globalAlpha = 0.88;
    ctx.strokeStyle = "rgba(185, 252, 255, 0.94)";
    ctx.lineWidth = 2;
    drawMorphologyPath(model, outerLength, outerRadius);
    ctx.stroke();

    drawMorphologyAccents(model, outerLength, outerRadius, 0.42);

    ctx.restore();

    if (state.shield > 0) {
      const r = state.player.radius + 8 + Math.sin(time * 0.01) * 1.8;
      const baseAlpha = clamp(0.25 + state.shield / 220, 0.25, 0.7);
      const shieldColor = palette.shield || "rgba(125, 243, 255, 0.7)";
      ctx.strokeStyle = toRgba(shieldColor, baseAlpha);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(state.player.x, state.player.y, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (state.boostTimer > 0) {
      const burstAlpha = clamp(state.boostTimer / 10, 0, 1) * (0.42 + Math.sin(time * 0.03) * 0.15);
      ctx.strokeStyle = `rgba(194, 220, 255, ${clamp(burstAlpha, 0.12, 0.56).toFixed(3)})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(state.player.x, state.player.y, state.player.radius + 12 + Math.sin(time * 0.012) * 2.2, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (state.invulnerable > 0) {
      const blink = Math.sin(time * 0.04) > 0;
      if (blink) {
        ctx.strokeStyle = "rgba(255, 140, 172, 0.74)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(state.player.x, state.player.y, state.player.radius + 3, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  function drawLysisShockwaves() {
    state.lysisShockwaves.forEach((wave) => {
      const alpha = clamp(wave.life / wave.maxLife, 0, 1);
      ctx.strokeStyle = `rgba(255, 186, 221, ${(alpha * 0.44).toFixed(3)})`;
      ctx.lineWidth = wave.thickness;
      ctx.beginPath();
      ctx.arc(wave.x, wave.y, wave.r, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = `rgba(161, 240, 255, ${(alpha * 0.34).toFixed(3)})`;
      ctx.lineWidth = Math.max(1.2, wave.thickness * 0.44);
      ctx.beginPath();
      ctx.arc(wave.x, wave.y, wave.r * 0.84, 0, Math.PI * 2);
      ctx.stroke();
    });
  }

  function drawLysisFragments() {
    state.lysisFragments.forEach((fragment) => {
      const alpha = clamp(fragment.life / fragment.maxLife, 0, 1);
      ctx.save();
      ctx.translate(fragment.x, fragment.y);
      ctx.rotate(fragment.angle);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = toRgba(fragment.color, alpha * 0.9);
      ctx.beginPath();
      ctx.moveTo(-fragment.length * 0.5, -fragment.width * 0.5);
      ctx.lineTo(fragment.length * 0.44, -fragment.width * 0.72);
      ctx.lineTo(fragment.length * 0.56, fragment.width * 0.42);
      ctx.lineTo(-fragment.length * 0.42, fragment.width * 0.72);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });
  }

  function drawLysisPhages() {
    drawLysisShockwaves();
    drawLysisFragments();
    state.lysisPhages.forEach((phage) => {
      if (phage.delay > 0 || !phage.released) return;
      const fade = clamp(phage.life / phage.maxLife, 0, 1);
      ctx.save();
      ctx.globalAlpha = fade;
      drawPhage(phage);
      ctx.restore();
    });
  }

  function drawCollapsingRuptures(outerLength, outerRadius, progress, membraneAlpha) {
    if (!state.lysisRuptures.length) return;
    const crackProgress = clamp((progress - 0.08) / 0.28, 0, 1);
    const ruptureProgress = clamp((state.collapseTimer - state.collapseRuptureAt) / 0.26, 0, 1);
    if (crackProgress <= 0 && ruptureProgress <= 0) return;

    state.lysisRuptures.forEach((site) => {
      const x = site.xRatio * outerLength * 0.44;
      const y = site.yRatio * outerRadius * 0.95;
      const holeRadius = site.size * (0.35 + ruptureProgress * 1.55);

      if (crackProgress > 0) {
        ctx.strokeStyle = `rgba(255, 216, 231, ${(membraneAlpha * 0.56 * crackProgress).toFixed(3)})`;
        ctx.lineWidth = 1.25;
        for (let i = 0; i < 3; i += 1) {
          const branchAngle = site.crackAngle + (i - 1) * 0.8 + Math.sin(progress * 8 + i) * 0.1;
          const len = site.size * (2.2 + crackProgress * 2.7) * (i === 1 ? 1.1 : 0.78);
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + Math.cos(branchAngle) * len, y + Math.sin(branchAngle) * len);
          ctx.stroke();
        }
      }

      if (ruptureProgress > 0) {
        ctx.fillStyle = `rgba(10, 18, 35, ${(0.32 + ruptureProgress * 0.58).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(x, y, holeRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = `rgba(255, 194, 220, ${(membraneAlpha * 0.52 * ruptureProgress).toFixed(3)})`;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.arc(x, y, holeRadius * 1.08, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
  }

  function drawCollapsingCell(time) {
    const model = getModel(state.modelId);
    const palette = model.palette;
    const progress = clamp(state.collapseTimer / state.collapseDuration, 0, 1);
    const swell = progress < 0.24 ? 1 + progress * 0.5 : 1.12 - (progress - 0.24) * 0.82;
    const membraneAlpha = clamp(0.95 - progress * 1.35, 0, 1);
    const coreAlpha = clamp(0.78 - progress * 1.25, 0, 0.78);
    const stretch = 1 + Math.sin(time * 0.02) * 0.05 * (1 - progress);

    ctx.save();
    ctx.translate(state.player.x, state.player.y);
    ctx.rotate(state.player.angle);
    ctx.scale(swell * stretch, swell);

    const outerLength = state.player.length;
    const outerRadius = state.player.radius;
    const membrane = ctx.createLinearGradient(-outerLength / 2, 0, outerLength / 2, 0);
    membrane.addColorStop(0, toRgba(palette.membraneA, membraneAlpha));
    membrane.addColorStop(0.55, `rgba(255, 170, 203, ${(membraneAlpha * 0.86).toFixed(3)})`);
    membrane.addColorStop(1, toRgba(palette.membraneC, membraneAlpha));
    ctx.fillStyle = membrane;
    drawMorphologyPath(model, outerLength, outerRadius);
    ctx.fill();

    ctx.fillStyle = toRgba(palette.core, coreAlpha);
    drawMorphologyPath(model, outerLength * 0.78, outerRadius * 0.64);
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = `rgba(241, 194, 220, ${(membraneAlpha * 0.9).toFixed(3)})`;
    drawMorphologyPath(model, outerLength, outerRadius);
    ctx.stroke();
    drawMorphologyAccents(model, outerLength, outerRadius, membraneAlpha * 0.42);
    drawCollapsingRuptures(outerLength, outerRadius, progress, membraneAlpha);
    ctx.restore();

    const flash = clamp(1 - Math.abs(progress - 0.22) / 0.22, 0, 1);
    if (flash > 0) {
      const burst = ctx.createRadialGradient(
        state.player.x,
        state.player.y,
        state.player.radius * 0.8,
        state.player.x,
        state.player.y,
        state.player.radius * (7 + flash * 10)
      );
      burst.addColorStop(0, `rgba(255, 208, 224, ${(flash * 0.32).toFixed(3)})`);
      burst.addColorStop(1, "rgba(255, 208, 224, 0)");
      ctx.fillStyle = burst;
      ctx.beginPath();
      ctx.arc(state.player.x, state.player.y, state.player.radius * (7 + flash * 10), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawVignette() {
    const vignette = ctx.createRadialGradient(
      state.width * 0.5,
      state.height * 0.5,
      Math.min(state.width, state.height) * 0.22,
      state.width * 0.5,
      state.height * 0.5,
      Math.max(state.width, state.height) * 0.76
    );
    vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
    vignette.addColorStop(1, "rgba(0, 0, 0, 0.34)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, state.width, state.height);
  }

  function drawCapsule(x, y, length, radius) {
    const half = length / 2;
    ctx.beginPath();
    ctx.moveTo(x - half + radius, y - radius);
    ctx.lineTo(x + half - radius, y - radius);
    ctx.arc(x + half - radius, y, radius, -Math.PI / 2, Math.PI / 2, false);
    ctx.lineTo(x - half + radius, y + radius);
    ctx.arc(x - half + radius, y, radius, Math.PI / 2, -Math.PI / 2, false);
    ctx.closePath();
  }

  function drawDiplococcus(x, y, length, radius) {
    const lobeRadius = radius * 0.86;
    const centerOffset = clamp(length * 0.2, radius * 0.3, radius * 0.55);
    ctx.beginPath();
    ctx.arc(x - centerOffset, y, lobeRadius, 0, Math.PI * 2);
    ctx.arc(x + centerOffset, y, lobeRadius, 0, Math.PI * 2);
    ctx.closePath();
  }

  function drawCurvedCapsule(x, y, length, radius) {
    const half = length / 2;
    const curve = radius * 0.55;
    const leftY = y - curve * 0.32;
    const rightY = y + curve * 0.32;
    ctx.beginPath();
    ctx.moveTo(x - half + radius, leftY - radius);
    ctx.quadraticCurveTo(x, y - radius - curve, x + half - radius, rightY - radius);
    ctx.arc(x + half - radius, rightY, radius, -Math.PI / 2, Math.PI / 2, false);
    ctx.quadraticCurveTo(x, y + radius + curve, x - half + radius, leftY + radius);
    ctx.arc(x - half + radius, leftY, radius, Math.PI / 2, -Math.PI / 2, false);
    ctx.closePath();
  }

  function drawCoryneform(x, y, length, radius) {
    const half = length / 2;
    const narrowRadius = radius * 0.72;
    const wideRadius = radius * 1.12;
    ctx.beginPath();
    ctx.moveTo(x - half + narrowRadius, y - narrowRadius);
    ctx.quadraticCurveTo(x - length * 0.1, y - radius * 1.1, x + half - wideRadius, y - wideRadius);
    ctx.arc(x + half - wideRadius, y, wideRadius, -Math.PI / 2, Math.PI / 2, false);
    ctx.quadraticCurveTo(x - length * 0.14, y + radius * 1.08, x - half + narrowRadius, y + narrowRadius);
    ctx.arc(x - half + narrowRadius, y, narrowRadius, Math.PI / 2, -Math.PI / 2, false);
    ctx.closePath();
  }

  function drawBursts() {
    state.bursts.forEach((burst) => {
      const alpha = clamp(burst.life / burst.maxLife, 0, 1);
      ctx.fillStyle = toRgba(burst.color, alpha);
      ctx.beginPath();
      ctx.arc(burst.x, burst.y, burst.size * alpha, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawFloaters() {
    if (!state.floaters.length) return;
    ctx.font = "700 13px Manrope, sans-serif";
    ctx.textAlign = "center";
    state.floaters.forEach((floater) => {
      const alpha = clamp(floater.life / floater.maxLife, 0, 1);
      ctx.fillStyle = toRgba(floater.color, alpha);
      ctx.fillText(floater.text, floater.x, floater.y);
    });
  }

  function toRgba(hexOrRgb, alpha) {
    if (hexOrRgb.startsWith("rgba")) {
      const values = hexOrRgb
        .replace("rgba(", "")
        .replace(")", "")
        .split(",")
        .map((part) => part.trim());
      return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${alpha.toFixed(3)})`;
    }
    if (hexOrRgb.startsWith("rgb")) {
      const values = hexOrRgb
        .replace("rgb(", "")
        .replace(")", "")
        .split(",")
        .map((part) => part.trim());
      return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${alpha.toFixed(3)})`;
    }
    const hex = hexOrRgb.replace("#", "");
    const value = hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex;
    const r = Number.parseInt(value.slice(0, 2), 16);
    const g = Number.parseInt(value.slice(2, 4), 16);
    const b = Number.parseInt(value.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
  }

  function drawFrame(timestamp) {
    if (!isModalOpen()) return;

    let dt = 0.016;
    if (lastFrame) {
      dt = clamp((timestamp - lastFrame) / 1000, 0.001, 0.033);
    }
    lastFrame = timestamp;

    if (state.running && !state.paused) {
      updateSimulation(dt);
    }
    if (state.collapseActive) {
      updateLysisSequence(dt);
    }

    ctx.save();
    if (state.shake > 0 && !prefersReducedMotion) {
      const shakeX = random(-state.shake, state.shake) * 0.28;
      const shakeY = random(-state.shake, state.shake) * 0.28;
      ctx.translate(shakeX, shakeY);
    }

    drawBackground(timestamp);
    state.pulses.forEach(drawPulse);
    state.resources.forEach((resource) => drawResource(resource, timestamp));
    state.phages.forEach(drawPhage);
    drawTrails();
    if (state.collapseActive) {
      drawCollapsingCell(timestamp);
      drawLysisPhages();
    } else {
      drawPlayer(timestamp);
    }
    drawBursts();
    drawFloaters();
    drawVignette();
    ctx.restore();

    if (isModalOpen()) {
      rafId = window.requestAnimationFrame(drawFrame);
    } else {
      rafId = null;
    }
  }

  function ensureLoop() {
    if (rafId !== null) return;
    lastFrame = 0;
    rafId = window.requestAnimationFrame(drawFrame);
  }

  function onKeyChange(event, value) {
    const key = event.key.toLowerCase();

    if (key === "arrowup" || key === "w") keys.up = value;
    if (key === "arrowdown" || key === "s") keys.down = value;
    if (key === "arrowleft" || key === "a") keys.left = value;
    if (key === "arrowright" || key === "d") keys.right = value;

    if (value && key === " " && state.running) {
      event.preventDefault();
      if (state.paused) resumeSimulation();
      else pauseSimulation();
    }
  }

  trigger.addEventListener("click", () => {
    trigger.classList.add("is-arming");
    if (triggerTimer) window.clearTimeout(triggerTimer);
    triggerTimer = window.setTimeout(() => {
      trigger.classList.remove("is-arming");
      triggerTimer = null;
    }, 420);
    openModal();
  });
  closeButton.addEventListener("click", closeModal);

  startButton.addEventListener("click", () => {
    if (overlayMode === "resume") {
      resumeSimulation();
      return;
    }
    if (!capturePlayerNameForRun()) return;
    if (overlayMode === "start") {
      startSimulation("ranked");
      return;
    }
    startSimulation(state.runMode);
  });

  if (tutorialStartButton) {
    tutorialStartButton.addEventListener("click", () => {
      if (!capturePlayerNameForRun()) return;
      startSimulation("tutorial");
    });
  }

  pauseButton.addEventListener("click", () => {
    if (!state.running) return;
    if (state.paused) resumeSimulation();
    else pauseSimulation();
  });

  restartButton.addEventListener("click", () => startSimulation(state.runMode));

  if (nameFormEl) {
    nameFormEl.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (state.pendingScore === null) return;

      const savedName = sanitizeName(nameInputEl ? nameInputEl.value : "") || "Anonymous";
      const savedScore = state.pendingScore;
      const accepted = await addLeaderboardEntry(savedName, savedScore);
      if (!accepted) {
        setNameFeedback("Name unavailable. Try a different one.");
        if (nameInputEl) {
          nameInputEl.focus({ preventScroll: true });
          nameInputEl.select();
        }
        return;
      }
      hideNameForm();
      showOverlay(
        "Score saved",
        `${savedName} saved with ${savedScore} points. Best score: ${Math.floor(state.best)}.`,
        "Play Again",
        "restart"
      );
    });
  }

  if (nameSkipEl) {
    nameSkipEl.addEventListener("click", () => {
      hideNameForm();
      if (!state.running && !state.collapseActive) {
        showOverlay(
          "Envelope collapsed",
          `Final score: ${Math.floor(state.score)}. Best score: ${Math.floor(state.best)}.`,
          "Play Again",
          "restart"
        );
      }
    });
  }

  if (modelSelectEl) {
    modelSelectEl.addEventListener("change", () => {
      setModel(modelSelectEl.value, true);
      if (!state.running && isModalOpen()) ensureLoop();
    });
  }

  if (playerNameInputEl) {
    playerNameInputEl.addEventListener("input", () => {
      setPlayerNameFeedback("");
    });
    playerNameInputEl.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      if (overlayMode === "resume") return;
      event.preventDefault();
      if (!capturePlayerNameForRun()) return;
      if (overlayMode === "start") {
        startSimulation("ranked");
        return;
      }
      startSimulation(state.runMode);
    });
  }

  modal.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeModal();
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  window.addEventListener("keydown", (event) => {
    if (!isModalOpen()) return;
    onKeyChange(event, true);
  });

  window.addEventListener("keyup", (event) => {
    if (!isModalOpen()) return;
    onKeyChange(event, false);
  });

  window.addEventListener("blur", () => {
    resetInputState();
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) return;
    resetInputState();
  });

  canvas.addEventListener("pointerdown", (event) => {
    pointer.active = true;
    pointerToWorld(event);
    if (typeof canvas.setPointerCapture === "function") {
      try {
        canvas.setPointerCapture(event.pointerId);
      } catch {
        /* no-op */
      }
    }
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!pointer.active) return;
    pointerToWorld(event);
  });

  canvas.addEventListener("pointerup", () => {
    pointer.active = false;
  });

  canvas.addEventListener("pointercancel", () => {
    pointer.active = false;
  });

  canvas.addEventListener("pointerleave", () => {
    pointer.active = false;
  });

  window.addEventListener("resize", () => {
    if (!isModalOpen()) return;
    resizeCanvas();
    ensureLoop();
  });

  setModel(state.modelId, false);
  hideNameForm();
    setLeaderboardMeta(state.leaderboardMode === "global" ? "global" : "local");
  renderLeaderboard();
  refreshLeaderboardFromSource();
  updateHud();
})();
