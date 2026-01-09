import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/__tests__/**/*.test.ts"],
    exclude: ["src/__tests__/generator.test.ts"],
    environment: "node",
    globals: true,
    typecheck: {
      tsconfig: "./tsconfig.test.json",
    }
  },
});
