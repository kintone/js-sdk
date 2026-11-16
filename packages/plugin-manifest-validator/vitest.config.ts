import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      // Use built CommonJS file instead of ESM source to avoid module.exports issue
      "../index": path.resolve(__dirname, "dist/src/index.js"),
    },
  },
  test: {
    globals: true,
    clearMocks: true,
    include: ["src/__tests__/**/*.ts"],
  },
});
