/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  roots: ["<rootDir>/src"],
  testEnvironment: "node",
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/src/__tests__/sample",
  ],
  testTimeout: 30000,
};
module.exports = config;
