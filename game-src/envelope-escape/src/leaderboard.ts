import { SPECIES } from "./content";
import { normalizeBoard, normalizeSpeciesId } from "./simulation";
import type { LeaderboardPayload, ScoreEntry } from "./types";

const STORAGE_VERSION = "v2-survival";
const BOARD_PREFIX = `bernhardt-envelope-escape-board-${STORAGE_VERSION}-`;
const LEADERBOARD_SIZE = 25;
const REQUEST_TIMEOUT_MS = 9000;

export function createLeaderboardClient(options: { url?: string; size?: number } = {}) {
  const url = String(options.url || "").trim();
  const size = Math.max(5, Math.floor(Number(options.size) || LEADERBOARD_SIZE));

  function readLocal(board: string): ScoreEntry[] {
    return normalizeEntries(readJson(localKey(board), []), board, size);
  }

  function writeLocal(board: string, entries: ScoreEntry[]): void {
    writeJson(localKey(board), normalizeEntries(entries, board, size));
  }

  async function refresh(board: string): Promise<LeaderboardPayload> {
    const normalizedBoard = normalizeBoard(board);
    const localEntries = readLocal(normalizedBoard);
    if (!url) return { mode: "local", entries: localEntries, totalEntries: localEntries.length, updatedAt: Date.now(), board: normalizedBoard };
    try {
      const payload = await fetchJson(`${url}?board=${encodeURIComponent(normalizedBoard)}`, { method: "GET", headers: { Accept: "application/json" } });
      if (!acceptRemoteBoard(normalizedBoard, payload?.board)) throw new Error("Remote board mismatch");
      const entries = normalizeEntries(payload?.entries, normalizedBoard, size);
      writeLocal(normalizedBoard, entries);
      return { mode: "global", entries, totalEntries: Math.max(entries.length, Math.floor(Number(payload?.totalEntries) || 0)), updatedAt: Math.floor(Number(payload?.updatedAt) || Date.now()), board: normalizedBoard };
    } catch {
      return { mode: "fallback", entries: localEntries, totalEntries: localEntries.length, updatedAt: Date.now(), board: normalizedBoard };
    }
  }

  async function submit(entry: ScoreEntry): Promise<LeaderboardPayload> {
    const normalizedBoard = normalizeBoard(entry.board);
    const normalizedEntry = normalizeEntry(entry, normalizedBoard);
    if (!url) {
      const entries = normalizeEntries([normalizedEntry, ...readLocal(normalizedBoard)], normalizedBoard, size);
      writeLocal(normalizedBoard, entries);
      return makeLocalSubmitPayload("local", entries, normalizedEntry, normalizedBoard);
    }
    try {
      const payload = await fetchJson(url, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(normalizedEntry) });
      if (!acceptRemoteBoard(normalizedBoard, payload?.board)) throw new Error("Remote board mismatch");
      const entries = normalizeEntries(payload?.entries, normalizedBoard, size);
      writeLocal(normalizedBoard, entries);
      return { mode: "global", ok: true, entries, rank: Math.max(1, Math.floor(Number(payload?.rank) || computeRank(entries, normalizedEntry))), totalEntries: Math.max(entries.length, Math.floor(Number(payload?.totalEntries) || 0)), updatedAt: Math.floor(Number(payload?.updatedAt) || Date.now()), board: normalizedBoard };
    } catch {
      const entries = normalizeEntries([normalizedEntry, ...readLocal(normalizedBoard)], normalizedBoard, size);
      writeLocal(normalizedBoard, entries);
      return makeLocalSubmitPayload("fallback", entries, normalizedEntry, normalizedBoard);
    }
  }

  return { refresh, submit, readLocal, writeLocal };
}

function makeLocalSubmitPayload(mode: "local" | "fallback", entries: ScoreEntry[], entry: ScoreEntry, board: string): LeaderboardPayload {
  return { mode, ok: true, entries, rank: computeRank(entries, entry), totalEntries: entries.length, updatedAt: Date.now(), board };
}

async function fetchJson(url: string, options: RequestInit): Promise<any> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await window.fetch(url, { ...options, signal: controller.signal });
    if (!response.ok) throw new Error(`Leaderboard request failed with ${response.status}`);
    return await response.json();
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function localKey(board: string): string {
  return `${BOARD_PREFIX}${normalizeBoard(board)}`;
}

function readJson(key: string, fallback: ScoreEntry[]): ScoreEntry[] {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: ScoreEntry[]): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* no-op */
  }
}

function normalizeEntries(entries: unknown, board: string, size: number): ScoreEntry[] {
  const normalizedBoard = normalizeBoard(board);
  return (Array.isArray(entries) ? entries : [])
    .map((entry) => normalizeEntry(entry, normalizedBoard))
    .filter((entry) => entry.score > 0 && entry.board === normalizedBoard)
    .sort((left, right) => (right.score !== left.score ? right.score - left.score : left.playedAt - right.playedAt))
    .slice(0, size);
}

function normalizeEntry(entry: any, board: string): ScoreEntry {
  return {
    name: cleanName(entry?.name) || "Anonymous",
    score: clamp(Math.floor(Number(entry?.score) || 0), 0, 2000000000),
    species: Object.prototype.hasOwnProperty.call(SPECIES, entry?.species) ? normalizeSpeciesId(entry?.species) : "ecoli",
    playedAt: Math.floor(Number(entry?.playedAt || entry?.createdAt) || Date.now()),
    board: normalizeBoard(entry?.board || board)
  };
}

function cleanName(value: unknown): string {
  return String(value || "").replace(/[^A-Za-z0-9 ._'-]/g, "").replace(/\s+/g, " ").trim().slice(0, 24);
}

function acceptRemoteBoard(board: string, payloadBoard: unknown): boolean {
  const normalizedPayloadBoard = payloadBoard ? normalizeBoard(payloadBoard) : "";
  return normalizedPayloadBoard === board || (board === "classic" && !normalizedPayloadBoard);
}

function computeRank(entries: ScoreEntry[], entry: ScoreEntry): number {
  const index = entries.findIndex((candidate) => candidate.name === entry.name && candidate.score === entry.score && candidate.playedAt === entry.playedAt && candidate.board === entry.board);
  if (index >= 0) return index + 1;
  const sorted = normalizeEntries([entry, ...entries], entry.board, Math.max(entries.length + 1, LEADERBOARD_SIZE + 1));
  const sortedIndex = sorted.findIndex((candidate) => candidate.playedAt === entry.playedAt && candidate.score === entry.score);
  return sortedIndex >= 0 ? sortedIndex + 1 : sorted.length + 1;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
