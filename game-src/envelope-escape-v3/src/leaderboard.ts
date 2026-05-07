import { normalizeBoard } from "./simulation";
import type { LeaderboardPayload, ScoreEntry } from "./types";

const STORAGE_PREFIX = "bernhardt-envelope-escape-v3-board-";
const REQUEST_TIMEOUT_MS = 9000;

export function createLeaderboardClient({ url = "" }: { url?: string }) {
  const endpoint = String(url || "").trim();

  async function refresh(board = "classic"): Promise<LeaderboardPayload> {
    const normalizedBoard = normalizeBoard(board);
    const local = readLocal(normalizedBoard);
    if (!endpoint) return payload(local, normalizedBoard, "local");
    try {
      const response = await requestJson(`${endpoint}?board=${encodeURIComponent(normalizedBoard)}`);
      const entries = normalizeEntries(response?.entries, normalizedBoard);
      writeLocal(normalizedBoard, entries);
      return {
        entries,
        totalEntries: Math.max(entries.length, Math.floor(Number(response?.totalEntries) || 0)),
        updatedAt: Math.floor(Number(response?.updatedAt) || Date.now()),
        board: normalizeBoard(response?.board || normalizedBoard),
        mode: "global"
      };
    } catch {
      return payload(local, normalizedBoard, "fallback");
    }
  }

  async function submit(entry: ScoreEntry): Promise<LeaderboardPayload> {
    const normalizedEntry = normalizeEntry(entry, normalizeBoard(entry.board));
    const localEntries = normalizeEntries([normalizedEntry, ...readLocal(normalizedEntry.board)], normalizedEntry.board);
    writeLocal(normalizedEntry.board, localEntries);
    if (!endpoint) return { ...payload(localEntries, normalizedEntry.board, "local"), rank: rank(localEntries, normalizedEntry) };
    try {
      const response = await requestJson(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalizedEntry)
      });
      const entries = normalizeEntries(response?.entries, normalizedEntry.board);
      writeLocal(normalizedEntry.board, entries);
      return {
        entries,
        totalEntries: Math.max(entries.length, Math.floor(Number(response?.totalEntries) || 0)),
        updatedAt: Math.floor(Number(response?.updatedAt) || Date.now()),
        board: normalizeBoard(response?.board || normalizedEntry.board),
        mode: "global",
        rank: Math.max(1, Math.floor(Number(response?.rank) || rank(entries, normalizedEntry)))
      };
    } catch {
      return { ...payload(localEntries, normalizedEntry.board, "fallback"), rank: rank(localEntries, normalizedEntry) };
    }
  }

  return { refresh, submit, readLocal, writeLocal };
}

function payload(entries: ScoreEntry[], board: string, mode: LeaderboardPayload["mode"]): LeaderboardPayload {
  return { entries, totalEntries: entries.length, updatedAt: Date.now(), board, mode };
}

async function requestJson(url: string, options: RequestInit = {}): Promise<any> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await window.fetch(url, { ...options, signal: controller.signal });
    if (!response.ok) throw new Error(`Leaderboard request failed: ${response.status}`);
    return await response.json();
  } finally {
    window.clearTimeout(timeout);
  }
}

function readLocal(board: string): ScoreEntry[] {
  try {
    return normalizeEntries(JSON.parse(window.localStorage.getItem(`${STORAGE_PREFIX}${normalizeBoard(board)}`) || "[]"), board);
  } catch {
    return [];
  }
}

function writeLocal(board: string, entries: ScoreEntry[]): void {
  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}${normalizeBoard(board)}`, JSON.stringify(normalizeEntries(entries, board).slice(0, 25)));
  } catch {
    /* no-op */
  }
}

function normalizeEntries(value: unknown, board: string): ScoreEntry[] {
  const rows = Array.isArray(value) ? value : [];
  return rows.map((item) => normalizeEntry(item, board)).sort((a, b) => b.score - a.score || b.playedAt - a.playedAt).slice(0, 25);
}

function normalizeEntry(value: unknown, fallbackBoard: string): ScoreEntry {
  const item = (value || {}) as Partial<ScoreEntry>;
  return {
    name: String(item.name || "Anonymous").slice(0, 24),
    score: Math.max(0, Math.floor(Number(item.score) || 0)),
    species: item.species || "ecoli",
    playedAt: Math.max(0, Math.floor(Number(item.playedAt) || Date.now())),
    board: normalizeBoard(item.board || fallbackBoard)
  };
}

function rank(entries: ScoreEntry[], entry: ScoreEntry): number {
  const index = entries.findIndex((item) => item.playedAt === entry.playedAt && item.score === entry.score && item.name === entry.name);
  return index >= 0 ? index + 1 : Math.max(1, entries.filter((item) => item.score > entry.score).length + 1);
}
