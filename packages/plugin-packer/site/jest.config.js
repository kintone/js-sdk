/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  testRegex: "/test/.*-test\\.js$",
  testEnvironment: "jsdom",
};
module.exports = config;
