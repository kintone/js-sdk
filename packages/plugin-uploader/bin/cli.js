#!/usr/bin/env node

"use strict";

const osLocale = require("os-locale");
const meow = require("meow");
const { run } = require("../dist/index");
const { inquireParams } = require("../dist/params");
const { getDefaultLang } = require("../dist/lang");
const { getMessage } = require("../dist/messages");

const {
  HTTP_PROXY,
  HTTPS_PROXY,
  KINTONE_DOMAIN,
  KINTONE_USERNAME,
  KINTONE_PASSWORD
} = process.env;

const cli = meow(
  `
  Usage
    $ kintone-plugin-uploader <pluginPath>
  Options
    --domain Domain of your kintone
    --username Login username
    --password User's password
    --proxy Proxy server
    --watch Watch the changes of plugin zip and re-run
    --waiting-dialog-ms A ms for waiting show a input dialog
    --lang Using language (en or ja)

    You can set the values through environment variables
    domain: KINTONE_DOMAIN
    username: KINTONE_USERNAME
    password: KINTONE_PASSWORD
    proxy: HTTPS_PROXY or HTTP_PROXY
`,
  {
    flags: {
      domain: {
        type: "string",
        default: KINTONE_DOMAIN
      },
      username: {
        type: "string",
        default: KINTONE_USERNAME
      },
      password: {
        type: "string",
        default: KINTONE_PASSWORD
      },
      proxy: {
        type: "string",
        default: HTTPS_PROXY || HTTP_PROXY
      },
      watch: {
        type: "boolean",
        default: false
      },
      waitingDialogMs: {
        type: "number",
        default: 0
      },
      lang: {
        type: "string",
        default: getDefaultLang(osLocale.sync())
      }
    }
  }
);

const pluginPath = cli.input[0];
const {
  username,
  password,
  domain,
  proxy,
  watch,
  waitingDialogMs,
  lang
} = cli.flags;
const options = proxy ? { watch, lang, proxyServer: proxy } : { watch, lang };

if (!pluginPath) {
  console.error(getMessage(lang, "Error_requiredZipPath"));
  cli.showHelp();
  process.exit(1);
}

const wait = ms => new Promise(r => setTimeout(r, ms));

wait(waitingDialogMs)
  .then(() => inquireParams({ username, password, domain, lang }))
  .then(({ username, password, domain }) =>
    run(domain, username, password, pluginPath, options)
  );
