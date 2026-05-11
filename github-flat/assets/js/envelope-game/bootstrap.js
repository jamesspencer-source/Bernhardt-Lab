const params = new URLSearchParams(window.location.search);
const wantsV2 = params.has("envelopeV2") && !params.has("envelopeLegacy");

if (wantsV2) {
  const trigger = document.getElementById("envelope-trigger");
  if (trigger) {
    let v2Failed = false;
    trigger.setAttribute("title", "...");
    trigger.setAttribute("aria-label", "Open Envelope Escape V2 beta");
    const sr = trigger.querySelector(".sr-only");
    if (sr) sr.textContent = "Open Envelope Escape V2 beta";
    trigger.addEventListener(
      "click",
      async (event) => {
        if (v2Failed) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        try {
          const game = await import("../../game/envelope-escape/runtime/envelope-escape-v2.js?v=20260504a");
          await game.openEnvelopeEscapeV2();
        } catch (error) {
          console.error("Envelope Escape V2 failed to start; falling back to V1.", error);
          v2Failed = true;
          window.alert("Envelope Escape V2 beta failed to load. Click the footer game trigger again to open the current game.");
        }
      },
      true
    );
  }
}
