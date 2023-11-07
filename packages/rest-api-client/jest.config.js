/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  clearMocks: true,
  roots: ["<rootDir>/src"],
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/src/__tests__/setup.ts",
    "fixtures",
  ],
  testEnvironment: "node",
};
module.exports = config;
