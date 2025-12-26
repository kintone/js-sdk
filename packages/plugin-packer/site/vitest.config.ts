import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["site/test/**/*-test.js"],
    environment: "jsdom",
    globals: true,
  },
});
