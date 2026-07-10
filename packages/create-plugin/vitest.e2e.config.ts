import { defineConfig } from "vitest/config";
import RetryReporter from "./vitest.retry-reporter";

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
    // Keep retried tests visible: RetryReporter warns when a test only
    // passed after retries.
    reporters: ["default", new RetryReporter()],
    retry: isRunOnActions() ? 3 : 0,
    globals: true,
    typecheck: {
      tsconfig: "./tsconfig.test.json",
    },
  },
});
