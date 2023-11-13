import {defineConfig} from "vite";
import path from "path";

export default defineConfig({
  server: {
    open: "./dev/dev.html",
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "./index.js"),
      name: "ScrollAnime",
      formats: ["es","cjs"],
      fileName: (format) => `scrollanime.${format}.js`,
    },
    outDir: "./dist/",
    emptyOutDir: true,
  },
});