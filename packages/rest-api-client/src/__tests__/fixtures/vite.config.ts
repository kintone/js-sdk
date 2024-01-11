import { defineConfig } from "vite";
import path from "path";
import { tempDir } from "../e2e.vite.test";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "./index.ts"),
      formats: ["umd"],
      name: "MyBundle",
      fileName: "bundle.vite",
    },
    outDir: path.resolve(tempDir, "dist"),
    emptyOutDir: true,
  },
});
