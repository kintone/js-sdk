const path = require("path");
const webpack = require("webpack");
const package = require("./package.json");

module.exports = (_, argv) => ({
  entry: "./src/index.browser.ts",
  output: {
    path: path.resolve(__dirname, "umd"),
    libraryTarget: "umd",
    libraryExport: "KintoneRestAPIClient",
    library: "KintoneRestAPIClient",
    filename: `KintoneRestAPIClient${
      argv.mode === "production" ? ".min" : ""
    }.js`,
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          configFile: "tsconfig.json",
          transpileOnly: true,
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      PACKAGE_VERSION: JSON.stringify(package.version),
    }),
  ],
  devtool: argv.mode === "production" ? "" : "inline-cheap-source-map",
});
