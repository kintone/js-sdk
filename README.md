# create-kintone-plugin

[![npm version](https://badge.fury.io/js/%40kintone%2Fcreate-plugin.svg)](https://badge.fury.io/js/%40kintone%2Fcreate-plugin)
[![CircleCI](https://circleci.com/gh/kintone/create-plugin.svg?style=shield)](https://circleci.com/gh/kintone/create-plugin)
[![Build status](https://ci.appveyor.com/api/projects/status/8yw1p1qntqlgg6v5?svg=true)](https://ci.appveyor.com/project/koba04/create-plugin)

A CLI tool for creating a kintone plugin!

## Usage

```
npx @kintone/create-plugin ${name}
```

or

```
npm install -g @kintone/create-plugin
create-kintone-plugin ${name}
```

You can configure your kintone plugin settings interactively.

```
npx @kintone/create-plugin hello-kintone-plugin
:
Please answer some questions to create your kintone plugin project :)
Let's start!



? Input your plugin name in English [1-64chars] hello-kintone-plugin
? Input your plugin description in English [1-200chars] hello-kintone-plugin
? Does your plugin support Japanese? Yes
? Input your plugin name in Japanese [1-64chars] (Optional)
? Input your plugin description in Japanese [1-200chars] (Optional)
? Does your plugin support Chinese? Yes
? Input your plugin name in Chinese [1-64chars] (Optional)
? Input your plugin description in Chinese [1-200chars] (Optional)
? Input your home page url for English (Optional)
? Input your home page url for Japanese (Optional)
? Input your home page url for Chinese (Optional)
? Does your plugin support mobile views? Yes
? Does your plugin need a config page? Yes
:
:
:
Success! Created hello-kintone-plugin at hello-kintone-plugin

npm start

  Start the process watching file changes and create a kintone plugin zip.

npm run build

  Create a kintone plugin zip.

npm run lint

  Lint js files with ESLint.

Try the following commands

  cd hello-kintone-plugin
  npm start

Enjoy Hacking kintone plugin!
```

After the command has been finished, you can start development kintone plugin!

```
cd hello-kintone-plugin
npm start
```

## Language

The default language of `@kintone/create-plugin` is English.
If you want to use messages in Japanese, you can use `--lang ja` option.

```
npx @kintone/create-plugin ${name} --lang ja
```

If you set `LANG` environment variable like `ja_XX.XXX`, the lang option will be `ja` automatically.

## LICENSE

MIT License
