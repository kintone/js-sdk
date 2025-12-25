import osLocale from "os-locale";
import meow from "meow";
import type { Lang } from "./lang";
import { getDefaultLang } from "./lang";
import type { TemplateType } from "./template";
import { isValidTemplateType, SUPPORT_TEMPLATE_TYPE } from "./template";

const run = require("./index");

const cli = meow(
  `
  Usage
    $ create-kintone-plugin <directory>
  Options
    --lang Using language (en or ja)
    --template A template for a generated plug-in (${SUPPORT_TEMPLATE_TYPE.join(",")}): the default value is minimum)
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
  },
);

const directory = cli.input[0];
const { lang, template } = cli.flags;

if (!directory) {
  console.error("Please specify the output directory");
  cli.showHelp();
}

const isLang = (value: string): value is Lang => {
  return value === "ja" || value === "en";
};

if (!isLang(lang)) {
  console.error("--lang option only supports en or ja");
  cli.showHelp();
}

if (!isValidTemplateType(template)) {
  console.error(
    `--template option only supports ${SUPPORT_TEMPLATE_TYPE.join(",")}`,
  );
  cli.showHelp();
}

run(directory, lang as Lang, template as TemplateType);
