import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/__tests__/generator.test.ts"],
    environment: "node",
    testTimeout: 600000,
    hookTimeout: 600000,
    globals: true,
  },
});
