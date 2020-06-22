# @kintone/plugin-uploader

[![npm version](https://badge.fury.io/js/%40kintone%2Fplugin-uploader.svg)](https://badge.fury.io/js/%40kintone%2Fplugin-uploader)
[![CircleCI](https://circleci.com/gh/kintone/plugin-uploader.svg?style=shield)](https://circleci.com/gh/kintone/plugin-uploader)

A kintone plugin uploader using [puppeteer](https://github.com/GoogleChrome/puppeteer)

## Usage

```
% npm install @kintone/plugin-uploader
% ./node_modules/.bin/kintone-plugin-uploader
--domain ${yourDomain} \
--username ${yourLoginName} \
--password ${yourPassword} \
${pluginZipPath}
```

or

```
% npm install -g @kintone/plugin-uploader
% kintone-plugin-uploader \
--domain ${yourDomain} \
--username ${yourLoginName} \
--password ${yourPassword} \
${pluginZipPath}
```

If you want to upload the plugin automatically when the plugin is updated, you can use `--watch` option.

```
% kintone-plugin-uploader \
--domain ${yourDomain} \
--username ${yourLoginName} \
--password ${yourPassword} \
--watch \
${pluginZipPath}
```

It works fine with [@kintone/plugin-packer](https://github.com/kintone/plugin-packer).
You can create a project based on `@kintone/plugin-packer` using [@kintone/create-plugin](https://github.com/kintone/create-plugin) :).

## Options

```
  Usage
    $ kintone-plugin-uploader <pluginPath>
  Options
    --domain Domain of your kintone
    --username Login username
    --password User's password
    --proxy Proxy server
    --basic-auth-username username for Basic Authentication
    --basic-auth-password password for Basic Authentication
    --watch Watch the changes of plugin zip and re-run
    --lang Using language (en or ja)

    You can set the values through environment variables
    domain: KINTONE_DOMAIN
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
? Input your domain: example.com
```

## LICENSE

MIT License
