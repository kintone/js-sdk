import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    mode: "development",
    lib: {
      entry: path.resolve(__dirname, "../index.ts"),
      formats: ["umd"],
      name: "MyBundle",
    },
    outDir: path.resolve(__dirname, "dist"),
  },
})
