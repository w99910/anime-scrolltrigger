import {defineConfig} from "vite";
import path from "path";

export default defineConfig({
  server: {
    open: "./dev/dev.html",
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "./index.js"),
      name: "Anime-ScrollTrigger",
      formats: ["es","cjs"],
      fileName: (format) => `anime-scrolltrigger.${format}.js`,
    },
    outDir: "./dist/",
    emptyOutDir: true,
  },
});