/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  roots: ["<rootDir>/__tests__"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "lib/"],
};
module.exports = config;
