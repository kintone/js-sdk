module.exports = {
  extends: "@cybozu/eslint-config/presets/node-typescript-prettier",
  rules: {
    /* ref
     * - https://github.com/eslint/eslint/issues/11899
     * - https://github.com/eslint/eslint/issues/11954
    */
    "require-atomic-updates": "off"
  }
};