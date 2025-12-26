import rootConfig from "../../eslint.config.mjs";
import siteConfig from "./site/eslint.config.mjs";
import binConfig from "./bin/eslint.config.mjs";
import vitest from "eslint-plugin-vitest";
import globals from "globals";

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    ignores: ["**/eslint.config.mjs", "**/vitest.config.ts"],
  },
  ...siteConfig.map((configObject) => ({
    files: ["site/**/*.{js,ts}"],
    ...configObject,
    rules: {
      ...configObject.rules,
      "n/no-unsupported-features/node-builtins": "off",
    },
  })),
  ...binConfig.map((configObject) => ({
    files: ["bin/**/*.{js,ts}"],
    ...configObject,
  })),
  ...rootConfig.map((configObject) => ({
    ignores: ["site/*", "bin/*"],
    ...configObject,
  })),
  {
    files: ["**/*.spec.ts", "test/**/*.{js,ts}"],
    plugins: { vitest },
    languageOptions: {
      globals: {
        ...globals.node,
        ...vitest.environments.env.globals,
      },
    },
  },
];
