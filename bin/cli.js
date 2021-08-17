#!/usr/bin/env node

const osLocale = require("os-locale");
const meow = require("meow");
const { run, runInit, runImport } = require("../dist/commands");
const { inquireParams, inquireInitParams } = require("../dist/params");
const { getDefaultLang } = require("../dist/lang");
const { getMessage } = require("../dist/messages");

const {
  HTTP_PROXY,
  HTTPS_PROXY,
  KINTONE_BASE_URL,
  KINTONE_USERNAME,
  KINTONE_PASSWORD,
  KINTONE_OAUTH_TOKEN,
  KINTONE_BASIC_AUTH_USERNAME,
  KINTONE_BASIC_AUTH_PASSWORD,
} = process.env;

const cli = meow(
  `
  Usage
    $ kintone-customize-uploader <manifestFile>
  Options
    --base-url Base-url of your kintone
    --username Login username
    --password User's password
    --oauth-token OAuth access token (If you set a set of --username and --password, this value is not necessary.)
    --basic-auth-username Basic Authentication username
    --basic-auth-password Basic Authentication password
    --proxy Proxy server
    --watch Watch the changes of customize files and re-run
    --dest-dir -d option for subcommands
                  this option stands for output directory
                  default value is dest/
    --lang Using language (en or ja)
    --guest-space-id Guest space ID for uploading files

  SubCommands
    init   generate customize-manifest.json

    import download js/css files and update customize-manifest.json

    You can set the values through environment variables
    base-url: KINTONE_BASE_URL
    username: KINTONE_USERNAME
    password: KINTONE_PASSWORD
    oauth-token: KINTONE_OAUTH_TOKEN (If you set a set of username and password, this value is not necessary.)
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
      oauthToken: {
        type: "string",
        default: KINTONE_OAUTH_TOKEN || "",
      },
      basicAuthUsername: {
        type: "string",
        default: KINTONE_BASIC_AUTH_USERNAME || "",
      },
      basicAuthPassword: {
        type: "string",
        default: KINTONE_BASIC_AUTH_PASSWORD || "",
      },
      proxy: {
        type: "string",
        default: HTTPS_PROXY || HTTP_PROXY || "",
      },
      watch: {
        type: "boolean",
        default: false,
      },
      lang: {
        type: "string",
        default: getDefaultLang(osLocale.sync()),
      },
      guestSpaceId: {
        type: "number",
        default: 0,
      },
      // Optional option for subcommands
      destDir: {
        type: "string",
        default: "dest",
        alias: "d",
      },
    },
  }
);

const subCommands = ["init", "import"];
const hasSubCommand = subCommands.indexOf(cli.input[0]) >= 0;
const subCommand = hasSubCommand ? cli.input[0] : null;
const isInitCommand = subCommand === "init";
const isImportCommand = subCommand === "import";

const manifestFile = hasSubCommand ? cli.input[1] : cli.input[0];

const {
  username,
  password,
  basicAuthUsername,
  basicAuthPassword,
  oauthToken,
  baseUrl,
  proxy,
  watch,
  lang,
  guestSpaceId,
  destDir,
} = cli.flags;

const options = proxy ? { watch, lang, proxy } : { watch, lang };
if (guestSpaceId) {
  options.guestSpaceId = guestSpaceId;
}

if (subCommand) {
  options.destDir = destDir;
}

if (!isInitCommand && !manifestFile) {
  console.error(getMessage(lang, "E_requiredManifestFile"));
  cli.showHelp();
  process.exit(1);
}

if (isInitCommand) {
  inquireInitParams(lang)
    .then((initParams) => {
      runInit(initParams.appId, initParams.scope, lang, options.destDir);
    })
    .catch((error) => console.log(error.message));
} else {
  inquireParams({
    username,
    password,
    oAuthToken: oauthToken,
    baseUrl,
    lang,
  })
    .then((params) => {
      if (isImportCommand) {
        runImport(
          params.baseUrl,
          params.username,
          params.password,
          oauthToken,
          basicAuthUsername,
          basicAuthPassword,
          manifestFile,
          options
        );
      } else {
        run(
          params.baseUrl,
          params.username,
          params.password,
          oauthToken,
          basicAuthUsername,
          basicAuthPassword,
          manifestFile,
          options
        );
      }
    })
    .catch((error) => console.log(error.message));
}
