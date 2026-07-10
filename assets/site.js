import { initSiteCore } from "./js/site-core.js";

initSiteCore().catch((error) => {
  console.error("Bernhardt Lab site navigation failed", error);
});
