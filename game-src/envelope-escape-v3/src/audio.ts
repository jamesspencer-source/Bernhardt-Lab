export type V3Sound = "pickup" | "damage" | "dash" | "command" | "phase" | "upgrade" | "lysis";

const STORAGE_KEY = "bernhardt-envelope-escape-v3-sound";

export function createAudioController() {
  let context: AudioContext | null = null;
  let enabled = readEnabled();

  function setEnabled(value: boolean): void {
    enabled = value;
    try {
      window.localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
    } catch {
      /* no-op */
    }
  }

  function play(sound: V3Sound): void {
    if (!enabled) return;
    context = context || new AudioContext();
    if (context.state === "suspended") void context.resume();
    const now = context.currentTime;
    const sequence: Record<V3Sound, number[]> = {
      pickup: [660, 880],
      damage: [220, 120],
      dash: [360, 620],
      command: [260, 520, 980],
      phase: [196, 294, 392],
      upgrade: [440, 660, 990],
      lysis: [180, 120, 80]
    };
    sequence[sound].forEach((frequency, index) => {
      if (!context) return;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const start = now + index * 0.055;
      oscillator.type = sound === "damage" || sound === "lysis" ? "sawtooth" : "sine";
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(sound === "phase" ? 0.045 : 0.075, start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.14);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.16);
    });
  }

  return {
    get enabled() {
      return enabled;
    },
    setEnabled,
    play
  };
}

function readEnabled(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    return false;
  }
}
