import { alumniProfileHref, cleanText, prefersReducedMotion, requestJson, rootDataUrl, slugify } from "./shared.js";

export async function initFeaturedAlumni() {
  const root = document.getElementById("alumni-grid");
  if (!root) return;

  const payload = await requestJson(rootDataUrl("featured-alumni.json"));
  const alumniItems = Array.isArray(payload?.items)
    ? payload.items
        .map((item) => ({
          ...item,
          name: cleanText(item.name),
          roleInLab: cleanText(item.roleInLab),
          currentRole: cleanText(item.currentRole),
          labDates: cleanText(item.labDates),
          sourceLabel: cleanText(item.sourceLabel || "Institutional profile"),
          source: cleanText(item.source),
          profile: cleanText(item.profile) || alumniProfileHref(cleanText(item.profileSlug || slugify(item.name))),
        }))
        .filter((item) => item.name)
    : [];

  if (!alumniItems.length) return;

  let alumniTimer = null;
  let alumniIndex = 0;
  let autoplayEnabled = !prefersReducedMotion;

  root.innerHTML = `
    <div class="alumni-rotator reveal">
      <div class="alumni-stage" id="alumni-stage"></div>
      <div class="alumni-controls">
        <div class="alumni-dots" id="alumni-dots"></div>
        <div class="alumni-nav-wrap">
          <button class="alumni-nav" type="button" id="alumni-prev">Previous</button>
          <button class="alumni-nav" type="button" id="alumni-next">Next</button>
          <button class="alumni-nav" type="button" id="alumni-toggle" aria-pressed="false">Pause</button>
        </div>
      </div>
    </div>
  `;

  const stage = document.getElementById("alumni-stage");
  const dots = document.getElementById("alumni-dots");
  const prev = document.getElementById("alumni-prev");
  const next = document.getElementById("alumni-next");
  const toggle = document.getElementById("alumni-toggle");

  dots.innerHTML = alumniItems
    .map(
      (_, index) =>
        `<button class="alumni-dot" type="button" data-index="${index}" aria-label="Show alumni profile ${index + 1}" aria-current="false"></button>`
    )
    .join("");

  const setAlumni = (nextIndex) => {
    const total = alumniItems.length;
    alumniIndex = (nextIndex + total) % total;
    const item = alumniItems[alumniIndex];
    stage.innerHTML = `
      <article class="alumni-item">
        <p class="alumni-role">${item.roleInLab}</p>
        <h3>${item.name}</h3>
        ${item.labDates ? `<p class="alumni-role">Lab dates: ${item.labDates}</p>` : ""}
        <p class="alumni-current">${item.currentRole}</p>
        <p class="alumni-source">Source: ${item.sourceLabel || "Institutional profile"}</p>
        <div class="alumni-link-row">
          ${item.profile ? `<a href="${item.profile}">Open alumni profile</a>` : ""}
          ${item.source ? `<a href="${item.source}" target="_blank" rel="noreferrer">Verified institutional profile</a>` : ""}
        </div>
      </article>
    `;

    dots.querySelectorAll(".alumni-dot").forEach((dot, index) => {
      dot.classList.toggle("active", index === alumniIndex);
      dot.setAttribute("aria-current", index === alumniIndex ? "true" : "false");
    });
  };

  const stopAutoRotate = () => {
    if (alumniTimer) {
      clearInterval(alumniTimer);
      alumniTimer = null;
    }
  };

  const updateToggle = () => {
    if (!toggle) return;
    if (prefersReducedMotion) {
      toggle.disabled = true;
      toggle.textContent = "Motion off";
      toggle.setAttribute("aria-pressed", "true");
      return;
    }
    const paused = !autoplayEnabled;
    toggle.textContent = paused ? "Resume" : "Pause";
    toggle.setAttribute("aria-pressed", String(paused));
  };

  const startAutoRotate = () => {
    if (prefersReducedMotion || !autoplayEnabled) return;
    stopAutoRotate();
    alumniTimer = setInterval(() => setAlumni(alumniIndex + 1), 7000);
  };

  prev?.addEventListener("click", () => {
    setAlumni(alumniIndex - 1);
    startAutoRotate();
  });
  next?.addEventListener("click", () => {
    setAlumni(alumniIndex + 1);
    startAutoRotate();
  });
  dots.querySelectorAll(".alumni-dot").forEach((dot) => {
    dot.addEventListener("click", () => {
      setAlumni(Number(dot.dataset.index));
      if (autoplayEnabled) startAutoRotate();
    });
  });
  toggle?.addEventListener("click", () => {
    if (prefersReducedMotion) return;
    autoplayEnabled = !autoplayEnabled;
    updateToggle();
    if (autoplayEnabled) startAutoRotate();
    else stopAutoRotate();
  });

  root.addEventListener("mouseenter", stopAutoRotate);
  root.addEventListener("mouseleave", startAutoRotate);
  root.addEventListener("focusin", stopAutoRotate);
  root.addEventListener("focusout", (event) => {
    if (root.contains(event.relatedTarget)) return;
    startAutoRotate();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAutoRotate();
    else startAutoRotate();
  });

  setAlumni(0);
  updateToggle();
  startAutoRotate();
}
