const MAX_NAME_LENGTH = 24;
const MIN_SCORE = 1;
const MAX_SCORE = 2000000000;
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

const RUN_LIFETIME_MS = 2 * 60 * 60 * 1000;
const HISTORY_MS = 31 * 24 * 60 * 60 * 1000;
const MAX_ACTIVE_RUNS = 1000;
const MAX_SAVED_RUNS = 5000;
const MAX_BODY_BYTES = 1024;
const RUN_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

class RequestError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

function dailyBoard(now) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(now);
  const part = type => parts.find(item => item.type === type).value;
  return `daily-${part("year")}-${part("month")}-${part("day")}`;
}

function boardName(value = "classic") {
  if (typeof value !== "string" || !BOARD_PATTERN.test(value)) throw new RequestError("Invalid board");
  if (value !== "classic") {
    const date = value.slice(6);
    const timestamp = Date.parse(date + "T12:00:00Z");
    if (!Number.isFinite(timestamp) || new Date(timestamp).toISOString().slice(0, 10) !== date) {
      throw new RequestError("Invalid daily date");
    }
  }
  return value;
}

async function readPayload(request) {
  if (request.headers.get("Content-Type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    throw new RequestError("Content-Type must be application/json", 415);
  }
  const declared = request.headers.get("Content-Length");
  if (declared !== null && (!/^\d+$/.test(declared) || Number(declared) > MAX_BODY_BYTES)) {
    throw new RequestError("Request body too large", 413);
  }
  if (!request.body) throw new RequestError("Missing JSON body");
  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new RequestError("Request body too large", 413);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  let payload;
  try { payload = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)); }
  catch { throw new RequestError("Invalid JSON body"); }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new RequestError("JSON body must be an object");
  }
  return payload;
}

function validatePayload(payload, starting) {
  const allowed = new Set(starting ? ["board", "species"] : ["board", "species", "name", "score", "runId"]);
  if (Object.keys(payload).some(key => !allowed.has(key))) throw new RequestError("Unexpected field");
  const board = boardName(payload.board);
  if (typeof payload.species !== "string" || !SPECIES_CODES.has(payload.species)) {
    throw new RequestError("Invalid species");
  }
  if (starting) return { board, species: payload.species };
  if (typeof payload.runId !== "string" || !RUN_ID_PATTERN.test(payload.runId)) {
    throw new RequestError("Start a new run before submitting", 409);
  }
  if (!Number.isSafeInteger(payload.score) || payload.score < MIN_SCORE || payload.score > MAX_SCORE) {
    throw new RequestError("Score must be a positive integer");
  }
  if (payload.name !== undefined && (typeof payload.name !== "string" || payload.name.length > 128)) {
    throw new RequestError("Invalid name");
  }
  const name = normalizeName(payload.name) || "Anonymous";
  if (!isNameAllowed(name)) throw new RequestError("Name unavailable", 422);
  return { ...payload, board, name };
}

async function limitWrites(request, env) {
  if (!env.WRITE_LIMITER?.limit || !env.CLIENT_LIMITER?.limit) {
    throw new RequestError("Shared submissions are temporarily unavailable", 503);
  }
  const globalLimit = await env.WRITE_LIMITER.limit({ key: "leaderboard-writes" });
  // IP is used only for a short-lived rate bucket, never persisted in D1.
  const clientLimit = await env.CLIENT_LIMITER.limit({ key: request.headers.get("CF-Connecting-IP") || "unknown" });
  if (!globalLimit.success || !clientLimit.success) throw new RequestError("Please wait before submitting again", 429);
}

async function hasRunSchema(env) {
  const { results } = await env.DB.prepare("PRAGMA table_info(leaderboard_runs)").all();
  const names = new Set(results.map(row => row.name));
  return ["id", "board", "species", "started_at", "expires_at", "submitted_at", "name", "score"]
    .every(name => names.has(name));
}

async function cleanup(env, now) {
  // This table contains only new casual runs; historical scores are never pruned by new submissions.
  await env.DB.batch([
    env.DB.prepare("DELETE FROM leaderboard_runs WHERE score IS NULL AND expires_at < ?1").bind(now),
    env.DB.prepare("DELETE FROM leaderboard_runs WHERE score IS NOT NULL AND submitted_at < ?1").bind(now - HISTORY_MS),
    env.DB.prepare(`DELETE FROM leaderboard_runs WHERE score IS NOT NULL AND id IN (
      SELECT id FROM (SELECT id, ROW_NUMBER() OVER (PARTITION BY board ORDER BY score DESC, submitted_at ASC, id ASC) AS position
      FROM leaderboard_runs WHERE score IS NOT NULL) WHERE position > 500)`),
    env.DB.prepare(`DELETE FROM leaderboard_runs WHERE score IS NOT NULL AND id NOT IN (
      SELECT id FROM leaderboard_runs WHERE score IS NOT NULL ORDER BY submitted_at DESC, id DESC LIMIT ${MAX_SAVED_RUNS})`)
  ]);
}

async function startRun(env, entry, now) {
  if (entry.board !== "classic" && entry.board !== dailyBoard(now)) {
    throw new RequestError("Daily runs must start on today's board");
  }
  await cleanup(env, now);
  const runId = crypto.randomUUID();
  const expiresAt = now + RUN_LIFETIME_MS;
  const result = await env.DB.prepare(`INSERT INTO leaderboard_runs (id, board, species, started_at, expires_at)
    SELECT ?1, ?2, ?3, ?4, ?5 WHERE (SELECT COUNT(*) FROM leaderboard_runs WHERE score IS NULL) < ?6`)
    .bind(runId, entry.board, entry.species, now, expiresAt, MAX_ACTIVE_RUNS).run();
  if (!result.meta.changes) throw new RequestError("Shared board is busy; please try again later", 503);
  return { runId, board: entry.board, species: entry.species, expiresAt, submissionProtocol: 2, ranking: "casual-unverified" };
}

async function submitRun(env, entry, now) {
  const run = await env.DB.prepare("SELECT * FROM leaderboard_runs WHERE id = ?1").bind(entry.runId).first();
  if (!run || run.expires_at < now || run.board !== entry.board || run.species !== entry.species) {
    throw new RequestError("Run expired or does not match this board", 409);
  }
  if (run.score !== null && (run.score !== entry.score || run.name !== entry.name)) {
    throw new RequestError("This run has already been submitted", 409);
  }
  const seconds = Math.max(0, (now - run.started_at) / 1000);
  // A conservative abuse ceiling, not proof of gameplay. Paused time is allowed.
  if (seconds < 2 || entry.score > 500 + seconds * 300) throw new RequestError("Score is not plausible for this run", 422);
  await env.DB.prepare(`UPDATE leaderboard_runs SET name = ?1, score = ?2, submitted_at = ?3
    WHERE id = ?4 AND score IS NULL AND expires_at >= ?3`).bind(entry.name, entry.score, now, entry.runId).run();
  const saved = await env.DB.prepare("SELECT * FROM leaderboard_runs WHERE id = ?1").bind(entry.runId).first();
  if (!saved || saved.name !== entry.name || saved.score !== entry.score) throw new RequestError("Run already submitted", 409);
  await cleanup(env, now);
  return { name: saved.name, score: saved.score, species: saved.species, board: saved.board,
    playedAt: saved.submitted_at, createdAt: saved.submitted_at, runId: saved.id };
}

async function legacyRows(env, board) {
  const { results: columns } = await env.DB.prepare("PRAGMA table_info(leaderboard_scores)").all();
  const names = new Set(columns.map(row => row.name));
  if (!names.has("name") || !names.has("score") || !names.has("created_at") || (!names.has("board") && board !== "classic")) return [];
  const played = names.has("played_at") ? "COALESCE(NULLIF(played_at, 0), created_at)" : "created_at";
  const species = names.has("species") ? "species" : "'unknown'";
  const boardColumn = names.has("board") ? "board" : "'classic'";
  let query = env.DB.prepare(`SELECT name, score, ${species} AS species, ${played} AS playedAt,
    created_at AS createdAt, ${boardColumn} AS board FROM leaderboard_scores
    ${names.has("board") ? "WHERE board = ?1" : ""} ORDER BY score DESC, ${played} ASC, id ASC LIMIT 500`);
  if (names.has("board")) query = query.bind(board);
  return (await query.all()).results;
}

async function boardSnapshot(env, board, ready, now) {
  const entries = await legacyRows(env, board);
  if (ready) {
    const { results } = await env.DB.prepare(`SELECT id AS runId, name, score, species, board,
      submitted_at AS playedAt, submitted_at AS createdAt FROM leaderboard_runs
      WHERE board = ?1 AND score IS NOT NULL AND submitted_at >= ?2 ORDER BY score DESC, submitted_at ASC, id ASC LIMIT 500`)
      .bind(board, now - HISTORY_MS).all();
    entries.push(...results);
  }
  entries.sort((a, b) => b.score - a.score || a.playedAt - b.playedAt || String(a.runId || "").localeCompare(String(b.runId || "")));
  return { entries: entries.slice(0, 25).map(entry => ({
    ...entry, name: isNameAllowed(entry.name) ? normalizeName(entry.name) || "Anonymous" : "Anonymous"
  })), totalEntries: entries.length, updatedAt: now, board,
    submissionProtocol: ready ? 2 : 0, ranking: "casual-unverified" };
}

export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname.replace(/\/+$/, "") || "/";
    const starting = path === "/leaderboard/runs" || path === "/api/leaderboard/runs";
    const scores = path === "/leaderboard" || path === "/api/leaderboard";
    if (!starting && !scores) return jsonResponse({ error: "Not found" }, request, env, 404);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: getCorsHeaders(request, env) });
    try {
      const now = Date.now();
      if (request.method === "GET" && scores) {
        const board = boardName(new URL(request.url).searchParams.get("board") ?? undefined);
        return jsonResponse(await boardSnapshot(env, board, await hasRunSchema(env), now), request, env);
      }
      if (request.method !== "POST") throw new RequestError("Method not allowed", 405);
      await limitWrites(request, env);
      const entry = validatePayload(await readPayload(request), starting);
      if (!await hasRunSchema(env)) throw new RequestError("Shared submissions need a database update", 503);
      if (starting) return jsonResponse(await startRun(env, entry, now), request, env, 201);
      const saved = await submitRun(env, entry, now);
      const snapshot = await boardSnapshot(env, entry.board, true, now);
      const { results } = await env.DB.prepare(`SELECT COUNT(*) AS ahead FROM leaderboard_runs
        WHERE board = ?1 AND score IS NOT NULL AND submitted_at >= ?2
        AND (score > ?3 OR (score = ?3 AND (submitted_at < ?4 OR (submitted_at = ?4 AND id < ?5))))`)
        .bind(entry.board, now - HISTORY_MS, saved.score, saved.playedAt, saved.runId).all();
      const oldAhead = (await legacyRows(env, entry.board)).filter(row => row.score > saved.score ||
        (row.score === saved.score && row.playedAt <= saved.playedAt)).length;
      return jsonResponse({ ...snapshot, ok: true, entry: saved, rank: 1 + oldAhead + results[0].ahead }, request, env, 201);
    } catch (error) {
      const status = error instanceof RequestError ? error.status : 503;
      return jsonResponse({ error: error instanceof RequestError ? error.message : "Shared board temporarily unavailable" }, request, env, status);
    }
  },
  async scheduled(_event, env) {
    if (await hasRunSchema(env)) await cleanup(env, Date.now());
  }
};
