import { cleanText } from "./shared.js";

const GROUP_PRIORITY = [
  "All",
  "Faculty",
  "Research Staff",
  "Postdoctoral Fellows",
  "Graduate Students",
  "Undergraduate Researchers",
];

export function initTeamDirectory() {
  const peopleGrid = document.getElementById("people-grid");
  const peopleCount = document.getElementById("people-count");
  if (!peopleGrid || !peopleCount) return;

  const cards = Array.from(peopleGrid.querySelectorAll(".person-card"));
  if (!cards.length) return;

  const roleFilters = document.getElementById("role-filters");
  const searchInput = document.getElementById("people-search");
  const peopleSort = document.getElementById("people-sort");
  const teamFallback = document.getElementById("team-fallback");
  if (teamFallback) teamFallback.setAttribute("hidden", "");

  const state = {
    activeGroup: "All",
    query: "",
    sort: peopleSort?.value || "display",
  };

  const sortCards = (visible) =>
    [...visible].sort((a, b) => {
      if (state.sort === "name") {
        const byName = cleanText(a.dataset.sortName || a.dataset.name).localeCompare(
          cleanText(b.dataset.sortName || b.dataset.name),
        );
        if (byName !== 0) return byName;
        return Number(a.dataset.sortOriginal || 0) - Number(b.dataset.sortOriginal || 0);
      }

      if (state.sort === "position") {
        const byPosition = Number(a.dataset.sortPosition || 999) - Number(b.dataset.sortPosition || 999);
        if (byPosition !== 0) return byPosition;
        const byLastName = cleanText(a.dataset.sortLastName).localeCompare(cleanText(b.dataset.sortLastName));
        if (byLastName !== 0) return byLastName;
        return cleanText(a.dataset.name).localeCompare(cleanText(b.dataset.name));
      }

      return Number(a.dataset.sortOriginal || 0) - Number(b.dataset.sortOriginal || 0);
    });

  const renderDirectory = () => {
    const query = cleanText(state.query).toLowerCase();
    const visible = cards.filter((card) => {
      const matchesGroup = state.activeGroup === "All" || cleanText(card.dataset.group) === state.activeGroup;
      if (!matchesGroup) return false;
      if (!query) return true;
      return cleanText(card.dataset.search).toLowerCase().includes(query);
    });
    const sorted = sortCards(visible);
    const visibleSet = new Set(sorted);

    peopleGrid.querySelector(".people-empty")?.remove();
    cards.forEach((card) => card.remove());

    sorted.forEach((card, index) => {
      card.hidden = false;
      card.style.setProperty("--index", index);
      peopleGrid.append(card);
    });

    cards.forEach((card) => {
      if (visibleSet.has(card)) return;
      card.hidden = true;
      peopleGrid.append(card);
    });

    const label = sorted.length === 1 ? "member" : "members";
    peopleCount.textContent = `Showing ${sorted.length} current lab ${label}`;

    if (!sorted.length) {
      const empty = document.createElement("div");
      empty.className = "people-empty";
      empty.textContent = "No current lab members matched that search. Try a shorter phrase or choose a different group.";
      peopleGrid.append(empty);
    } else {
      peopleGrid.querySelector(".people-empty")?.remove();
    }
  };

  const renderFilters = () => {
    if (!roleFilters) return;
    const counts = cards.reduce((acc, card) => {
      const group = cleanText(card.dataset.group);
      acc[group] = (acc[group] || 0) + 1;
      return acc;
    }, {});
    const groups = GROUP_PRIORITY.filter((group) => group === "All" || counts[group]);
    roleFilters.innerHTML = groups
      .map((group) => {
        const count = group === "All" ? cards.length : counts[group];
        const pressed = group === state.activeGroup ? "true" : "false";
        const active = group === state.activeGroup ? "active" : "";
        return `<button class="${active}" type="button" data-group="${group}" aria-pressed="${pressed}" aria-controls="people-grid">${group} (${count})</button>`;
      })
      .join("");
    roleFilters.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        state.activeGroup = button.dataset.group || "All";
        renderFilters();
        renderDirectory();
      });
    });
  };

  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      state.query = event.target.value;
      renderDirectory();
    });
  }

  peopleSort?.addEventListener("change", (event) => {
    state.sort = event.target.value;
    renderDirectory();
  });

  renderFilters();
  renderDirectory();
}
