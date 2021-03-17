# kintone-data-loader

[![npm version](https://badge.fury.io/js/%40kintone%2Fdata-loader.svg)](https://badge.fury.io/js/%40kintone%2Fdata-loader)

A kintone record importer and exporter.

**THIS IS EXPERIMENTAL. DON'T USE THIS FOR PRODUCTION.**

## Installation

```
$ npm install -g @kintone/data-loader
```

You can use also npx instead of installing @kintone/data-loader as global.

## Usage

### import

`import` command allows you to import record data into a specified kintone app.

```
$ kintone-data-loader \
import \
--base-url https://${yourDomain} \
--username ${yourLoginName} \
--password ${yourPassword} \
--app ${kintoneAppId} \
--file-path ${filepath}
```

#### Options

Some options use enviroment variables starting `KINTONE_` as default values.

```
Options:
  --version              Show version number                           [boolean]
  --help                 Show help                                     [boolean]
  --base-url             Kintone Base Url            [default: KINTONE_BASE_URL]
  --username, -u         Kintone Username            [default: KINTONE_USERNAME]
  --password, -p         Kintone Password            [default: KINTONE_PASSWORD]
  --api-token            App's API token            [default: KINTONE_API_TOKEN]
  --basic-auth-username  Kintone Basic Auth Username
                                          [default: KINTONE_BASIC_AUTH_USERNAME]
  --basic-auth-password  Kintone Basic Auth Password
                                          [default: KINTONE_BASIC_AUTH_PASSWORD]
  --app                  The ID of the app
  --guest-space-id       The ID of guest space [default: KINTONE_GUEST_SPACE_ID]
  --file-path            The path to source file. ".json" or ".csv"
  --pfx-file-path        The path to client certificate file
  --pfx-file-password    The password of client certificate file
```

### export

`export` command allows you to export record data from a specified kintone app.

```
$ kintone-data-loader \
export \
--base-url https://${yourDomain} \
--username ${yourLoginName} \
--password ${yourPassword} \
--app ${kintoneAppId} \
> ${filepath}
```

#### Options

Some options use enviroment variables starting `KINTONE_` as default values.

```
Options:
  --version              Show version number                           [boolean]
  --help                 Show help                                     [boolean]
  --base-url             Kintone Base Url            [default: KINTONE_BASE_URL]
  --username, -u         Kintone Username            [default: KINTONE_USERNAME]
  --password, -p         Kintone Password            [default: KINTONE_PASSWORD]
  --api-token            App's API token            [default: KINTONE_API_TOKEN]
  --basic-auth-username  Kintone Basic Auth Username
                                          [default: KINTONE_BASIC_AUTH_USERNAME]
  --basic-auth-password  Kintone Basic Auth Password
                                          [default: KINTONE_BASIC_AUTH_PASSWORD]
  --app                  The ID of the app
  --guest-space-id       The ID of guest space [default: KINTONE_GUEST_SPACE_ID]
  --attachment-dir       Attachment file directory                      [string]
  --format               Output format. "json" or "csv"        [default: "json"]
  --query, -q            The query string
  --pfx-file-path        The path to client certificate file
  --pfx-file-password    The password of client certificate file
```

## LICENSE

- [MIT](https://github.com/kintone/js-sdk/blob/master/packages/data-loader/LICENSE)
