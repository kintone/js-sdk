# webpack-plugin-kintone-plugin

[![npm version](https://badge.fury.io/js/%40kintone%2Fwebpack-plugin-kintone-plugin.svg)](https://badge.fury.io/js/%40kintone%2Fwebpack-plugin-kintone-plugin)
![Node.js version](https://img.shields.io/badge/dynamic/json.svg?url=https://raw.githubusercontent.com/kintone/js-sdk/master/packages/webpack-plugin-kintone-plugin/package.json&label=node&query=$.engines.node&colorB=blue)
![License](https://img.shields.io/npm/l/@kintone/webpack-plugin-kintone-plugin.svg)

A webpack plugin to create a plugin zip of Kintone.

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
