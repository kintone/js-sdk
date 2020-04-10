module.exports = {
  clearMocks: true,
  rootDir: "src",
  setupFiles: ["<rootDir>/__tests__/setup.ts"],
  testPathIgnorePatterns: ["node_modules", "<rootDir>/__tests__/setup.ts"],
};
