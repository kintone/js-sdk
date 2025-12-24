import { defineConfig } from "vitest/config";

const isRunOnActions = () => !!process.env.GITHUB_ACTIONS;

export default defineConfig({
  test: {
    include: ["__e2e__/**/*.test.ts"],
    testTimeout: 120000,
    environment: "node",
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    retry: isRunOnActions() ? 3 : 0,
    globals: true,
    typecheck: {
      tsconfig: "./tsconfig.test.json",
    },
  },
});
