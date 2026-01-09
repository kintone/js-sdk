import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      // Use built CommonJS file instead of ESM source to avoid module.exports issue
      "../index": path.resolve(__dirname, "dist/index.js"),
    },
  },
  test: {
    globals: true,
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/src/__tests__/fixtures/**",
      "**/src/__tests__/helpers/**",
    ],
    testTimeout: 30000,
    sequence: {
      hooks: "list",
    },
  },
});
