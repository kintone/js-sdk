/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  roots: ["<rootDir>"],
  testRegex: "/__e2e__/.*\\.test\\.ts$",
  testEnvironment: "./JestCustomEnvironment.js",
  setupFilesAfterEnv: ["<rootDir>/__e2e__/setup.ts"],
  testTimeout: 120000,
};
module.exports = config;
