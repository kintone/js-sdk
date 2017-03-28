kintone-plugin-packer
====

[kintone plugin package.sh](https://github.com/kintone/plugin-sdk) in JavaScript

[![npm version][npm-image]][npm-url]
![Node.js Version Support][node-version]
[![build status][circleci-image]][circleci-url]
[![windows build status][appveyor-image]][appveyor-url]
[![dependency status][deps-image]][deps-url]
![License][license]

It's written in pure JavaScript:

- Works with Node.js in Mac/Linux/Windows
- Works in browsers

# How to install

```console
$ npm install @teppeis/kintone-plugin-packer
```

# Usage

```console
$ kintone-plugin-packer [OPTIONS] PLUGIN_DIR
```

## Options

- `--ppk PPK_FILE`: The path of input private key file. If omitted, it is generated automatically into `<Plugin ID>.ppk` in the same directory of `PLUGIN_DIR`.
- <del>`--out PLUGIN_FILE`: The path of generated plugin file. The default is `plugin.zip` in the same directory of `PLUGIN_DIR`.</del> Not implemented yet.


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

## License

MIT License: Teppei Sato &lt;teppeis@gmail.com&gt;

[npm-image]: https://img.shields.io/npm/v/@teppeis/kintone-plugin-packer.svg
[npm-url]: https://npmjs.org/package/@teppeis/kintone-plugin-packer
[npm-downloads-image]: https://img.shields.io/npm/dm/@teppeis/kintone-plugin-packer.svg
[travis-image]: https://img.shields.io/travis/teppeis/kintone-plugin-packer/master.svg
[travis-url]: https://travis-ci.org/teppeis/kintone-plugin-packer
[circleci-image]: https://circleci.com/gh/teppeis/kintone-plugin-packer.svg?style=svg
[circleci-url]: https://circleci.com/gh/teppeis/kintone-plugin-packer
[appveyor-image]: https://ci.appveyor.com/api/projects/status/5fv4fdrnt4wj7evy?svg=true
[appveyor-url]: https://ci.appveyor.com/project/teppeis/kintone-plugin-packer/branch/master
[deps-image]: https://img.shields.io/david/teppeis/kintone-plugin-packer.svg
[deps-url]: https://david-dm.org/teppeis/kintone-plugin-packer
[node-version]: https://img.shields.io/badge/Node.js%20support-v4,v6,v7-brightgreen.svg
[coverage-image]: https://img.shields.io/coveralls/teppeis/kintone-plugin-packer/master.svg
[coverage-url]: https://coveralls.io/github/teppeis/kintone-plugin-packer?branch=master
[license]: https://img.shields.io/npm/l/@teppeis/kintone-plugin-packer.svg
