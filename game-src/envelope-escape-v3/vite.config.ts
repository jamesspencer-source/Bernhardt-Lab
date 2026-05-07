import { resolve } from "node:path";
import { defineConfig } from "vite";

const repoRoot = resolve(__dirname, "../..");
const runtimeOutDir = resolve(__dirname, "../../assets/game/envelope-escape-v3/runtime");

export default defineConfig({
  root: repoRoot,
  base: "./",
  build: {
    emptyOutDir: true,
    outDir: runtimeOutDir,
    sourcemap: false,
    minify: "esbuild",
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
      name: "strip-v3-generated-comments",
      generateBundle(_options, bundle) {
        Object.values(bundle).forEach((item) => {
          if (item.type === "chunk") item.code = item.code.replace(/\/\*\*[\s\S]*?\*\//g, "").replace(/[ \t]+$/gm, "");
        });
      }
    }
  ]
});
