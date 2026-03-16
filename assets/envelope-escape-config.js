// Shared/global leaderboard endpoint bootstrap.
// Priority:
// 1) Explicit value in this file (`hardcodedEndpoint`)
// 2) <meta name="bernhardt-leaderboard-url" content="https://.../leaderboard">
//
// Set `hardcodedEndpoint` to your deployed Cloudflare Worker public route to
// enable one persistent leaderboard for all site visitors.
(function configureEnvelopeLeaderboard() {
  const hardcodedEndpoint = "";
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
