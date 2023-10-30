import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import path from "path";
import fs from "fs";
import os from "os";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tempDir = fs.mkdtempSync(
    path.join(os.tmpdir(), "kintone-rest-api-client-vite-bundle-")
);

export default defineConfig({
  build: {
    mode: "development",
    lib: {
      entry: path.resolve(__dirname, "../index.ts"),
      formats: ["umd"],
      name: "MyBundle",
    },
    outDir: path.resolve(tempDir, "dist"),
  },
})
