import osLocale from "os-locale";
import meow from "meow";

import { inquireParams } from "./params";
import { getDefaultLang, Lang } from "./lang";
import { getMessage } from "./messages";
import { run } from "./index";

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
    --puppeteer-ignore-default-args Ignore default arguments of puppeteer

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
      puppeteerIgnoreDefaultArgs: {
        type: "string",
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
  puppeteerIgnoreDefaultArgs,
} = cli.flags;

const isLang = (_lang: string): _lang is Lang => {
  return ["ja", "en"].includes(_lang);
};

if (!isLang(lang)) {
  throw new Error(
    getMessage(getDefaultLang(osLocale.sync()), "Error_invalidLang")
  );
}

const basicAuth =
  basicAuthUsername !== "" && basicAuthPassword !== ""
    ? {
        username: basicAuthUsername,
        password: basicAuthPassword,
      }
    : undefined;
const options = {
  watch,
  lang,
  proxyServer: proxy !== "" ? proxy : undefined,
  basicAuth,
  puppeteerIgnoreDefaultArgs: puppeteerIgnoreDefaultArgs?.split(" "),
};

if (!pluginPath) {
  console.error(getMessage(lang, "Error_requiredZipPath"));
  cli.showHelp();
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

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
