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
    desktop: path.resolve(process.env.SRC_DIR, "desktop.js"),
    mobile: path.resolve(process.env.SRC_DIR, "mobile.js"),
    config: path.resolve(process.env.SRC_DIR, "config.js"),
  },
  output: {
    path: path.resolve(__dirname, "plugin", "js"),
    filename: "[name].js",
  },
  plugins: [
    new KintonePlugin({
      manifestJSONPath: "./plugin/manifest.json",
      privateKeyPath: "./private.ppk",
      pluginZipPath: "dist/watch/plugin.zip",
    }),
  ],
};
