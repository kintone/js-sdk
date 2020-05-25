import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import builtinModules from "builtin-modules";

export default {
  input: "src/index.ts",
  output: {
    entryFileNames: "index.mjs",
    dir: "esm",
    format: "esm",
  },
  plugins: [
    typescript({
      declaration: false,
      tsconfig: "tsconfig.esm.json",
    }),
    resolve({
      preferBuiltins: false,
    }),
    commonjs({ extensions: [".js", ".ts"] }),
    json(),
  ],
  external: [
    ...builtinModules,
  ],
};
