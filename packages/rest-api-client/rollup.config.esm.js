import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import pkgJson from "./package.json";
import babel from "@rollup/plugin-babel";
import builtinModules from "builtin-modules";

const extensions = [".ts", ".js"];

export default {
  input: "./src/index.esm.mjs",
  output: {
    file: "./esm/index.mjs",
    format: "esm",
  },
  plugins: [
    babel({
      babelHelpers: "bundled",
      presets: [
        [
          "@babel/preset-env",
          {
            targets: {
              // The reason why we use `browsers` property is https://github.com/babel/babel/issues/10182#issuecomment-509561834
              browsers: [`node ${pkgJson.engines.node}`],
            },
          },
        ],
        "@babel/preset-typescript",
      ],
      extensions,
      include: ["src/**/*"],
    }),
    resolve({
      preferBuiltins: false,
    }),
    commonjs({ extensions }),
    json(),
  ],
  external: builtinModules,
};
