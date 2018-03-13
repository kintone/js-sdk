# webpack-plugin-kintone-plugin

A webpack plugin to create a plugin zip of kintone.

## Usage

```js
const KintonePlugin = require('@koba04/webpack-plugin-kintone-plugin');

module.exports = {
  entry: {
    customize: './src/customize.js'
  },
  output: {
    path: path.resolve(__dirname, 'plugin', 'js'),
    filename: '[name].js'
  },
  plugins: [new KintonePlugin()]
};
```

## Install

```
npm install @koba04/webpack-plugin-kintone-plugin
```

## Options

You can customize the paths of manifest.json, privateKey and plugin zip.
Those default values are like the following.

```
manifestJSONPath: './plugin/manifest.json',
privateKeyPath: './private.ppk',
pluginZipPath: './dist/plugin.zip'
```

If you want to customize these values, you can update the values like this.

```js
const KintonePlugin = require('@koba04/webpack-plugin-kintone-plugin');

module.exports = {
  entry: {
    customize: './src/customize.js'
  },
  output: {
    path: path.resolve(__dirname, 'plugin', 'js'),
    filename: '[name].js'
  },
  plugins: [
    new KintonePlugin({
      manifestJSONPath: './manifest.json',
      privateKeyPath: './key/private.ppk',
      pluginZipPath: './out/plugin.zip'
    })
  ]
};
```

In addition to that, you can specify the plugin zip name based on the plugin id and values of the manifest.json.

```js
plugins: [
  new KintonePlugin({
    manifestJSONPath: './manifest.json',
    privateKeyPath: './key/private.ppk',
    pluginZipPath: (id, manifest) => `${id}.${manifest.version}.plugin.zip`
  })
];
```

## License

MIT License: Toru Kobayashi <koba0004@gmail.com>
