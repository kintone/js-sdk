# create-kintone-plugin

[![npm version](https://badge.fury.io/js/%40koba04%2Fcreate-kintone-plugin.svg)](https://badge.fury.io/js/%40koba04%2Fcreate-kintone-plugin)
[![CircleCI](https://circleci.com/gh/koba04/create-kintone-plugin.svg?style=shield)](https://circleci.com/gh/koba04/create-kintone-plugin)
[![Build status](https://ci.appveyor.com/api/projects/status/emvyvmk1vd4rwbef?svg=true)](https://ci.appveyor.com/project/koba04/create-kintone-plugin)

A CLI tool for creating a kintone plugin!

## Usage

```
npx create-kintone-plugin ${name}
```

or

```
npm install -g create-kintone-plugin
create-kintone-plugin ${name}
```

After the command has been finished, you can start development kintone plugin!

```
cd ${name}
npm start
```

## Language

`create-kintone-plugin` is supporting Japanese,
if you want to use console messages in Japanese, you can use `--lang ja` option.

```
npx create-kintone-plugin ${name} --lang ja
```

If you set `LANG` environment variable `ja_XX.XXX`, the lang option will be `ja` automatically.

## LICENSE

MIT License: Toru Kobayashi
