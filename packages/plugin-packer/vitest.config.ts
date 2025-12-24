import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.spec.ts"],
    exclude: ["site/**"],
    environment: "node",
    testTimeout: 30000,
    globals: true,
  },
});
