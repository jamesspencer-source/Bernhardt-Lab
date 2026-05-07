export interface EnvelopeV3WebGLSupport {
  ok: boolean;
  context?: "webgl2" | "webgl";
  reason?: string;
}

export function detectEnvelopeV3WebGLSupport(options: { allowCoarsePointer?: boolean; minWidth?: number } = {}): EnvelopeV3WebGLSupport {
  if (typeof document === "undefined") {
    return { ok: false, reason: "Envelope Escape V3 needs a browser document to create the WebGL chamber." };
  }
  const minWidth = Math.max(0, Math.floor(options.minWidth ?? 900));
  const coarsePointer = window.matchMedia?.("(pointer: coarse)")?.matches || false;
  if (!options.allowCoarsePointer && (coarsePointer || window.innerWidth < minWidth)) {
    return { ok: false, reason: "Envelope Escape V3 is currently gated to desktop-class pointer and viewport settings." };
  }
  const canvas = document.createElement("canvas");
  try {
    if (canvas.getContext("webgl2", contextOptions())) return { ok: true, context: "webgl2" };
    if (canvas.getContext("webgl", contextOptions())) return { ok: true, context: "webgl" };
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : "WebGL detection failed." };
  }
  return { ok: false, reason: "WebGL is disabled, unavailable, or blocked by this browser's graphics policy." };
}

function contextOptions(): WebGLContextAttributes {
  return {
    alpha: false,
    antialias: true,
    depth: true,
    powerPreference: "high-performance"
  };
}
