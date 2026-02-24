import { rules } from "./rules/index.js";
import module from "node:module";
import type { Linter } from "eslint";
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

// Workaround for type compatibility issue between @typescript-eslint/utils RuleModule and @types/eslint
// https://github.com/typescript-eslint/typescript-eslint/issues/9724
const configs = {
  recommended: {
    files: ["**/*.{js,cjs,mjs,ts,cts,mts,jsx,tsx}"],
    plugins: {
      [name]: base,
    },
    rules: {
      [`${name}/no-cybozu-data`]: "error",
      [`${name}/no-kintone-internal-selector`]: "error",
    } satisfies {
      [key in `${typeof name}/${keyof typeof rules}`]?: TSESLint.FlatConfig.SeverityString;
    },
  } as unknown as Linter.Config,
  manifestV2: {
    files: ["**/*.{js,cjs,mjs,ts,cts,mts,jsx,tsx}"],
    plugins: {
      [name]: base,
    },
    rules: {
      [`${name}/only-allowed-js-api`]: "error",
    } satisfies {
      [key in `${typeof name}/${keyof typeof rules}`]?: TSESLint.FlatConfig.SeverityString;
    },
  } as unknown as Linter.Config,
};

const plugin = Object.assign(base, {
  configs,
}) satisfies TSESLint.FlatConfig.Plugin;
export default plugin;
