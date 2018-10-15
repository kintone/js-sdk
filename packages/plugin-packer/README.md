kintone-plugin-packer
====

[kintone plugin package.sh](https://github.com/kintone/plugin-sdk) in JavaScript

[![npm version][npm-image]][npm-url]
![Node.js Version Support][node-version]
[![build status][circleci-image]][circleci-url]
[![build status][travisci-image]][travisci-url]
[![dependency status][deps-image]][deps-url]
![License][license]

It's written in pure JavaScript, so

- The CLI works with Node.js in Mac/Windows/Linux
- [The web page](https://kintone.github.io/plugin-packer/) works in any modern browsers
- Validate your `manifest.json` with [JSON Schema](https://github.com/teppeis/kintone-plugin-manifest-validator)

# How to install

```console
$ npm install -g @kintone/plugin-packer
```

# Usage: CLI

```console
$ kintone-plugin-packer [OPTIONS] PLUGIN_DIR
```

## Options

- `--ppk PPK_FILE`: The path of input private key file. If omitted, it is generated automatically into `<Plugin ID>.ppk` in the same directory of `PLUGIN_DIR` or `--out` if specified.
- `--out PLUGIN_FILE`: The path of generated plugin file. The default is `plugin.zip` in the same directory of `PLUGIN_DIR`.
- `--watch`, `-w`: Watch PLUGIN_DIR for the changes.

## How to use with `npm run`

If your private key is `./private.ppk` and the plugin directory is `./plugin`, edit `package.json`:

```json
{
  "scripts": {
    "package": "kintone-plugin-packer --ppk private.ppk plugin"
  }
}
```

and then

```console
$ npm run package
```

# Usage: Node.js API

```js
const packer = require('@kintone/plugin-packer');
const fs = require('fs');

const buffer = createContentsZipBufferInYourSelf();
packer(buffer).then(output => {
  console.log(output.id);
  fs.writeFileSync('./private.ppk', output.privateKey);
  fs.writeFileSync('./plugin.zip', output.plugin);
});
```

## License

MIT License

[npm-image]: https://img.shields.io/npm/v/@kintone/plugin-packer.svg
[npm-url]: https://npmjs.org/package/@kintone/plugin-packer
[circleci-image]: https://circleci.com/gh/kintone/plugin-packer.svg?style=shield
[circleci-url]: https://circleci.com/gh/kintone/plugin-packer
[travisci-image]: https://travis-ci.org/kintone/plugin-packer.svg?branch=master
[travisci-url]: https://travis-ci.org/kintone/plugin-packer
[deps-image]: https://img.shields.io/david/kintone/plugin-packer.svg
[deps-url]: https://david-dm.org/kintone/plugin-packer
[node-version]: https://img.shields.io/badge/Node.js%20support-v6,v8,v10-brightgreen.svg
[license]: https://img.shields.io/npm/l/@kintone/plugin-packer.svg
