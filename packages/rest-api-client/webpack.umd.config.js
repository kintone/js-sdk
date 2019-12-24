const path = require("path");

module.exports = (_, argv) => ({
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "umd"),
    libraryTarget: "umd",
    libraryExport: "KintoneAPIClient",
    library: "KintoneRestApiClient",
    filename: `KintoneRestApiClient${
      argv.mode === "production" ? ".min" : ""
    }.js`
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          configFile: "tsconfig.json",
          transpileOnly: true
        }
      }
    ]
  },
  devtool: argv.mode === "production" ? "" : "inline-cheap-source-map"
});
