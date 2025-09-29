import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    root: "__e2e__",
    environment: "node",
    setupFiles: ["./setup.ts"],
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
});
