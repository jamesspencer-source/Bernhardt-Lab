export type RandomFn = () => number;

export function hashString(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function createSeededRandom(seed: number): RandomFn {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let next = state;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomRange(random: RandomFn, min: number, max: number): number {
  return min + (max - min) * random();
}

export function pick<T>(random: RandomFn, items: T[]): T {
  return items[Math.max(0, Math.min(items.length - 1, Math.floor(random() * items.length)))];
}
