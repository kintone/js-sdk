import rootConfig from "../../eslint.config.mjs";
import siteConfig from "./site/eslint.config.mjs";
import binConfig from "./bin/eslint.config.mjs";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...siteConfig.map((configObject) => ({
    files: ["site/**/*.{js,ts}"],
    ...configObject,
  })),
  ...binConfig.map((configObject) => ({
    files: ["bin/**/*.{js,ts}"],
    ...configObject,
  })),
  ...rootConfig.map((configObject) => ({
    ignores: ["site/*", "bin/*"],
    ...configObject,
  })),
];
