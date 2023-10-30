import type { TestPattern } from "../../e2e.test";

export const pattern: TestPattern = {
  bundlerName: "Webpack",
  input: {
    command: "webpack",
    args: ["--config", "webpack.config.mjs"],
    cwd: __dirname,
  },
};
