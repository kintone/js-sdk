/* eslint-disable node/no-unpublished-require */
const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "development",
  entry: {
    "run-browser": "./src/run-browser.ts",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.KINTONE_BASE_URL": JSON.stringify(
        process.env.KINTONE_BASE_URL
      ),
    }),
  ],
  devtool: "inline-cheap-source-map",
};
