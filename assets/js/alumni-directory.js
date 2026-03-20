import { cleanText } from "./shared.js";

const BUCKET_ORDER = [
  "Postdoctoral Alumni",
  "Post-baccalaureate Alumni",
  "Graduate Alumni",
  "Undergraduate Alumni",
  "Research Staff Alumni",
  "Other Alumni",
  "Unspecified",
];

export function initAlumniDirectory() {
  const alumniRoot = document.getElementById("alumni-directory");
  const alumniCount = document.getElementById("alumni-count");
  if (!alumniRoot || !alumniCount) return;

  const cards = Array.from(alumniRoot.querySelectorAll(".alumni-card"));
  if (!cards.length) return;

  const alumniSearch = document.getElementById("alumni-search");
  const alumniFilters = document.getElementById("alumni-filters");
  const alumniSort = document.getElementById("alumni-sort");
  const state = {
    query: "",
    bucket: "All",
    sort: alumniSort?.value || "recent",
  };

  const renderFilters = () => {
    if (!alumniFilters) return;
    const counts = cards.reduce((acc, card) => {
      const bucket = cleanText(card.dataset.bucket);
      acc[bucket] = (acc[bucket] || 0) + 1;
      return acc;
    }, {});
    const orderedBuckets = BUCKET_ORDER.filter((bucket) => counts[bucket]);
    const extraBuckets = Object.keys(counts)
      .filter((bucket) => !BUCKET_ORDER.includes(bucket))
      .sort((a, b) => a.localeCompare(b));
    const buckets = ["All", ...orderedBuckets, ...extraBuckets];

    alumniFilters.innerHTML = buckets
      .map((bucket) => {
        const count = bucket === "All" ? cards.length : counts[bucket];
        const active = bucket === state.bucket ? "active" : "";
        const pressed = bucket === state.bucket ? "true" : "false";
        return `<button type="button" class="${active}" data-bucket="${bucket}" aria-pressed="${pressed}" aria-controls="alumni-directory">${bucket} (${count})</button>`;
      })
      .join("");

    alumniFilters.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        state.bucket = button.dataset.bucket || "All";
        renderFilters();
        renderDirectory();
      });
    });
  };

  const renderDirectory = () => {
    const query = cleanText(state.query).toLowerCase();
    const visible = cards.filter((card) => {
      const matchesBucket = state.bucket === "All" || cleanText(card.dataset.bucket) === state.bucket;
      if (!matchesBucket) return false;
      if (!query) return true;
      return cleanText(card.dataset.search).toLowerCase().includes(query);
    });

    const sorted = [...visible].sort((a, b) => {
      if (state.sort === "lastName") {
        const byLastName = cleanText(a.dataset.sortLastName).localeCompare(cleanText(b.dataset.sortLastName));
        if (byLastName !== 0) return byLastName;
        return cleanText(a.dataset.name).localeCompare(cleanText(b.dataset.name));
      }
      const byRecentDeparture = Number(b.dataset.sortRecent || -1) - Number(a.dataset.sortRecent || -1);
      if (byRecentDeparture !== 0) return byRecentDeparture;
      return cleanText(a.dataset.name).localeCompare(cleanText(b.dataset.name));
    });

    cards.forEach((card) => card.remove());
    sorted.forEach((card) => {
      card.hidden = false;
      alumniRoot.append(card);
    });
    cards
      .filter((card) => !sorted.includes(card))
      .forEach((card) => {
        card.hidden = true;
        alumniRoot.append(card);
      });

    const label = sorted.length === 1 ? "entry" : "entries";
    alumniCount.textContent = `Showing ${sorted.length} alumni ${label}`;

    if (!sorted.length) {
      if (!alumniRoot.querySelector(".alumni-empty")) {
        const empty = document.createElement("div");
        empty.className = "alumni-empty";
        empty.textContent = "No alumni matched that search or filter.";
        alumniRoot.append(empty);
      }
    } else {
      alumniRoot.querySelector(".alumni-empty")?.remove();
    }
  };

  alumniSearch?.addEventListener("input", (event) => {
    state.query = event.target.value;
    renderDirectory();
  });
  alumniSort?.addEventListener("change", (event) => {
    state.sort = event.target.value;
    renderDirectory();
  });

  renderFilters();
  renderDirectory();
}
