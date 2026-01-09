import rootConfig from "../../eslint.config.mjs";
import vitest from "eslint-plugin-vitest";

/** @type {import("eslint").Linter.Config[]} */
export default [
  { ignores: ["**/lib"] },
  ...rootConfig,
  {
    files: ["tests/**/*.ts"],
    plugins: { vitest },
    languageOptions: {
      globals: vitest.environments.env.globals,
    },
  },
];
