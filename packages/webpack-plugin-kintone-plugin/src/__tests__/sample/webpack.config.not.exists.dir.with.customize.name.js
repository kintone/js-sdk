"use strict";

const path = require("path");
const KintonePlugin = require(path.resolve(
  __dirname,
  "..",
  "..",
  "..",
  "dist",
  "index"
));

module.exports = {
  entry: {
    customize: "./src/customize.js",
  },
  output: {
    path: path.resolve(__dirname, "plugin", "js"),
    filename: "[name].js",
  },
  plugins: [
    new KintonePlugin({
      pluginZipPath: (id, manifest) =>
        `dist/new/to/${id}.${manifest.name.en.replace(/\s/g, ".")}.zip`,
    }),
  ],
};
