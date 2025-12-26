import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // testEnvironment: "node" はデフォルトなので省略
    include: ["src/**/*.test.ts"],
    globals: true,
  },
});
