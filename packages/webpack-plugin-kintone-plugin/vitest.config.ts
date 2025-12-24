import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/src/__tests__/fixtures/**",
      "**/src/__tests__/helpers/**",
    ],
    testTimeout: 30000,
  },
});
