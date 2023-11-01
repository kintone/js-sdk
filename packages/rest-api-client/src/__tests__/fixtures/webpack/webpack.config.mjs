import path from "path";
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  mode: "development",
  entry: {
    index: path.resolve(__dirname, "../index.ts"),
  },
  output: {
    filename: "bundle.webpack.js",
    path: path.resolve(process.env.TEMP_DIR, "dist"),
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
