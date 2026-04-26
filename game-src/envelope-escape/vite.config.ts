import { resolve } from "node:path";
import { defineConfig } from "vite";

const repoRoot = resolve(__dirname, "../..");

export default defineConfig({
  root: repoRoot,
  base: "./",
  build: {
    emptyOutDir: true,
    outDir: resolve(__dirname, "../../assets/game/envelope-escape/runtime"),
    sourcemap: false,
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      formats: ["es"],
      fileName: () => "envelope-escape-v2.js"
    },
    rollupOptions: {
      output: {
        entryFileNames: "envelope-escape-v2.js",
        assetFileNames: "assets/[name][extname]"
      }
    }
  }
});
