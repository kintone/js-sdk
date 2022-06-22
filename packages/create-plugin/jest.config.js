/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  roots: ["<rootDir>/src"],
  testRegex: "/__tests__/.*\\.test\\.ts$",
  testEnvironment: "node",
};
module.exports = config;
