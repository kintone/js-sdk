import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    root: "__tests__",
    exclude: ["**/node_modules/**", "**/lib/**"],
    globals: true,
  },
});
