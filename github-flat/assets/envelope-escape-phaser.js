/*
 * Compatibility entrypoint for the Envelope Escape Phaser V2 beta.
 * The production footer still loads the V1 canvas game unless the page is opened
 * with ?envelopeV2=1. This namespace remains for local console testing.
 */
(function envelopeEscapePhaserCompat(global) {
  const NAMESPACE = "BernhardtEnvelopePhaser";

  async function loadModule() {
    return import("./game/envelope-escape/runtime/envelope-escape-v2.js");
  }

  global[NAMESPACE] = {
    async init(options = {}) {
      if (!options.enabled) {
        return {
          ok: false,
          reason: "feature-disabled",
          message: "Envelope Escape Phaser V2 starts only when init({ enabled: true }) is called."
        };
      }
      const module = await loadModule();
      return module.openEnvelopeEscapeV2(options);
    },
    async destroy() {
      const module = await loadModule();
      module.destroyEnvelopeEscapeV2();
      return { ok: true };
    },
    isAvailable() {
      return true;
    }
  };
})(window);
