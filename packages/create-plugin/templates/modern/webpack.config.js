const path = require("path");
const KintonePlugin = require("@kintone/webpack-plugin-kintone-plugin");

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  mode: isProduction ? "production" : "development",
  devtool: isProduction ? false : "inline-cheap-module-source-map",
  entry: {
    config: "./src/js/config.ts",
    desktop: "./src/js/desktop.ts",
    mobile: "./src/js/mobile.ts",
  },
  output: {
    path: path.resolve(__dirname, "plugin", "js"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [{ test: /\.ts$/, loader: "ts-loader" }],
  },
  plugins: [
    new KintonePlugin({
      manifestJSONPath: "./plugin/manifest.json",
      privateKeyPath: "./private.ppk",
      pluginZipPath: "./dist/plugin.zip",
    }),
  ],
};
