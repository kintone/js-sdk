import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import polyfillNode from "rollup-plugin-polyfill-node";
import { terser } from "rollup-plugin-terser";

const isProd = process.env.BUILD === "production";

const extensions = [".js", ".jsx", ".es6", ".es", ".mjs", ".ts", ".tsx"];

export default {
  input: "./src/index.ts",
  output: {
    file: `./dist/index${isProd ? ".min" : ""}.js`,
    format: "esm",
    sourcemap: isProd ? false : "inline",
  },
  plugins: [
    commonjs(),
    resolve({
      extensions,
      browser: true,
      preferBuiltins: false,
    }),
    json(),
    polyfillNode(),
    babel({
      babelHelpers: "bundled",
      babelrc: false,
      extensions,
      include: ["src/**/*"],
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
      plugins: ["babel-plugin-replace-ts-export-assignment"],
    }),
    isProd && terser(),
  ],
};
