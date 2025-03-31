import presetsNodeTypescriptPrettier from "@cybozu/eslint-config/flat/presets/node-typescript-prettier.js";
import packageJson from "eslint-plugin-package-json";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...presetsNodeTypescriptPrettier,
  {
    rules: {
      curly: ["error", "all"],
      "func-style": ["error"],

      "@typescript-eslint/no-empty-object-type": "off",

      "@typescript-eslint/no-wrapper-object-types": "off",

      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
        },
      ],

      "n/no-missing-import": "off",
    },
  },
  {
    ...packageJson.configs.recommended,
    rules: {
      ...packageJson.configs.recommended.rules,
      "@typescript-eslint/consistent-type-imports": "off",
    }
  },
];
