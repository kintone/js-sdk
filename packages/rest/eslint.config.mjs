import rootConfig from "../../eslint.config.mjs";

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    ignores: ["lib", "esm", "umd", "src/schemas"],
  },
  ...rootConfig,
];
