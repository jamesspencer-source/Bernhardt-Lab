(function () {
  const script = document.currentScript;
  const path = script?.dataset?.freshnessPath;
  if (!path) return;

  function parseFreshnessDate(rawValue) {
    const value = String(rawValue || "").trim();
    if (!value) return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return new Date(`${value}T12:00:00Z`);
    }
    const parsed = new Date(value);
    return Number.isFinite(parsed.getTime()) ? parsed : null;
  }

  function formatFreshnessDate(rawValue) {
    const parsed = parseFreshnessDate(rawValue);
    if (!parsed) return String(rawValue || "").trim();
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(parsed);
  }

  fetch(path, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store"
  })
    .then((response) => {
      if (!response.ok) return null;
      return response.json();
    })
    .then((payload) => {
      if (!payload || typeof payload !== "object") return;
      document.querySelectorAll("[data-freshness-key]").forEach((element) => {
        const key = element.getAttribute("data-freshness-key");
        if (!key || !(key in payload)) return;
        element.textContent = formatFreshnessDate(payload[key]);
      });
    })
    .catch(() => {});
})();
