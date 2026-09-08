import { initSiteCore } from "./js/site-core.js";
import { initAlumniDirectory } from "./js/alumni-directory.js";

async function initializeAlumniPage() {
  await initSiteCore();
  initAlumniDirectory();
}

initializeAlumniPage().catch((error) => {
  console.error("Bernhardt Lab alumni initialization failed", error);
});
