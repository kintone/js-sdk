import { defineConfig } from "vite";
import path from "path";
import fs from "fs";
import os from "os";

export const tempDir = fs.mkdtempSync(
  path.join(os.tmpdir(), "kintone-rest-api-client-vite-bundle-"),
);

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
