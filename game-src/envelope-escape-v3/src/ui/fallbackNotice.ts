import { ENVELOPE_V3_STYLESHEET_HREF, ENVELOPE_V3_STYLESHEET_ID, PROCEDURAL_ASSET_MANIFEST } from "../assets/procedural-manifest";

let fallbackDialog: HTMLDialogElement | null = null;

export function ensureEnvelopeV3Stylesheet(href = ENVELOPE_V3_STYLESHEET_HREF): void {
  if (document.getElementById(ENVELOPE_V3_STYLESHEET_ID)) return;
  const link = document.createElement("link");
  link.id = ENVELOPE_V3_STYLESHEET_ID;
  link.rel = "stylesheet";
  link.href = href;
  document.head.append(link);
}

export function openEnvelopeV3Fallback(reason = "WebGL did not initialize."): void {
  ensureEnvelopeV3Stylesheet();
  fallbackDialog?.remove();
  fallbackDialog = document.createElement("dialog");
  fallbackDialog.className = "envelope-v3-modal envelope-v3-fallback-modal";
  fallbackDialog.setAttribute("aria-labelledby", "envelope-v3-fallback-title");
  fallbackDialog.innerHTML = `
    <div class="envelope-v3-shell">
      <header class="envelope-v3-topbar">
        <div>
          <p class="envelope-v3-eyebrow">Hidden Lab Arcade</p>
          <h2 id="envelope-v3-fallback-title">Envelope Escape V3: WebGL Fallback</h2>
        </div>
        <div class="envelope-v3-actions">
          <button data-v3-fallback-close type="button" aria-label="Close fallback notice">Close</button>
        </div>
      </header>
      <main class="envelope-v3-layout is-fallback-only">
        <section class="envelope-v3-stage">
          <section class="envelope-v3-fallback">
            <p class="envelope-v3-kicker">3D chamber unavailable</p>
            <h3>V3 is mounted, but the renderer is gated on this device.</h3>
            <p>${escapeHtml(reason)}</p>
            <p>The shipped fallback path keeps integration visible while the production bundle uses the ${escapeHtml(PROCEDURAL_ASSET_MANIFEST.mode)} renderer or future GLB assets.</p>
          </section>
        </section>
      </main>
    </div>
  `;
  document.body.append(fallbackDialog);
  fallbackDialog.querySelector("[data-v3-fallback-close]")?.addEventListener("click", () => {
    fallbackDialog?.close();
  });
  fallbackDialog.addEventListener("close", () => {
    fallbackDialog?.remove();
    fallbackDialog = null;
  });
  if (typeof fallbackDialog.showModal === "function") fallbackDialog.showModal();
  else fallbackDialog.setAttribute("open", "");
}

function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const map: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return map[character];
  });
}
