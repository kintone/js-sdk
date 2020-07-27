#!/usr/bin/env node

"use strict";

const osLocale = require("os-locale");
const meow = require("meow");
const run = require("../dist/src/index");
const { getDefaultLang } = require("../dist/src/lang");
const {
  isValidTemplateType,
  SUPPORT_TEMPLATE_TYPE,
} = require("../dist/src/template");

const cli = meow(
  `
  Usage
    $ create-kintone-plugin <directory>
  Options
    --lang Using language (en or ja)
    --template A template for a generated plug-in (${SUPPORT_TEMPLATE_TYPE.join(
      ","
    )}: the default value is minimum)
`,
  {
    flags: {
      lang: {
        type: "string",
        default: getDefaultLang(osLocale.sync()),
      },
      template: {
        type: "string",
        default: "minimum",
      },
    },
  }
);

const directory = cli.input[0];
const { lang, template } = cli.flags;

if (!directory) {
  console.error("Please specify the output directory");
  cli.showHelp();
}

if (lang !== "ja" && lang !== "en") {
  console.error("--lang option only supports en or ja");
  cli.showHelp();
}

if (!isValidTemplateType(template)) {
  console.error(
    `--template option only supports ${SUPPORT_TEMPLATE_TYPE.join(",")}`
  );
  cli.showHelp();
}

run(directory, lang, template);
