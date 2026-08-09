function loadStylesheet(url) {
  return new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    link.addEventListener("load", resolve, { once: true });
    link.addEventListener("error", () => reject(new Error(`Could not load ${url}`)), { once: true });
    document.head.appendChild(link);
  });
}

function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = url;
    script.addEventListener("load", resolve, { once: true });
    script.addEventListener("error", () => reject(new Error(`Could not load ${url}`)), { once: true });
    document.body.appendChild(script);
  });
}

export function initEnvelopeGameLoader() {
  const trigger = document.getElementById("envelope-trigger");
  if (!trigger) return;

  const styleUrl = trigger.dataset.gameStyle;
  const configUrl = trigger.dataset.gameConfig;
  const scriptUrl = trigger.dataset.gameScript;
  const liveStatus = document.getElementById("envelope-live-status");
  if (!styleUrl || !configUrl || !scriptUrl) return;

  let gameReady = false;
  let loadPromise = null;
  let openRequestInFlight = false;

  const loadGame = () => {
    if (!loadPromise) {
      trigger.setAttribute("aria-busy", "true");
      loadPromise = Promise.all([loadStylesheet(styleUrl), loadScript(configUrl)])
        .then(() => loadScript(scriptUrl))
        .then(() => {
          gameReady = true;
          trigger.removeAttribute("aria-busy");
        });
    }
    return loadPromise;
  };

  trigger.addEventListener("click", async (event) => {
    if (gameReady) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (openRequestInFlight) return;

    openRequestInFlight = true;
    try {
      if (liveStatus) liveStatus.textContent = "Loading Envelope Escape.";
      await loadGame();
      if (liveStatus) liveStatus.textContent = "Envelope Escape loaded.";
      trigger.click();
    } catch (error) {
      loadPromise = null;
      trigger.removeAttribute("aria-busy");
      if (liveStatus) liveStatus.textContent = "Envelope Escape could not be loaded. Please try again.";
      console.error("Envelope Escape failed to load", error);
    } finally {
      openRequestInFlight = false;
    }
  });
}
