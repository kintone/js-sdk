import { defineConfig } from "rollup";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";

const extensions = [".ts", ".js"];

export default defineConfig({
  input: "../index.ts",
  output: {
    extend: true,
    file: `./dist/bundle.js`,
    format: "iife",
    name: "MyBundle",
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
      include: ["../../../**/*"],
    }),
    resolve({ browser: true, preferBuiltins: false, }),
    commonjs({extensions}),
    json(),
  ],
});
