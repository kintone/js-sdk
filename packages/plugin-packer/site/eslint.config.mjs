import globals from "globals";
import presetsPrettier from "@cybozu/eslint-config/flat/presets/prettier.js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...presetsPrettier.map((config) => ({
    ...config,
    rules: {
      ...config.rules,
      "n/no-unsupported-features/node-builtins": "off",
    },
  })),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      "n/no-unsupported-features/node-builtins": "off",
    },
  },
];
