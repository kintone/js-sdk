const nodePrettier = require("@cybozu/eslint-config/presets/node-prettier");
const prettier = require("@cybozu/eslint-config/presets/prettier");
const typescriptPrettier = require("@cybozu/eslint-config/presets/typescript-prettier");
const FlatCompat = require("@eslint/eslintrc").FlatCompat;
const js = require("@eslint/js");
const { fixupConfigRules } = require("@eslint/compat");
const eslintPluginNode = require("eslint-plugin-node");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  {
    files: ["plugin-uploader/**/*.ts"],
    rules: {
      /* ref
       * - https://github.com/eslint/eslint/issues/11899
       * - https://github.com/eslint/eslint/issues/11954
       */
      "require-atomic-updates": "off",
    },
  },
  {
    nodePrettier,
    files: ["plugin-packer/bin/**/*.ts"],
  },
  {
    prettier,
    files: ["plugin-packer/site/**/*.ts", "plugin-packer/site/**/*.js"],
    env: {
      jest: true,
      node: true,
    },
  },
  {
    typescriptPrettier,
    files: ["create-plugin/template/modern/**/*.ts"],
    globals: {
      kintone: false,
    },
  },
  {
    files: ["**/*.ts"],
    rules: {
      curly: ["error", "all"],
      "func-style": ["error"],
      "@typescript-eslint/ban-types": [
        "error",
        {
          types: {
            object: false,
            "{}": false,
          },
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
        },
      ],
    },
  },
  ...fixupConfigRules(
    compat.extends("@cybozu/eslint-config/presets/node-typescript-prettier"),
    eslintPluginNode,
  ),
];
