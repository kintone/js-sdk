kintone-plugin-packer
====

[kintone plugin package.sh](https://github.com/kintone/plugin-sdk) for JavaScript

It's written in pure JavaScript:

- Works with Node.js in Mac/Linux/Windows
- Works in browsers

# Usage

```console
$ kintone-plugin-packer [OPTIONS] PLUGIN_DIR
```

## Options

- `--ppk PPK_FILE`: The path of input private key file. If omitted, it is generated automatically into `<Plugin ID>.ppk` in the same directory of `PLUGIN_DIR`.
- `--out PLUGIN_FILE`: The path of generated plugin file. The default is `plugin.zip` in the same directory of `PLUGIN_DIR`.


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
