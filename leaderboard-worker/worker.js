const MAX_NAME_LENGTH = 24;
const MIN_SCORE = 1;
const MAX_SCORE = 2000000000;
const MIN_PLAYED_AT = Date.UTC(2000, 0, 1);
const MAX_CLOCK_SKEW_MS = 10 * 60 * 1000;
const BOARD_PATTERN = /^(classic|daily-\d{4}-\d{2}-\d{2})$/;
const SPECIES_CODES = new Set([
  "ecoli",
  "paeruginosa",
  "saureus",
  "spneumoniae",
  "cglutamicum",
  "kpneumoniae",
  "abaumannii"
]);

function parseAllowedOrigins(env) {
  const raw = String(env.ALLOWED_ORIGINS || "").trim();
  if (!raw) return [];
  return raw
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function getCorsHeaders(request, env) {
  const origin = request.headers.get("Origin");
  const allowed = parseAllowedOrigins(env);
  const allowAny = allowed.length === 0;
  const allowOrigin = allowAny ? "*" : allowed.includes(origin || "") ? origin : allowed[0];

  return {
    "Access-Control-Allow-Origin": allowOrigin || "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin"
  };
}

function jsonResponse(body, request, env, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...getCorsHeaders(request, env)
    }
  });
}

function normalizeName(value) {
  return String(value || "")
    .replace(/[^A-Za-z0-9 ._'-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_NAME_LENGTH);
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

function normalizeScore(value) {
  const score = Math.floor(Number(value) || 0);
  if (!Number.isFinite(score)) return 0;
  return Math.max(0, Math.min(MAX_SCORE, score));
}

function normalizeSpecies(value) {
  const key = String(value || "")
    .trim()
    .toLowerCase();
  if (SPECIES_CODES.has(key)) return key;
  return "unknown";
}

function normalizePlayedAt(value) {
  const now = Date.now();
  const parsed = Math.floor(Number(value) || 0);
  if (!Number.isFinite(parsed)) return now;
  if (parsed < MIN_PLAYED_AT) return now;
  if (parsed > now + MAX_CLOCK_SKEW_MS) return now;
  return parsed;
}

function normalizeBoard(value) {
  const board = String(value || "")
    .trim()
    .toLowerCase();
  return BOARD_PATTERN.test(board) ? board : "classic";
}

let schemaCapabilities = null;
let schemaUpgradeAttempted = false;

async function getSchemaCapabilities(env) {
  if (schemaCapabilities) return schemaCapabilities;
  const { results } = await env.DB.prepare(`PRAGMA table_info(leaderboard_scores)`).all();
  const names = new Set((results || []).map((row) => String(row?.name || "").toLowerCase()));
  schemaCapabilities = {
    hasSpecies: names.has("species"),
    hasPlayedAt: names.has("played_at"),
    hasBoard: names.has("board")
  };
  return schemaCapabilities;
}

async function ensureSchemaUpgraded(env) {
  if (schemaUpgradeAttempted) return;
  schemaUpgradeAttempted = true;

  const caps = await getSchemaCapabilities(env);

  if (!caps.hasSpecies) {
    try {
      await env.DB.prepare(`ALTER TABLE leaderboard_scores ADD COLUMN species TEXT NOT NULL DEFAULT 'unknown'`).run();
    } catch {
      /* no-op */
    }
  }

  if (!caps.hasPlayedAt) {
    try {
      await env.DB.prepare(`ALTER TABLE leaderboard_scores ADD COLUMN played_at INTEGER NOT NULL DEFAULT 0`).run();
    } catch {
      /* no-op */
    }
  }

  if (!caps.hasBoard) {
    try {
      await env.DB.prepare(`ALTER TABLE leaderboard_scores ADD COLUMN board TEXT NOT NULL DEFAULT 'classic'`).run();
    } catch {
      /* no-op */
    }
  }

  schemaCapabilities = null;
  const finalCaps = await getSchemaCapabilities(env);

  if (finalCaps.hasSpecies) {
    try {
      await env.DB.prepare(`UPDATE leaderboard_scores SET species = 'unknown' WHERE species IS NULL OR TRIM(species) = ''`).run();
    } catch {
      /* no-op */
    }
  }

  if (finalCaps.hasPlayedAt) {
    try {
      await env.DB.prepare(`UPDATE leaderboard_scores SET played_at = created_at WHERE played_at IS NULL OR played_at <= 0`).run();
    } catch {
      /* no-op */
    }
  }

  if (finalCaps.hasBoard) {
    try {
      await env.DB.prepare(`UPDATE leaderboard_scores SET board = 'classic' WHERE board IS NULL OR TRIM(board) = ''`).run();
    } catch {
      /* no-op */
    }
  }
}

async function readTopScores(env, board) {
  const caps = await getSchemaCapabilities(env);
  const normalizedBoard = normalizeBoard(board);

  if (!caps.hasBoard && normalizedBoard !== "classic") {
    return [];
  }

  const sql = caps.hasSpecies && caps.hasPlayedAt && caps.hasBoard
    ? `SELECT name, score, created_at AS createdAt, species, played_at AS playedAt, board
       FROM leaderboard_scores
       WHERE board = ?1
       ORDER BY score DESC, played_at ASC, id ASC
       LIMIT 25`
    : caps.hasSpecies && caps.hasPlayedAt
      ? `SELECT name, score, created_at AS createdAt, species, played_at AS playedAt
         FROM leaderboard_scores
         ORDER BY score DESC, played_at ASC, id ASC
         LIMIT 25`
      : `SELECT name, score, created_at AS createdAt
         FROM leaderboard_scores
         ORDER BY score DESC, created_at ASC, id ASC
         LIMIT 25`;
  const query = caps.hasBoard ? env.DB.prepare(sql).bind(normalizedBoard) : env.DB.prepare(sql);
  const { results } = await query.all();

  return (results || []).map((row) => ({
    name: (() => {
      const cleaned = normalizeName(row.name) || "Anonymous";
      return isNameAllowed(cleaned) ? cleaned : "Anonymous";
    })(),
    score: normalizeScore(row.score),
    species: normalizeSpecies(row.species),
    playedAt: normalizePlayedAt(row.playedAt || row.createdAt),
    createdAt: normalizePlayedAt(row.playedAt || row.createdAt),
    board: normalizeBoard(row.board || normalizedBoard)
  }));
}

async function countScores(env, board) {
  const caps = await getSchemaCapabilities(env);
  const normalizedBoard = normalizeBoard(board);

  if (!caps.hasBoard && normalizedBoard !== "classic") {
    return 0;
  }

  const query = caps.hasBoard
    ? env.DB.prepare(`SELECT COUNT(*) AS totalEntries FROM leaderboard_scores WHERE board = ?1`).bind(normalizedBoard)
    : env.DB.prepare(`SELECT COUNT(*) AS totalEntries FROM leaderboard_scores`);
  const { results } = await query.all();
  return Math.max(0, Math.floor(Number(results?.[0]?.totalEntries) || 0));
}

async function computeRank(env, board, score, playedAt, rowId) {
  const caps = await getSchemaCapabilities(env);
  const normalizedBoard = normalizeBoard(board);
  const normalizedScore = normalizeScore(score);
  const normalizedPlayedAt = normalizePlayedAt(playedAt);
  const normalizedRowId = Math.max(0, Math.floor(Number(rowId) || 0));

  if (!caps.hasBoard && normalizedBoard !== "classic") {
    return 1;
  }

  const sql = caps.hasPlayedAt && caps.hasBoard
    ? `SELECT COUNT(*) AS placement
       FROM leaderboard_scores
       WHERE board = ?1
         AND (
           score > ?2
           OR (score = ?2 AND (played_at < ?3 OR (played_at = ?3 AND id <= ?4)))
         )`
    : caps.hasPlayedAt
      ? `SELECT COUNT(*) AS placement
         FROM leaderboard_scores
         WHERE score > ?1
           OR (score = ?1 AND (played_at < ?2 OR (played_at = ?2 AND id <= ?3)))`
      : `SELECT COUNT(*) AS placement
         FROM leaderboard_scores
         WHERE score > ?1 OR (score = ?1 AND id <= ?2)`;

  const query = caps.hasPlayedAt && caps.hasBoard
    ? env.DB.prepare(sql).bind(normalizedBoard, normalizedScore, normalizedPlayedAt, normalizedRowId)
    : caps.hasPlayedAt
      ? env.DB.prepare(sql).bind(normalizedScore, normalizedPlayedAt, normalizedRowId)
      : env.DB.prepare(sql).bind(normalizedScore, normalizedRowId);
  const { results } = await query.all();
  return Math.max(1, Math.floor(Number(results?.[0]?.placement) || 1));
}

async function insertScore(env, board, name, score, species, playedAt) {
  const now = Date.now();
  const caps = await getSchemaCapabilities(env);
  const normalizedBoard = normalizeBoard(board);
  const normalizedPlayedAt = normalizePlayedAt(playedAt);
  let insertedRowId = 0;

  if (caps.hasSpecies && caps.hasPlayedAt && caps.hasBoard) {
    const result = await env.DB.prepare(
      `INSERT INTO leaderboard_scores (name, score, created_at, species, played_at, board)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6)`
    )
      .bind(name, score, now, normalizeSpecies(species), normalizedPlayedAt, normalizedBoard)
      .run();
    insertedRowId = Math.max(0, Math.floor(Number(result?.meta?.last_row_id) || 0));
  } else if (caps.hasSpecies && caps.hasPlayedAt) {
    const result = await env.DB.prepare(
      `INSERT INTO leaderboard_scores (name, score, created_at, species, played_at)
       VALUES (?1, ?2, ?3, ?4, ?5)`
    )
      .bind(name, score, now, normalizeSpecies(species), normalizedPlayedAt)
      .run();
    insertedRowId = Math.max(0, Math.floor(Number(result?.meta?.last_row_id) || 0));
  } else {
    const result = await env.DB.prepare(
      `INSERT INTO leaderboard_scores (name, score, created_at)
       VALUES (?1, ?2, ?3)`
    )
      .bind(name, score, now)
      .run();
    insertedRowId = Math.max(0, Math.floor(Number(result?.meta?.last_row_id) || 0));
  }

  if (Math.random() < 0.1) {
    const cleanupQuery = caps.hasBoard
      ? env.DB.prepare(
          `DELETE FROM leaderboard_scores
           WHERE board = ?1
             AND id NOT IN (
               SELECT id
               FROM leaderboard_scores
               WHERE board = ?1
               ORDER BY score DESC, played_at ASC, id ASC
               LIMIT 500
             )`
        ).bind(normalizedBoard)
      : env.DB.prepare(
          `DELETE FROM leaderboard_scores
           WHERE id NOT IN (
             SELECT id
             FROM leaderboard_scores
             ORDER BY score DESC, created_at ASC, id ASC
             LIMIT 500
           )`
        );
    await cleanupQuery.run();
  }

  return {
    rowId: insertedRowId,
    playedAt: normalizedPlayedAt,
    board: normalizedBoard
  };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";
    const isPublicPath = path === "/leaderboard" || path === "/api/leaderboard";

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: getCorsHeaders(request, env)
      });
    }

    if (!isPublicPath) {
      return jsonResponse({ error: "Not found" }, request, env, 404);
    }

    await ensureSchemaUpgraded(env);

    if (request.method === "GET") {
      const board = normalizeBoard(url.searchParams.get("board"));
      const entries = await readTopScores(env, board);
      const totalEntries = await countScores(env, board);
      return jsonResponse({ entries, totalEntries, updatedAt: Date.now(), board }, request, env, 200);
    }

    if (request.method === "POST") {
      let payload = {};
      try {
        payload = await request.json();
      } catch {
        return jsonResponse({ error: "Invalid JSON body" }, request, env, 400);
      }

      const name = normalizeName(payload.name) || "Anonymous";
      const score = normalizeScore(payload.score);
      const species = normalizeSpecies(payload.species);
      const playedAt = normalizePlayedAt(payload.playedAt);
      const board = normalizeBoard(payload.board);

      if (score < MIN_SCORE) {
        return jsonResponse({ error: "Score must be a positive integer" }, request, env, 400);
      }
      if (!isNameAllowed(name)) {
        return jsonResponse({ error: "Name unavailable", errorCode: "invalid_name" }, request, env, 422);
      }

      const inserted = await insertScore(env, board, name, score, species, playedAt);
      const entries = await readTopScores(env, board);
      const totalEntries = await countScores(env, board);
      const rank = await computeRank(env, board, score, inserted.playedAt, inserted.rowId);
      return jsonResponse({ ok: true, entries, rank, totalEntries, updatedAt: Date.now(), board }, request, env, 201);
    }

    return jsonResponse({ error: "Method not allowed" }, request, env, 405);
  }
};
