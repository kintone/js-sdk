import { defineConfig } from "rollup";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import path from "path";
import { fileURLToPath } from "node:url";
import fs from "fs";
import os from "os";

const extensions = [".ts", ".js"];
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tempDir = fs.mkdtempSync(
    path.join(os.tmpdir(), "kintone-rest-api-client-rollup-bundle-")
);

export default defineConfig({
  input: path.resolve(__dirname, "../index.ts"),
  output: {
    extend: true,
    file: path.resolve(tempDir, "dist", "bundle.rollup.js"),
    format: "umd",
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
