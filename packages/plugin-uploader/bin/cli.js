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
  KINTONE_BASE_URL,
  KINTONE_USERNAME,
  KINTONE_PASSWORD,
  KINTONE_BASIC_AUTH_USERNAME,
  KINTONE_BASIC_AUTH_PASSWORD,
} = process.env;

const cli = meow(
  `
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
    --waiting-dialog-ms A ms for waiting show a input dialog
    --lang Using language (en or ja)

    You can set the values through environment variables
    base-url: KINTONE_BASE_URL
    username: KINTONE_USERNAME
    password: KINTONE_PASSWORD
    basic-auth-username: KINTONE_BASIC_AUTH_USERNAME
    basic-auth-password: KINTONE_BASIC_AUTH_PASSWORD
    proxy: HTTPS_PROXY or HTTP_PROXY
`,
  {
    flags: {
      baseUrl: {
        type: "string",
        default: KINTONE_BASE_URL || "",
      },
      username: {
        type: "string",
        default: KINTONE_USERNAME || "",
      },
      password: {
        type: "string",
        default: KINTONE_PASSWORD || "",
      },
      proxy: {
        type: "string",
        default: HTTPS_PROXY || HTTP_PROXY || "",
      },
      basicAuthUsername: {
        type: "string",
        default: KINTONE_BASIC_AUTH_USERNAME || "",
      },
      basicAuthPassword: {
        type: "string",
        default: KINTONE_BASIC_AUTH_PASSWORD || "",
      },
      watch: {
        type: "boolean",
        default: false,
      },
      waitingDialogMs: {
        type: "number",
        default: 0,
      },
      lang: {
        type: "string",
        default: getDefaultLang(osLocale.sync()),
      },
    },
  }
);

const pluginPath = cli.input[0];
const {
  username,
  password,
  baseUrl,
  proxy,
  basicAuthUsername,
  basicAuthPassword,
  watch,
  waitingDialogMs,
  lang,
} = cli.flags;

const basicAuth =
  basicAuthUsername !== "" && basicAuthPassword !== ""
    ? {
        username: basicAuthUsername,
        password: basicAuthPassword,
      }
    : null;
const options = {
  watch,
  lang,
  proxyServer: proxy !== "" ? proxy : null,
  basicAuth,
};

if (!pluginPath) {
  console.error(getMessage(lang, "Error_requiredZipPath"));
  cli.showHelp();
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

wait(waitingDialogMs)
  .then(() => inquireParams({ username, password, baseUrl, lang }))
  .then((answers) => {
    run(
      answers.baseUrl,
      answers.username,
      answers.password,
      pluginPath,
      options
    );
  });
