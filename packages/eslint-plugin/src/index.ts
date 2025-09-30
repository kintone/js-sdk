import { rules } from "./rules/index.js";
import module from "node:module";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
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
    files: ["**/*.{js,cjs,mjs,ts,cts,mts,jsx,tsx}"],
    plugins: {
      [name]: base,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: dirname(fileURLToPath(import.meta.url)),
      },
    },
    rules: {
      [`${name}/only-allowed-js-api`]: "error",
    } satisfies {
      [key in `${typeof name}/${keyof typeof rules}`]: TSESLint.FlatConfig.SeverityString;
    },
  },
} satisfies TSESLint.FlatConfig.Plugin["configs"];

const plugin = Object.assign(base, {
  configs,
}) satisfies TSESLint.FlatConfig.Plugin;
export default plugin;
