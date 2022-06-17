import { defineConfig } from "rollup";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";
import replace from "rollup-plugin-replace";
import pkgJson from "./package.json";
import builtins from "rollup-plugin-node-builtins";
import globals from "rollup-plugin-node-globals";
import babel from "@rollup/plugin-babel";
import { ecmaVersionValidator } from "rollup-plugin-ecma-version-validator";

const extensions = [".ts", ".js"];

const isProd = process.env.BUILD === "production";

export default defineConfig({
  input: "./src/index.browser.ts",
  output: {
    extend: true,
    file: `./umd/KintoneRestAPIClient${isProd ? ".min" : ""}.js`,
    format: "umd",
    name: "window",
    sourcemap: isProd ? false : "inline",
  },
  plugins: [
    babel({
      babelHelpers: "bundled",
      presets: [
        [
          "@babel/preset-env",
          {
            corejs: 3,
            useBuiltIns: "usage",
          },
        ],
        "@babel/preset-typescript",
      ],
      extensions,
      include: ["src/**/*"],
    }),
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs({ extensions }),
    babel({
      babelHelpers: "bundled",
      presets: [
        [
          "@babel/preset-env",
          {
            targets: {
              // see kintone's supported browsers https://get.kintone.help/general/en/user/list_start/webbrowser.html
              browsers: [
                "last 2 edge versions",
                "last 2 firefox version",
                "last 2 chrome versions",
                "last 2 safari versions",
                "iOS >= 14",
                "last 2 and_chr versions",
              ],
            },
          },
        ],
      ],
    }),
    json(),
    replace({
      PACKAGE_VERSION: JSON.stringify(pkgJson.version),
    }),
    globals(),
    builtins(),
    isProd && terser(),
    ecmaVersionValidator({ ecmaVersion: 6 }),
  ],
});
