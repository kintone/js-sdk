import type { TestPattern } from "../../e2e.test";

export const pattern: TestPattern = {
  bundlerName: "Vite",
  input: {
    command: "vite build",
    args: ["--config", "vite.config.mjs"],
    cwd: __dirname,
  },
};
