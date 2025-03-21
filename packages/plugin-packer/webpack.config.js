"use strict";

const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./site/index.js",
  output: {
    path: path.resolve(__dirname, "docs", "dist"),
    filename: "bundle.js",
  },
  devServer: {
    devMiddleware: {
      publicPath: "/dist/",
    },
    static: {
      directory: path.resolve(__dirname, "docs"),
      watch: true,
    },
    open: true,
  },
  resolve: {
    fallback: {
      assert: require.resolve("assert"),
      fs: false,
      util: require.resolve("util"),
      path: require.resolve("path-browserify"),
      crypto: require.resolve("crypto-browserify"),
      zlib: require.resolve("browserify-zlib"),
      stream: require.resolve("stream-browserify"),
      constants: require.resolve("constants-browserify"),
      vm: false,
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_DEBUG": process.env.NODE_DEBUG,
    }),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process",
    }),
  ],
};
