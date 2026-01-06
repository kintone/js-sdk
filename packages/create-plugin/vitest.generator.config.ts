import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/__tests__/generator.test.ts"],
    environment: "node",
    testTimeout: 300000,
    hookTimeout: 60000,
    globals: true,
  },
});
