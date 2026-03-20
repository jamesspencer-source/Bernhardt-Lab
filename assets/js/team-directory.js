import { cleanText } from "./shared.js";

const GROUP_PRIORITY = [
  "All",
  "Faculty",
  "Postdoctoral Fellows",
  "Graduate Students",
  "Undergraduate Researchers",
  "Research Staff",
];

export function initTeamDirectory() {
  const peopleGrid = document.getElementById("people-grid");
  const peopleCount = document.getElementById("people-count");
  if (!peopleGrid || !peopleCount) return;

  const cards = Array.from(peopleGrid.querySelectorAll(".person-card"));
  if (!cards.length) return;

  const roleFilters = document.getElementById("role-filters");
  const searchInput = document.getElementById("people-search");
  const teamFallback = document.getElementById("team-fallback");
  if (teamFallback) teamFallback.setAttribute("hidden", "");

  const state = { activeGroup: "All", query: "" };

  const filterCards = () => {
    const query = cleanText(state.query).toLowerCase();
    const visible = cards.filter((card) => {
      const matchesGroup = state.activeGroup === "All" || cleanText(card.dataset.group) === state.activeGroup;
      if (!matchesGroup) return false;
      if (!query) return true;
      return cleanText(card.dataset.search).toLowerCase().includes(query);
    });

    cards.forEach((card) => {
      card.hidden = !visible.includes(card);
    });

    const label = visible.length === 1 ? "member" : "members";
    peopleCount.textContent = `Showing ${visible.length} current lab ${label}`;

    if (!visible.length) {
      if (!peopleGrid.querySelector(".people-empty")) {
        const empty = document.createElement("div");
        empty.className = "people-empty";
        empty.textContent = "No current lab members matched that search. Try a shorter phrase or choose a different group.";
        peopleGrid.append(empty);
      }
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
        filterCards();
      });
    });
  };

  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      state.query = event.target.value;
      filterCards();
    });
  }

  renderFilters();
  filterCards();
}
