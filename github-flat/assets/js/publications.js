import { assetDataUrl, cleanText, formatSpeciesAwareText, requestJson, rootDataUrl } from "./shared.js";
import { observeRevealTargets } from "./site-core.js";

function publicationLink(item = {}) {
  const doi = cleanText(item.doi);
  if (doi) return `https://doi.org/${doi}`;
  const pmid = cleanText(item.pmid);
  return pmid ? `https://pubmed.ncbi.nlm.nih.gov/${pmid}/` : "#";
}

function normalizeJournalLabel(value = "") {
  const journalLabelMap = {
    "current biology : cb": "Current Biology",
    "current opinion in microbiology": "Current Opinion in Microbiology",
    "nature microbiology": "Nature Microbiology",
    "plos genetics": "PLOS Genetics",
  };
  const text = cleanText(value);
  return journalLabelMap[text.toLowerCase()] || text;
}

function buildWhyLookup(items = []) {
  return items.reduce((acc, item) => {
    const why = cleanText(item.why);
    if (!why) return acc;
    if (item.doi) acc[`doi:${cleanText(item.doi).toLowerCase()}`] = why;
    if (item.pmid) acc[`pmid:${cleanText(item.pmid)}`] = why;
    return acc;
  }, {});
}

function publicationWhy(item = {}, whyLookup = {}) {
  const doi = cleanText(item.doi).toLowerCase();
  const pmid = cleanText(item.pmid);
  return whyLookup[`doi:${doi}`] || whyLookup[`pmid:${pmid}`] || cleanText(item.authorsShort || "");
}

export async function initRecentPublications() {
  const recentPublicationsRoot = document.getElementById("recent-publications");
  if (!recentPublicationsRoot) return;

  const curatedPayload = await requestJson(rootDataUrl("curated-publications.json"));
  const curated = Array.isArray(curatedPayload?.items) ? curatedPayload.items : [];
  const whyLookup = buildWhyLookup(curated);

  const runtimePayload = await requestJson(`${assetDataUrl("recent-publications.json")}?t=${Date.now()}`);
  const publications = Array.isArray(runtimePayload?.items) && runtimePayload.items.length ? runtimePayload.items : curated;

  recentPublicationsRoot.innerHTML = `
    <ol class="publication-archive-list reveal">
      ${publications
        .map(
          (item) => `
        <li class="publication-archive-item">
          <a class="publication-archive-title" href="${publicationLink(item)}" target="_blank" rel="noreferrer">
            ${formatSpeciesAwareText(item.title)}
          </a>
          <p class="publication-archive-why">${formatSpeciesAwareText(publicationWhy(item, whyLookup))}</p>
          <p class="publication-archive-citation">
            ${formatSpeciesAwareText(normalizeJournalLabel(item.journal))}${item.year ? ` (${item.year})` : ""}
          </p>
        </li>
      `
        )
        .join("")}
    </ol>
  `;

  observeRevealTargets(recentPublicationsRoot);
}
