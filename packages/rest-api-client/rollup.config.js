import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";
import replace from "rollup-plugin-replace";
import pkgJson from "./package.json";
import builtins from "rollup-plugin-node-builtins";
import globals from "rollup-plugin-node-globals";
import nodePolyfills from "rollup-plugin-node-polyfills";

export default (argv) => {
  const isProd = argv.mode === "production";
  const plugins = [
    typescript({
      declaration: false,
    }),
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs({ extensions: [".ts", ".js"] }),
    json(),
    replace({
      PACKAGE_VERSION: JSON.stringify(pkgJson.version),
    }),
    globals(),
    builtins(),
    nodePolyfills(),
  ];
  if (isProd) {
    plugins.push(terser());
  }
  return {
    input: "./src/index.browser.ts",
    output: {
      file: `./umd/KintoneRestAPIClient${isProd ? ".min" : ""}.js`,
      format: "umd",
      name: "KintoneRestAPIClient",
      compact: true,
    },
    plugins,
  };
};
