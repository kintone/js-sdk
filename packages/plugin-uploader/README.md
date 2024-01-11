# @kintone/plugin-uploader

[![npm version](https://badge.fury.io/js/%40kintone%2Fplugin-uploader.svg)](https://badge.fury.io/js/%40kintone%2Fplugin-uploader)
![Node.js version](https://img.shields.io/badge/dynamic/json.svg?url=https://raw.githubusercontent.com/kintone/js-sdk/master/packages/plugin-uploader/package.json&label=node&query=$.engines.node&colorB=blue)
![License](https://img.shields.io/npm/l/@kintone/plugin-uploader.svg)

A kintone plugin uploader using [puppeteer](https://github.com/GoogleChrome/puppeteer)

## Usage

```
% npm install @kintone/plugin-uploader
% ./node_modules/.bin/kintone-plugin-uploader
--base-url ${yourKintoneBaseUrl} \
--username ${yourLoginName} \
--password ${yourPassword} \
${pluginZipPath}
```

or

```
% npm install -g @kintone/plugin-uploader
% kintone-plugin-uploader \
--base-url ${yourKintoneBaseUrl} \
--username ${yourLoginName} \
--password ${yourPassword} \
${pluginZipPath}
```

If you want to upload the plugin automatically when the plugin is updated, you can use `--watch` option.

```
% kintone-plugin-uploader \
--base-url ${yourKintoneBaseUrl} \
--username ${yourLoginName} \
--password ${yourPassword} \
--watch \
${pluginZipPath}
```

It works fine with [@kintone/plugin-packer](https://github.com/kintone/js-sdk/tree/master/packages/plugin-packer).
You can create a project based on `@kintone/plugin-packer` using [@kintone/create-plugin](https://github.com/kintone/js-sdk/tree/master/packages/create-plugin) :).

## Options

```
  Usage
    $ kintone-plugin-uploader <pluginPath>
  Options
    --base-url Base-url of your kintone
    --username Login username
    --password User's password
    --proxy Proxy server
    --basic-auth-username username for Basic Authentication
    --basic-auth-password password for Basic Authentication
    --watch Watch the changes of plugin zip and re-run
    --waiting-dialog-ms The waiting time for showing the input dialog in milliseconds
    --lang Using language (en or ja)
    --puppeteer-ignore-default-args Ignore default arguments of puppeteer

    You can set the values through environment variables
    base-url: KINTONE_BASE_URL
    username: KINTONE_USERNAME
    password: KINTONE_PASSWORD
    basic-auth-username: KINTONE_BASIC_AUTH_USERNAME
    basic-auth-password: KINTONE_BASIC_AUTH_PASSWORD
    proxy: HTTPS_PROXY or HTTP_PROXY
```

If you ommit the options, you can input the options interactively.

```
% kintone-plugin-uploader plugin.zip
? Input your username: hoge
? Input your password: [hidden]
? Input your kintone's base URL: https://example.cybozu.com
```

If you encounter an error with the following message while uploading a plugin, chrome group policies in Windows might cause it:

> Error: Failed to launch the browser process!
>
> TROUBLESHOOTING: https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md

The chrome group policy configured in Windows can enforce to install certain chrome extensions on browsers. The puppeteer fails to launch chrome when these policies are enabled. See [puppeteer document](https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md) for more detail.  
To avoid this issue, the plugin-uploader provides the `--puppeteer-ignore-default-args` option. Try to run plugin-uploader with the following option:

```console
$ kintone-plugin-uploader \
  ....
  --puppeteer-ignore-default-args="--disable-extensions"
```

## LICENSE

MIT License
