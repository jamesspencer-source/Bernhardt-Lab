import { initSiteCore } from "./js/site-core.js";
import { initTeamDirectory } from "./js/team-directory.js";
import { initRecentPublications } from "./js/publications.js";
import { initGallery } from "./js/gallery.js";
import { initFeaturedAlumni } from "./js/featured-alumni.js";

async function initializePage() {
  await initSiteCore();
  initTeamDirectory();
  await initRecentPublications();
  await initGallery();
  await initFeaturedAlumni();
}

initializePage().catch((error) => {
  console.error("Bernhardt Lab page initialization failed", error);
});
