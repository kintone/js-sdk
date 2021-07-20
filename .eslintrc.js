module.exports = {
  extends: "@cybozu/eslint-config/presets/node-typescript-prettier",
  plugins: ["prefer-arrow"],
  rules: {
    curly: ["error", "all"],
    "func-style": ["error"],
    "prefer-arrow/prefer-arrow-functions": [
      "error",
      {
        disallowPrototype: true,
      },
    ],
    "@typescript-eslint/ban-types": [
      "error",
      {
        types: {
          object: false,
          "{}": false,
        },
      },
    ],
  },
};
