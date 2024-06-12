const nodePrettier = require("@cybozu/eslint-config/presets/node-prettier");
const prettier = require("@cybozu/eslint-config/presets/prettier");
const typescriptPrettier = require("@cybozu/eslint-config/presets/typescript-prettier");
const FlatCompat = require("@eslint/eslintrc").FlatCompat;
const js = require("@eslint/js");
const { fixupConfigRules } = require("@eslint/compat");
const eslintPluginNode = require("eslint-plugin-node");
const globals = require("globals");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  ...fixupConfigRules(
    compat.extends("@cybozu/eslint-config/presets/node-typescript-prettier"),
    eslintPluginNode,
  ),
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
    files: ["plugin-packer/bin/**/*.ts", "plugin-packer/bin/**/*.js"],
  },
  {
    prettier,
    files: ["plugin-packer/site/**/*.ts", "plugin-packer/site/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
      },
    },
  },
  {
    prettier,
    files: ["plugin-packer/test/**/*.ts", "plugin-packer/test/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  {
    typescriptPrettier,
    files: ["create-plugin/template/modern/**/*.ts"],
    languageOptions: {
      globals: {
        kintone: false,
      },
    },
  },
];
