import kintone from '@cybozu/eslint-config/flat/lib/kintone.js';
import prettier from '@cybozu/eslint-config/flat/lib/prettier.js';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...kintone(),
  ...prettier(),
  {
    rules: {
      'prettier/prettier': ['error', { singleQuote: true }],
    },
  },
];
