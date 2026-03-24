import { escapeHtml, prefersReducedMotion, requestJson, rootDataUrl, siteAssetUrl } from "./shared.js";
import { observeRevealTargets } from "./site-core.js";

function scientificMediaCard(item) {
  const title = escapeHtml(item.title || "");
  const caption = escapeHtml(item.caption || "");
  const alt = escapeHtml(item.alt || "");
  const sourceLabel = escapeHtml(item.sourceLabel || "");
  const archiveLabel = item.type === "video" ? "Archive video" : "Archive still";
  const mediaSource =
    item.type === "video"
      ? `<video controls muted playsinline preload="metadata" poster="${escapeHtml(siteAssetUrl(item.poster || ""))}" aria-label="${alt}">
          <source src="${escapeHtml(siteAssetUrl(item.src || ""))}" type="video/mp4" />
        </video>`
      : `<img src="${escapeHtml(siteAssetUrl(item.src || ""))}" alt="${alt}" loading="lazy" />`;

  return `
    <article class="media-card scientific-media-card${item.featured ? " featured" : ""}">
      <div class="scientific-media-visual">
        ${mediaSource}
      </div>
      <div class="media-card-body">
        <h3>${title}</h3>
        <p>${caption}</p>
        <div class="media-card-meta">
          <div class="scientific-media-meta-group">
            <span>${sourceLabel}</span>
            <span>${archiveLabel}</span>
          </div>
          ${
            item.articleUrl
              ? `<a class="media-source" href="${escapeHtml(item.articleUrl)}" target="_blank" rel="noreferrer">Publication context</a>`
              : `<span class="scientific-media-archive-note">Archive still</span>`
          }
        </div>
      </div>
    </article>
  `;
}

export async function initScientificMedia() {
  const scientificMediaShell = document.getElementById("scientific-media-shell");
  const scientificMediaGrid = document.getElementById("scientific-media-grid");
  if (!scientificMediaShell || !scientificMediaGrid) return;

  const payload = await requestJson(rootDataUrl("scientific-media.json"));
  const items = Array.isArray(payload?.items) ? payload.items.filter((item) => item?.src && item?.title) : [];
  if (!items.length) return;

  scientificMediaGrid.innerHTML = items.map((item) => scientificMediaCard(item)).join("");
  scientificMediaShell.hidden = false;

  scientificMediaGrid.querySelectorAll("video").forEach((video) => {
    video.autoplay = false;
    if (prefersReducedMotion) video.removeAttribute("autoplay");
  });

  observeRevealTargets(scientificMediaShell);
}
