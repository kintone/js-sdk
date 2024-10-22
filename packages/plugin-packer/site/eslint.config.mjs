import globals from "globals";
import presetsPrettier from "@cybozu/eslint-config/flat/presets/prettier.js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...presetsPrettier,
  {
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
      },
    },
  },
];
