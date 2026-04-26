import { DAILY_PROFILES, SPECIES_ORDER } from "./content";
import type { DailyChallenge } from "./types";

export function hashString(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0 || 1;
  return () => {
    state = Math.imul(1664525, state) + 1013904223;
    return ((state >>> 0) / 4294967296);
  };
}

export function randomRange(rng: () => number, min: number, max: number): number {
  return min + (max - min) * rng();
}

export function pick<T>(rng: () => number, values: readonly T[]): T {
  return values[Math.min(values.length - 1, Math.floor(rng() * values.length))];
}

export function getLabDateKey(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

export function buildDailyChallenge(dateKey = getLabDateKey()): DailyChallenge {
  const rng = createSeededRandom(hashString(`envelope-v3-daily-${dateKey}`));
  const profile = pick(rng, DAILY_PROFILES);
  const speciesId = pick(rng, SPECIES_ORDER);
  return {
    dateKey,
    board: `daily-${dateKey}`,
    profile,
    speciesId
  };
}
