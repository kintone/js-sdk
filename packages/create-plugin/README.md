# create-kintone-plugin

[![npm version](https://badge.fury.io/js/%40kintone%2Fcreate-plugin.svg)](https://badge.fury.io/js/%40kintone%2Fcreate-plugin)
[![CircleCI](https://circleci.com/gh/kintone/create-plugin.svg?style=shield)](https://circleci.com/gh/kintone/create-plugin)
[![Build status](https://ci.appveyor.com/api/projects/status/emvyvmk1vd4rwbef?svg=true)](https://ci.appveyor.com/project/koba04/create-kintone-plugin)

A CLI tool for creating a kintone plugin!

## Usage

```
npx @kintone/create-plugin ${name}
```

After the command has been finished, you can start development kintone plugin!

```
cd ${name}
npm start
```

## Language

`@kintone/create-plugin` is supporting Japanese,
if you want to use console messages in Japanese, you can use `--lang ja` option.

```
npx @kintone/create-plugin ${name} --lang ja
```

If you set `LANG` environment variable `ja_XX.XXX`, the lang option will be `ja` automatically.

## LICENSE

MIT License
