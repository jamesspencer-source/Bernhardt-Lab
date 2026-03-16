function clean(value = "") {
  return String(value).replace(/\s+/g, " ").trim();
}

function titleCase(value = "") {
  const text = clean(value).toLowerCase();
  if (!text) return "";
  return text
    .split(" ")
    .map((word) => {
      if (["and", "of", "at", "in", "on", "to", "for"].includes(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ")
    .replace("Md", "MD")
    .replace("Phd", "PhD");
}

function roleBucket(role = "") {
  const label = clean(role).toLowerCase();
  if (!label) return "Unspecified";
  if (/post[\s-]?bacc|post[\s-]?baccalaureate/.test(label)) return "Post-baccalaureate Alumni";
  if (label.includes("postdoctoral") || label.includes("postdoc")) return "Postdoctoral Alumni";
  if (label.includes("undergrad") || label.includes("undergraduate")) return "Undergraduate Alumni";
  if (label.includes("graduate")) return "Graduate Alumni";
  if (label.includes("technician") || label.includes("associate") || label.includes("staff")) return "Research Staff Alumni";
  return "Other Alumni";
}

const BUCKET_ORDER = [
  "Postdoctoral Alumni",
  "Post-baccalaureate Alumni",
  "Graduate Alumni",
  "Undergraduate Alumni",
  "Research Staff Alumni",
  "Other Alumni",
  "Unspecified"
];

function slugify(value = "") {
  return clean(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function localProfileHref(slug) {
  const path = (window.location.pathname || "").toLowerCase();
  const isNestedAlumniPage = path.includes("/alumni/");
  return isNestedAlumniPage ? `../alumni-profiles/${slug}.html` : `alumni-${slug}.html`;
}

const MONTH_INDEX = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  sept: 9,
  oct: 10,
  nov: 11,
  dec: 12
};

function parseLabEndSortKey(labDates = "") {
  const text = clean(labDates).toLowerCase();
  if (!text) return -1;
  if (/\bpresent\b|\bcurrent\b|\bstill here\b|\bongoing\b/.test(text)) return -1;

  const monthMatches = Array.from(text.matchAll(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\s+((?:19|20)\d{2})\b/g));
  if (monthMatches.length) {
    const lastMatch = monthMatches[monthMatches.length - 1];
    const monthToken = lastMatch[1];
    const year = Number(lastMatch[2]);
    const month = MONTH_INDEX[monthToken] || 12;
    return year * 100 + month;
  }

  const years = Array.from(text.matchAll(/\b((?:19|20)\d{2})\b/g)).map((match) => Number(match[1]));
  if (years.length) return years[years.length - 1] * 100 + 12;
  return -1;
}

function lastNameSortKey(name = "") {
  const suffixes = new Set(["jr", "jr.", "sr", "sr.", "ii", "iii", "iv", "v"]);
  const parts = clean(name)
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  while (parts.length && suffixes.has(parts[parts.length - 1])) {
    parts.pop();
  }
  return parts.length ? parts[parts.length - 1] : clean(name).toLowerCase();
}

const deduped = (() => {
  const map = new Map();

  rawAlumni.forEach((entry) => {
    const name = clean(entry.name);
    if (!name) return;

    const existing = map.get(name);

    let roleInLab = titleCase(entry.role_in_lab || "");
    let currentRole = clean(entry.current_role || "");
    const labDates = clean(entry.lab_dates || "");

    if (!currentRole && roleInLab.toLowerCase().includes(" at ")) {
      currentRole = roleInLab;
      roleInLab = "";
    }

    if (currentRole.toLowerCase().includes("john hopkins")) {
      currentRole = currentRole.replace(/john hopkins/i, "Johns Hopkins");
    }

    const normalized = {
      name,
      roleInLab: roleInLab || existing?.roleInLab || "",
      currentRole: currentRole || existing?.currentRole || "",
      labDates: labDates || existing?.labDates || "",
      sourceLabel: (clean(entry.source || "Bernhardt lab records").toLowerCase() === "bernhardt lab records" ? "Bernhardt lab records" : clean(entry.source || "Bernhardt lab records"))
    };

    map.set(name, normalized);
  });

  return Array.from(map.values())
    .map((entry) => {
      const verified = verifiedAlumniProfiles[entry.name];
      return {
        ...entry,
        slug: slugify(entry.name),
        bucket: roleBucket(entry.roleInLab),
        verified: Boolean(verified),
        profileUrl: verified?.url || "",
        verifiedSource: verified?.source || "",
        localProfileUrl: localProfileHref(slugify(entry.name)),
        leftSortKey: parseLabEndSortKey(entry.labDates),
        lastNameKey: lastNameSortKey(entry.name)
      };
    });
})();

const state = {
  query: "",
  bucket: "All",
  sort: "recent"
};

const alumniRoot = document.getElementById("alumni-directory");
const alumniSearch = document.getElementById("alumni-search");
const alumniFilters = document.getElementById("alumni-filters");
const alumniCount = document.getElementById("alumni-count");
const alumniSort = document.getElementById("alumni-sort");

function filteredAlumni() {
  const query = state.query.trim().toLowerCase();

  const rows = deduped.filter((entry) => {
    const matchesBucket = state.bucket === "All" || entry.bucket === state.bucket;
    if (!matchesBucket) return false;
    if (!query) return true;

    return `${entry.name} ${entry.roleInLab} ${entry.labDates} ${entry.currentRole} ${entry.bucket}`.toLowerCase().includes(query);
  });

  rows.sort((a, b) => {
    if (state.sort === "lastName") {
      const byLastName = a.lastNameKey.localeCompare(b.lastNameKey);
      if (byLastName !== 0) return byLastName;
      return a.name.localeCompare(b.name);
    }

    const byRecentDeparture = b.leftSortKey - a.leftSortKey;
    if (byRecentDeparture !== 0) return byRecentDeparture;
    return a.name.localeCompare(b.name);
  });

  return rows;
}

function renderFilters() {
  if (!alumniFilters) return;
  const counts = deduped.reduce((acc, entry) => {
    acc[entry.bucket] = (acc[entry.bucket] || 0) + 1;
    return acc;
  }, {});

  const orderedBuckets = BUCKET_ORDER.filter((bucket) => counts[bucket]);
  const extraBuckets = Object.keys(counts)
    .filter((bucket) => !BUCKET_ORDER.includes(bucket))
    .sort((a, b) => a.localeCompare(b));
  const buckets = ["All", ...orderedBuckets, ...extraBuckets];

  alumniFilters.innerHTML = buckets
    .map((bucket) => {
      const active = bucket === state.bucket ? "active" : "";
      const count = bucket === "All" ? deduped.length : counts[bucket];
      return `<button type="button" class="${active}" data-bucket="${bucket}">${bucket} (${count})</button>`;
    })
    .join("");

  alumniFilters.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      state.bucket = button.dataset.bucket;
      renderFilters();
      renderAlumniDirectory();
    });
  });
}

function renderAlumniDirectory() {
  if (!alumniRoot || !alumniCount) return;
  const rows = filteredAlumni();

  if (!rows.length) {
    alumniRoot.innerHTML = `<div class="alumni-empty">No alumni match this search or filter.</div>`;
    alumniCount.textContent = "0 alumni shown";
    return;
  }

  alumniRoot.innerHTML = rows
    .map(
      (entry) => `
      <article class="alumni-card">
        <div class="alumni-top">${entry.verified ? `<span class="alumni-verified">Verified profile</span>` : ""}</div>
        <h3>${entry.name}</h3>
        <p class="alumni-role"><strong>Role in lab:</strong> ${entry.roleInLab || "Former lab member"}</p>
        ${entry.labDates ? `<p class="alumni-role"><strong>Lab dates:</strong> ${entry.labDates}</p>` : ""}
        <p class="alumni-current"><strong>Current / latest role:</strong> ${entry.currentRole || "Role update pending"}</p>
        <p class="alumni-source"><strong>Source:</strong> ${entry.sourceLabel || "Bernhardt lab records"}</p>
        ${entry.profileUrl
          ? `<p class="alumni-source"><strong>Verified by:</strong> <a class="alumni-inline-link" href="${entry.profileUrl}" target="_blank" rel="noreferrer">${entry.verifiedSource || "Institutional profile"}</a></p>`
          : `<p class="alumni-source"><strong>External verification:</strong> not available</p>`}
        <div class="alumni-links">
          <a class="alumni-link" href="${entry.localProfileUrl}">Open alumni profile</a>
          ${entry.profileUrl ? `<a class="alumni-link" href="${entry.profileUrl}" target="_blank" rel="noreferrer">View current institutional profile</a>` : ""}
        </div>
      </article>
    `
    )
    .join("");

  alumniCount.textContent = `${rows.length} alumni shown`;
}

if (alumniSearch) {
  alumniSearch.addEventListener("input", (event) => {
    state.query = event.target.value;
    renderAlumniDirectory();
  });
}

if (alumniSort) {
  alumniSort.addEventListener("change", (event) => {
    state.sort = event.target.value || "recent";
    renderAlumniDirectory();
  });
}

if (alumniRoot && alumniFilters && alumniCount) {
  renderFilters();
  renderAlumniDirectory();
}
