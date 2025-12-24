import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    clearMocks: true,
    include: ["src/__tests__/**/*.ts"],
  },
});
