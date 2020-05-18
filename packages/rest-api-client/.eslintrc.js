module.exports = {
  extends: "@cybozu/eslint-config/presets/node-typescript-prettier",
  "rules": {
    "node/no-missing-import": ["error", {
      "allowModules": ["type-fest"]
    }]
  }
};
