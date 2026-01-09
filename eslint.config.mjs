import defaultConfig from "@kintone/configs/eslint-config";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...defaultConfig,
  {
    rules: {
      // js-sdk specific overrides
      "func-style": ["error"],
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-wrapper-object-types": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
];
