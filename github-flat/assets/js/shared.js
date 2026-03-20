const MODULE_URL = new URL(import.meta.url);
const ASSET_ROOT = new URL("../", MODULE_URL);
const SITE_ROOT = new URL("../../", MODULE_URL);

export const prefersReducedMotion =
  typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function buildMode() {
  const meta = document.querySelector('meta[name="bernhardt-build-mode"]');
  return meta?.getAttribute("content") === "flat" ? "flat" : "canonical";
}

export function cleanText(value = "") {
  return String(value)
    .replace(/\u00a0/g, " ")
    .replace(/\u2019/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function slugify(value = "") {
  return cleanText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function rootDataUrl(filename) {
  return new URL(`../../data/${filename}`, MODULE_URL).toString();
}

export function assetDataUrl(filename) {
  return new URL(`../data/${filename}`, MODULE_URL).toString();
}

export function siteAssetUrl(path = "") {
  const normalized = cleanText(path).replace(/^\/+/, "");
  return new URL(`../../${normalized}`, MODULE_URL).toString();
}

const SPECIES_INLINE_PATTERNS = [
  /\bEscherichia\s+coli\b/gi,
  /\bPseudomonas\s+aeruginosa\b/gi,
  /\bStaphylococcus\s+aureus\b/gi,
  /\bStreptococcus\s+pneumoniae\b/gi,
  /\bCorynebacterium\s+glutamicum\b/gi,
  /\bKlebsiella\s+pneumoniae\b/gi,
  /\bAcinetobacter\s+baumannii\b/gi,
  /\bE\.\s*coli\b/gi,
  /\bP\.\s*aeruginosa\b/gi,
  /\bS\.\s*aureus\b/gi,
  /\bS\.\s*pneumoniae\b/gi,
  /\bC\.\s*glutamicum\b/gi,
  /\bK\.\s*pneumoniae\b/gi,
  /\bA\.\s*baumannii\b/gi,
];

export function formatSpeciesAwareText(value = "") {
  const escaped = escapeHtml(value);
  return SPECIES_INLINE_PATTERNS.reduce(
    (result, pattern) => result.replace(pattern, (match) => `<em class="species-name">${match}</em>`),
    escaped
  );
}

export async function requestJson(url, timeoutMs = 6000) {
  const controller = typeof AbortController === "function" ? new AbortController() : null;
  const timeoutId = controller ? window.setTimeout(() => controller.abort(), timeoutMs) : null;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: controller ? controller.signal : undefined,
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  } finally {
    if (timeoutId !== null) window.clearTimeout(timeoutId);
  }
}

export function alumniProfileHref(slug) {
  return buildMode() === "flat" ? `alumni-${slug}.html` : `alumni-profiles/${slug}.html`;
}
