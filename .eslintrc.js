module.exports = {
  extends: "@cybozu/eslint-config/presets/node-typescript-prettier",
  rules: {
    curly: ["error", "all"],
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
