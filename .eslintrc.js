module.exports = {
  extends: "@cybozu/eslint-config/presets/node-typescript-prettier",
  rules: {
    "@typescript-eslint/ban-types": [
      "error",
      {
        types: {
          "object": false,
          "{}": false
        },
      }
    ]
  }
};
