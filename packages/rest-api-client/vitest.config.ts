import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    clearMocks: true,
    include: ["src/**/*.test.ts"],
    exclude: [
      "**/node_modules/**",
      "**/src/__tests__/setup.ts",
      "**/fixtures/**",
    ],
    setupFiles: ["./src/__tests__/setup.ts"],
    typecheck: {
      tsconfig: "./tsconfig.test.json",
    },
  },
});
