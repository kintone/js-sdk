import rootConfig from "../../eslint.config.mjs";
import vitest from "eslint-plugin-vitest";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...rootConfig,
  {
    files: ["**/*.test.ts", "**/__tests__/**/*.ts"],
    plugins: { vitest },
    languageOptions: {
      globals: vitest.environments.env.globals,
    },
  },
];
