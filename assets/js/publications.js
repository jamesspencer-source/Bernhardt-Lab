import { observeRevealTargets } from "./site-core.js";

// Compatibility for cached older entrypoints; publication content is now built into HTML.
export async function initRecentPublications() {
  const root = document.getElementById("recent-publications");
  if (root) observeRevealTargets(root);
}
