# create-kintone-plugin

[![npm version](https://badge.fury.io/js/%40kintone%2Fcreate-plugin.svg)](https://badge.fury.io/js/%40kintone%2Fcreate-plugin)
[![CircleCI](https://circleci.com/gh/kintone/create-plugin.svg?style=shield)](https://circleci.com/gh/kintone/create-plugin)
[![Build Status](https://travis-ci.org/kintone/create-plugin.svg?branch=master)](https://travis-ci.org/kintone/create-plugin)

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
? Do you use @kintone/plugin-uploader? Yes
:
:
:
Success! Created hello-kintone-plugin at hello-kintone-plugin

npm start

  Start the process watching file changes and create a kintone plugin zip.
  And then, the plugin zip is uploaded automatically by @kintone/plugin-uploader.

npm run build

  Create a kintone plugin zip.

npm run lint

  Lint js files with ESLint.

Try the following commands
And then, please input your information for kintone account

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

`@kintone/create-plugin` detects your language with `os-locale`. (default: English)
If you want to use other languages, you can use `--lang` option.
Currently, `--lang` option accepts `ja` or `en`.

```
npx @kintone/create-plugin hello-kintone-plugin --lang ja
:
kintoneプラグインのプロジェクトを作成するために、いくつかの質問に答えてください :)
では、はじめましょう！



? プラグインの英語名を入力してください [1-64文字] hello-kintone-plugin
? プラグインの説明を入力してください [1-200文字] hello-kintone-plugin
? 日本語をサポートしますか？ Yes
? プラグインの日本語名を入力してください [1-64文字] (省略可)
? プラグインの日本語の説明を入力してください [1-200文字] (省略可)
? 中国語をサポートしますか？ Yes
? プラグインの中国語名を入力してください [1-64文字] (省略可)
? プラグインの中国語の説明を入力してください [1-200文字] (省略可)
? プラグインの英語のWebサイトURLを入力してください (省略可)
? プラグインの日本語のWebサイトURLを入力してください (省略可)
? プラグインの中国語のWebサイトURLを入力してください (省略可)
? モバイルページをサポートしますか？ Yes
? @kintone/plugin-uploaderを使いますか？ Yes
依存ライブラリをインストールします
:
:
:
Success! Created hello-kintone-plugin at hello-kintone-plugin

npm start

  ファイルの変更を監視してプラグインのzipを自動的に作成するプロセスを起動します
  その後、@kintone/plugin-uploaderにより、プラグインのzipは自動的にアップロードされます

npm run build

  プラグインのzipを作成します

npm run lint

  ESLintを使ってJavaScriptのソースコードをチェックします

まずは次のコマンドを実行してください
その後、あなたのkintone環境の情報を入力してください

  cd hello-kintone-plugin
  npm start

kintoneプラグイン開発をはじめましょう！
開発に関する情報はcybozu developer network:

  https://developer.cybozu.io
```

## LICENSE

MIT License
