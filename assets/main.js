import { initSiteCore } from "./js/site-core.js";
import { initTeamDirectory } from "./js/team-directory.js";
import { initRecentPublications } from "./js/publications.js";
import { initGallery } from "./js/gallery.js";
import { initFeaturedAlumni } from "./js/featured-alumni.js";
import { initEnvelopeGameLoader } from "./js/envelope-game-loader.js";

async function initializePage() {
  initEnvelopeGameLoader();
  await initSiteCore();
  initTeamDirectory();
  await Promise.all([initRecentPublications(), initGallery(), initFeaturedAlumni()]);
}

initializePage().catch((error) => {
  console.error("Bernhardt Lab page initialization failed", error);
});
