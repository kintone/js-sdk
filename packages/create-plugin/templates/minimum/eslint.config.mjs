import kintoneGlobalConfig from "@cybozu/eslint-config/flat/globals/kintone.js";
import baseConfig from "@cybozu/eslint-config/flat/lib/base.js";
import kintoneConfig from "@cybozu/eslint-config/flat/lib/kintone.js";
import prettierConfig from "@cybozu/eslint-config/flat/lib/prettier.js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...kintoneGlobalConfig,
  ...baseConfig,
  ...kintoneConfig,
  ...prettierConfig,
  {
    rules: {
      "prettier/prettier": ["error", { singleQuote: true }],
      "space-before-function-paren": 0,
      "object-curly-spacing": 0,
    },
  },
];
