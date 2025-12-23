import presetsNodeTypescriptPrettier from "@cybozu/eslint-config/flat/presets/node-typescript-prettier.js";
import eslintPluginPackageJson from "eslint-plugin-package-json";
import globals from "globals";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...presetsNodeTypescriptPrettier,
  {
    ignores: ["lib", "esm", "umd", "dist"],
  },
  {
    files: ["*.cjs", "*.cts"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ["*.js", "*.ts", "*.mjs", "*.mts"],
    languageOptions: {
      globals: globals.nodeBuiltin,
    },
  },
  {
    rules: {
      curly: ["error", "all"],
      "n/no-missing-import": "off",
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    ...eslintPluginPackageJson.configs.recommended,
    rules: {
      ...eslintPluginPackageJson.configs.recommended.rules,
      "@typescript-eslint/consistent-type-imports": "off",
    },
  },
];
