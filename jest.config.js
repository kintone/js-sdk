/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  roots: ["<rootDir>/src"],
  clearMocks: true,
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "fixtures"],
};
module.exports = config;
