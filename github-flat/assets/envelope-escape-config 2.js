// Generated from data/runtime-config.json.
(function configureEnvelopeLeaderboard() {
  const hardcodedEndpoint = "https://bernhardt-lab-leaderboard.jmspencer1996.workers.dev/leaderboard";
  const META_NAME = "bernhardt-leaderboard-url";

  const cleanUrl = (value) => {
    const raw = String(value || "").trim();
    if (!raw) return "";
    try {
      const parsed = new URL(raw, window.location.origin);
      if (!/^https?:$/i.test(parsed.protocol)) return "";
      if (!/\/(api\/)?leaderboard$/i.test(parsed.pathname)) return "";
      return parsed.toString();
    } catch {
      return "";
    }
  };

  const metaCandidate = (() => {
    const meta = document.querySelector(`meta[name="${META_NAME}"]`);
    return cleanUrl(meta ? meta.getAttribute("content") : "");
  })();

  window.ENVELOPE_LEADERBOARD_URL = cleanUrl(hardcodedEndpoint) || metaCandidate || "";
})();
