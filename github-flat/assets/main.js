import { initSiteCore } from "./js/site-core.js";
import { initTeamDirectory } from "./js/team-directory.js";
import { initRecentPublications } from "./js/publications.js";
import { initGallery } from "./js/gallery.js";
import { initFeaturedAlumni } from "./js/featured-alumni.js";
import { initScientificMedia } from "./js/scientific-media.js";

async function initializePage() {
  await initSiteCore();
  initTeamDirectory();
  await initRecentPublications();
  await initScientificMedia();
  await initGallery();
  await initFeaturedAlumni();
}

initializePage();
