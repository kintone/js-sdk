# webpack-plugin-kintone-plugin

[![npm version](https://badge.fury.io/js/%40kintone%2Fwebpack-plugin-kintone-plugin.svg)](https://badge.fury.io/js/%40kintone%2Fwebpack-plugin-kintone-plugin)
[![CircleCI](https://circleci.com/gh/kintone/webpack-plugin-kintone-plugin.svg?style=shield)](https://circleci.com/gh/kintone/webpack-plugin-kintone-plugin)
[![Build Status](https://travis-ci.org/kintone/webpack-plugin-kintone-plugin.svg?branch=master)](https://travis-ci.org/kintone/webpack-plugin-kintone-plugin)

A webpack plugin to create a plugin zip of kintone.

## Usage

```js
"use strict";

const path = require("path");
const KintonePlugin = require("@kintone/webpack-plugin-kintone-plugin");

module.exports = {
  entry: {
    desktop: "./src/desktop.js",
    mobile: "./src/mobile.js"
  },
  output: {
    path: path.resolve(__dirname, "plugin", "js"),
    filename: "[name].js"
  },
  plugins: [
    new KintonePlugin({
      manifestJSONPath: "./plugin/manifest.json",
      privateKeyPath: "./private.ppk",
      pluginZipPath: "./dist/plugin.zip"
    })
  ]
};
```

The settings is the following structure.

* `src/desktop.js` is an entry point of desktop javascript.
* `src/mobild.js` is an entry point of desktop javascript.
* `plugin` is the directory of the plugin, which includes `manifest.json` and other resources.
* `private.ppk` is the private key for the plugin
* `dist/plugin.zip` is the plugin zip file.

## Install

```
npm install @kintone/webpack-plugin-kintone-plugin
```

## Options

You can customize the paths of manifest.json, privateKey and plugin zip.
Those default values are like the following.

```
manifestJSONPath: './manifest.json',
privateKeyPath: './private.ppk',
pluginZipPath: './dist/plugin.zip'
```

If you want to customize these values, you can update the values like this.

```js
"use strict";

const path = require("path");
const KintonePlugin = require("@kintone/webpack-plugin-kintone-plugin");

module.exports = {
  entry: {
    desktop: "./src/desktop.js",
    mobile: "./src/mobile.js"
  },
  output: {
    path: path.resolve(__dirname, "plugin", "js"),
    filename: "[name].js"
  },
  plugins: [
    new KintonePlugin({
      manifestJSONPath: "./plugin/manifest.json",
      privateKeyPath: "./private.ppk",
      pluginZipPath: "./dist/plugin.zip"
    })
  ]
};
```

In addition to that, you can specify the plugin zip name based on the plugin id and values of the manifest.json.

```js
plugins: [
  new KintonePlugin({
    manifestJSONPath: "./plugin/manifest.json",
    privateKeyPath: "./private.ppk",
    pluginZipPath: (id, manifest) => `${id}.${manifest.version}.plugin.zip`
  })
];
```

## License

MIT License
