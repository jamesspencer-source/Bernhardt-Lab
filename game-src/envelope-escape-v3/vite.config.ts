import { resolve } from "node:path";
import { copyFileSync, mkdirSync } from "node:fs";
import { defineConfig } from "vite";

const repoRoot = resolve(__dirname, "../..");
const runtimeOutDir = resolve(__dirname, "../../assets/game/envelope-escape-v3/runtime");
const rapierWasmSource = resolve(__dirname, "../../node_modules/@dimforge/rapier3d-compat/rapier_wasm3d_bg.wasm");

export default defineConfig({
  root: repoRoot,
  base: "./",
  build: {
    emptyOutDir: true,
    outDir: runtimeOutDir,
    sourcemap: false,
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      formats: ["es"],
      fileName: () => "envelope-escape-v3.js"
    },
    rollupOptions: {
      output: {
        entryFileNames: "envelope-escape-v3.js",
        assetFileNames: "assets/[name][extname]"
      }
    }
  },
  plugins: [
    {
      name: "copy-rapier-wasm",
      writeBundle() {
        mkdirSync(runtimeOutDir, { recursive: true });
        copyFileSync(rapierWasmSource, resolve(runtimeOutDir, "rapier_wasm3d_bg.wasm"));
      }
    }
  ]
});
