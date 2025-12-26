import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/__tests__/generator.test.ts"],
    environment: "node",
    testTimeout: 300000,
    globals: true,
  },
});
