/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  roots: ["<rootDir>"],
  testRegex: "/__e2e__/.*\\.test\\.ts$",
  testEnvironment: "node",
  testTimeout: 60000,
};
module.exports = config;
