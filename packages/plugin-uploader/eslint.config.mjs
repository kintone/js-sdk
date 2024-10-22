import rootConfig from "../../eslint.config.mjs";
// eslint-disable-next-line n/no-extraneous-import
import presetsPrettier from "@cybozu/eslint-config/flat/presets/prettier.js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...presetsPrettier,
  ...rootConfig,
  {
    rules: {
      /* ref
       * - https://github.com/eslint/eslint/issues/11899
       * - https://github.com/eslint/eslint/issues/11954
       */
      "require-atomic-updates": "off",
    },
  },
];
