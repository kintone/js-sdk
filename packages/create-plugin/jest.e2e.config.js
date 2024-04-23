/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  roots: ["<rootDir>"],
  setupFilesAfterEnv: ["<rootDir>/__e2e__/setup.ts"],
  testRegex: "/__e2e__/.*\\.test\\.ts$",
  testEnvironment: "node",
  testTimeout: 1000,
};
module.exports = config;
