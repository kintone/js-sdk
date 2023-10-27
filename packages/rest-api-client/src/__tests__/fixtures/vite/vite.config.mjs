import { defineConfig } from 'vite';
import path from "path";
import {fileURLToPath} from 'node:url';

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
