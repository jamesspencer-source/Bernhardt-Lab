const MAX_NAME_LENGTH = 24;
const MIN_SCORE = 1;
const MAX_SCORE = 2000000000;
const MIN_PLAYED_AT = Date.UTC(2000, 0, 1);
const MAX_CLOCK_SKEW_MS = 10 * 60 * 1000;
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

let schemaCapabilities = null;
let schemaUpgradeAttempted = false;

async function getSchemaCapabilities(env) {
  if (schemaCapabilities) return schemaCapabilities;
  const { results } = await env.DB.prepare(`PRAGMA table_info(leaderboard_scores)`).all();
  const names = new Set((results || []).map((row) => String(row?.name || "").toLowerCase()));
  schemaCapabilities = {
    hasSpecies: names.has("species"),
    hasPlayedAt: names.has("played_at")
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
}

async function readTopScores(env) {
  const caps = await getSchemaCapabilities(env);
  const sql = caps.hasSpecies && caps.hasPlayedAt
    ? `SELECT name, score, created_at AS createdAt, species, played_at AS playedAt
       FROM leaderboard_scores
       ORDER BY score DESC, played_at ASC, id ASC
       LIMIT 25`
    : `SELECT name, score, created_at AS createdAt
       FROM leaderboard_scores
       ORDER BY score DESC, created_at ASC, id ASC
       LIMIT 25`;
  const { results } = await env.DB.prepare(sql).all();

  return (results || []).map((row) => ({
    name: (() => {
      const cleaned = normalizeName(row.name) || "Anonymous";
      return isNameAllowed(cleaned) ? cleaned : "Anonymous";
    })(),
    score: normalizeScore(row.score),
    species: normalizeSpecies(row.species),
    playedAt: normalizePlayedAt(row.playedAt || row.createdAt),
    createdAt: normalizePlayedAt(row.playedAt || row.createdAt)
  }));
}

async function countScores(env) {
  const { results } = await env.DB.prepare(`SELECT COUNT(*) AS totalEntries FROM leaderboard_scores`).all();
  return Math.max(0, Math.floor(Number(results?.[0]?.totalEntries) || 0));
}

async function computeRank(env, score, playedAt, rowId) {
  const caps = await getSchemaCapabilities(env);
  const normalizedScore = normalizeScore(score);
  const normalizedPlayedAt = normalizePlayedAt(playedAt);
  const normalizedRowId = Math.max(0, Math.floor(Number(rowId) || 0));

  const sql = caps.hasPlayedAt
    ? `SELECT COUNT(*) AS placement
       FROM leaderboard_scores
       WHERE score > ?1
          OR (score = ?1 AND (played_at < ?2 OR (played_at = ?2 AND id <= ?3)))`
    : `SELECT COUNT(*) AS placement
       FROM leaderboard_scores
       WHERE score > ?1 OR (score = ?1 AND id <= ?2)`;

  const bound = caps.hasPlayedAt
    ? env.DB.prepare(sql).bind(normalizedScore, normalizedPlayedAt, normalizedRowId)
    : env.DB.prepare(sql).bind(normalizedScore, normalizedRowId);
  const { results } = await bound.all();
  return Math.max(1, Math.floor(Number(results?.[0]?.placement) || 1));
}

async function insertScore(env, name, score, species, playedAt) {
  const now = Date.now();
  const caps = await getSchemaCapabilities(env);
  const normalizedPlayedAt = normalizePlayedAt(playedAt);
  let insertedRowId = 0;

  if (caps.hasSpecies && caps.hasPlayedAt) {
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
    const cleanupSql = caps.hasPlayedAt
      ? `DELETE FROM leaderboard_scores
         WHERE id NOT IN (
           SELECT id
           FROM leaderboard_scores
           ORDER BY score DESC, played_at ASC, id ASC
           LIMIT 500
         )`
      : `DELETE FROM leaderboard_scores
         WHERE id NOT IN (
           SELECT id
           FROM leaderboard_scores
           ORDER BY score DESC, created_at ASC, id ASC
           LIMIT 500
         )`;
    await env.DB.prepare(cleanupSql).run();
  }

  return {
    rowId: insertedRowId,
    playedAt: normalizedPlayedAt
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
      const entries = await readTopScores(env);
      const totalEntries = await countScores(env);
      return jsonResponse({ entries, totalEntries, updatedAt: Date.now() }, request, env, 200);
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

      if (score < MIN_SCORE) {
        return jsonResponse({ error: "Score must be a positive integer" }, request, env, 400);
      }
      if (!isNameAllowed(name)) {
        return jsonResponse({ error: "Name unavailable", errorCode: "invalid_name" }, request, env, 422);
      }

      const inserted = await insertScore(env, name, score, species, playedAt);
      const entries = await readTopScores(env);
      const totalEntries = await countScores(env);
      const rank = await computeRank(env, score, inserted.playedAt, inserted.rowId);
      return jsonResponse({ ok: true, entries, rank, totalEntries, updatedAt: Date.now() }, request, env, 201);
    }

    return jsonResponse({ error: "Method not allowed" }, request, env, 405);
  }
};
