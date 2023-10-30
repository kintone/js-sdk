import path from "path";
import { fileURLToPath } from 'node:url';
import fs from "fs";
import os from "os";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tempDir = fs.mkdtempSync(
    path.join(os.tmpdir(), "kintone-rest-api-client-vite-bundle-")
);

export default {
  mode: "development",
  entry: {
    index: path.resolve(__dirname, "../index.ts"),
  },
  output: {
    filename: "bundle.webpack.js",
    path: path.resolve(tempDir, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.[t|j]sx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
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
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
};
