/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  testRegex: "(?<!site)/test/[^\\/]*\\.spec.ts$",
  testEnvironment: "node",
  testTimeout: 30000,
};
module.exports = config;
