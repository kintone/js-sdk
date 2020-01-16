const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "development",
  entry: {
    "run-browser": "./scripts/run-browser.ts"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          configFile: "tsconfig.webpack.json",
          transpileOnly: true
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.KINTONE_BASE_URL": JSON.stringify(
        process.env.KINTONE_BASE_URL
      )
    })
  ],
  devtool: "inline-cheap-source-map"
};
