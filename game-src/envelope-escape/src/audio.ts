export type SoundName = "pickup" | "damage" | "dash" | "response" | "phase" | "lysis" | "objective";

export function createAudioController() {
  let context: AudioContext | null = null;
  let enabled = readBoolean("bernhardt-envelope-audio-v3", false);

  function setEnabled(next: boolean): void {
    enabled = next;
    writeBoolean("bernhardt-envelope-audio-v3", enabled);
    if (enabled) void ensureContext();
  }

  async function ensureContext(): Promise<AudioContext | null> {
    if (!enabled) return null;
    context = context || new AudioContext();
    if (context.state === "suspended") await context.resume();
    return context;
  }

  async function play(name: SoundName): Promise<void> {
    const ctx = await ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const pattern = {
      pickup: [[620, 0.04], [880, 0.05]],
      damage: [[180, 0.08], [100, 0.08]],
      dash: [[360, 0.035], [520, 0.04]],
      response: [[330, 0.06], [660, 0.07], [990, 0.08]],
      phase: [[240, 0.07], [420, 0.08], [720, 0.1]],
      lysis: [[160, 0.1], [90, 0.18]],
      objective: [[520, 0.08], [780, 0.08], [1040, 0.1]]
    } satisfies Record<SoundName, [number, number][]>;
    pattern[name].forEach(([frequency, duration], index) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = name === "damage" || name === "lysis" ? "sawtooth" : "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, now + index * 0.055);
      gain.gain.exponentialRampToValueAtTime(0.045, now + index * 0.055 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.055 + duration);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start(now + index * 0.055);
      oscillator.stop(now + index * 0.055 + duration + 0.03);
    });
  }

  return { get enabled() { return enabled; }, setEnabled, play };
}

function readBoolean(key: string, fallback: boolean): boolean {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : raw === "true";
  } catch {
    return fallback;
  }
}

function writeBoolean(key: string, value: boolean): void {
  try {
    window.localStorage.setItem(key, String(value));
  } catch {
    /* no-op */
  }
}
