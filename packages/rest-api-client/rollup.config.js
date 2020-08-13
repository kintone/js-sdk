import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";
import replace from "rollup-plugin-replace";
import pkgJson from "./package.json";
import builtins from "rollup-plugin-node-builtins";
import globals from "rollup-plugin-node-globals";
import babel from "@rollup/plugin-babel";

const extensions = [".ts", ".js"];

export default (argv) => {
  const isProd = argv.mode === "production";
  const plugins = [
    babel({
      babelHelpers: "bundled",
      presets: [
        [
          "@babel/preset-env",
          {
            corejs: 3,
            targets: { browsers: ["> 0.25%", "IE 11", "not op_mini all"] },
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
    json(),
    replace({
      PACKAGE_VERSION: JSON.stringify(pkgJson.version),
    }),
    globals(),
    builtins(),
  ];
  if (isProd) {
    plugins.push(terser());
  }
  return {
    input: "./src/index.browser.ts",
    output: {
      extend: true,
      file: `./umd/KintoneRestAPIClient${isProd ? ".min" : ""}.js`,
      format: "umd",
      name: "window",
      sourcemap: isProd ? false : "inline",
    },
    plugins,
  };
};
