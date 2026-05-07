import { DAILY_PROFILES, SPECIES_ORDER } from "./content";
import type { DailyChallenge } from "./types";

export interface RngStateOwner {
  rngState: number;
}

export function hashString(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function normalizeSeed(seed: number | string | undefined, fallback = 1): number {
  if (typeof seed === "string") return hashString(seed) || fallback;
  const normalized = Math.floor(Number(seed));
  return Number.isFinite(normalized) && normalized > 0 ? normalized >>> 0 : fallback >>> 0 || 1;
}

export function advanceRng(rngState: number): { rngState: number; value: number } {
  const nextState = (Math.imul(1664525, rngState >>> 0 || 1) + 1013904223) >>> 0;
  return { rngState: nextState, value: nextState / 4294967296 };
}

export function createSeededRandom(seed: number | string): () => number {
  let rngState = normalizeSeed(seed);
  return () => {
    const next = advanceRng(rngState);
    rngState = next.rngState;
    return next.value;
  };
}

export function randomFloat(owner: RngStateOwner): number {
  const next = advanceRng(owner.rngState);
  owner.rngState = next.rngState;
  return next.value;
}

export function randomRange(owner: RngStateOwner, min: number, max: number): number {
  return min + (max - min) * randomFloat(owner);
}

export function randomInt(owner: RngStateOwner, minInclusive: number, maxInclusive: number): number {
  return Math.floor(randomRange(owner, minInclusive, maxInclusive + 1));
}

export function pick<T>(owner: RngStateOwner, values: readonly T[]): T {
  return values[Math.min(values.length - 1, Math.floor(randomFloat(owner) * values.length))];
}

export function pickWeighted<T extends { weight?: number }>(owner: RngStateOwner, values: readonly T[]): T {
  const total = values.reduce((sum, value) => sum + Math.max(0, value.weight ?? 1), 0);
  if (total <= 0) return pick(owner, values);
  let cursor = randomFloat(owner) * total;
  for (const value of values) {
    cursor -= Math.max(0, value.weight ?? 1);
    if (cursor <= 0) return value;
  }
  return values[values.length - 1];
}

export function getDailyDateKey(date = new Date(), timeZone = "America/New_York"): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value || "1970";
  const month = parts.find((part) => part.type === "month")?.value || "01";
  const day = parts.find((part) => part.type === "day")?.value || "01";
  return `${year}-${month}-${day}`;
}

export function normalizeDateKey(value: string | undefined, fallback = getDailyDateKey()): string {
  const dateKey = String(value || "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(dateKey) ? dateKey : fallback;
}

export function buildDailySeed(dateKey = getDailyDateKey(), salt = "envelope-escape-v3-daily"): number {
  return hashString(`${salt}:${normalizeDateKey(dateKey)}`) || 1;
}

export function buildDailyChallenge(dateKey = getDailyDateKey()): DailyChallenge {
  const normalizedDateKey = normalizeDateKey(dateKey);
  const rng = { rngState: buildDailySeed(normalizedDateKey) };
  const profile = pick(rng, DAILY_PROFILES);
  const speciesId = pick(rng, SPECIES_ORDER);
  const seed = hashString(`envelope-escape-v3-run:${normalizedDateKey}:${profile.id}:${speciesId}`) || 1;
  return {
    dateKey: normalizedDateKey,
    board: `daily-${normalizedDateKey}`,
    seed,
    profile,
    speciesId
  };
}
