import type { TestPattern } from "../../e2e.test";

export const pattern: TestPattern = {
  bundlerName: "rollup",
  input: {
    command: "rollup",
    args: ["--config", "rollup.config.mjs", "--failAfterWarnings"],
    cwd: __dirname,
  },
};
