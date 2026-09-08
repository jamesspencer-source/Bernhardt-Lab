import { initSiteCore } from "./js/site-core.js";
import { initMediaPlayback } from "./js/media-playback.js";

initMediaPlayback();

initSiteCore().catch((error) => {
  console.error("Bernhardt Lab site navigation failed", error);
});
