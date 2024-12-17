import { rules } from "./rules/index.js";
import module from "node:module";
import type { TSESLint } from "@typescript-eslint/utils";
const require = module.createRequire(import.meta.url);

const name = "@kintone/eslint-plugin";
const { version } =
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  require("../package.json") as typeof import("../package.json");

const base = {
  meta: { name, version },
  rules,
};

const configs = {
  recommended: {
    files: ["**/*.{ts,cts,mts,tsx}"],
    plugins: {
      [name]: base,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      [`${name}/permissions`]: "error",
    } satisfies {
      [key in `${typeof name}/${keyof typeof rules}`]: TSESLint.FlatConfig.SeverityString;
    },
  },
} satisfies TSESLint.FlatConfig.Plugin["configs"];

const plugin = Object.assign(base, {
  configs,
}) satisfies TSESLint.FlatConfig.Plugin;
export default plugin;
