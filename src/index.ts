"use strict";

import chalk from "chalk";
import * as fs from "fs";
import { Answers, Questions } from "inquirer";
import * as rimraf from "rimraf";
import { generatePlugin } from "./generator";
import { Lang } from "./lang";
import { printError, printLog } from "./logger";
import { buildManifest, Manifest } from "./manifest";
import { getBoundMessage, getMessage } from "./messages";
import { buildQuestions, UserAnswers } from "./qa";

const util = require("util");
const inquirer = require("inquirer");

/**
 * Verify whether the output directory is valid
 * @param outputDirectory
 */
function verifyOutputDirectory(outputDirectory: string, lang: Lang): void {
  if (fs.existsSync(outputDirectory)) {
    console.error(
      `${outputDirectory} ${getMessage(lang, "Error_alreadyExists")}`
    );
    process.exit(1);
  }
}

/**
 * Run create-kintone-plugin script
 * @param outputDir
 */
function run(outputDir: string, lang: Lang) {
  const m = getBoundMessage(lang);
  verifyOutputDirectory(outputDir, lang);
  printLog(`

  ${m("introduction")}

  `);

  inquirer
    .prompt(buildQuestions(outputDir, lang))
    .then((answers: UserAnswers) => {
      const manifest = buildManifest(answers);
      generatePlugin(outputDir, manifest, lang, answers.pluginUploader);
      return [manifest, answers.pluginUploader];
    })
    .then(([manifest, enablePluginUploader]: [Manifest, boolean]) => {
      printLog(`

Success! Created ${manifest.name.en} at ${outputDir}

${chalk.cyan("npm start")}

  ${m("npmStart")}
  ${enablePluginUploader ? m("npmStartWithPluginUploader") : ""}

${chalk.cyan("npm run build")}

  ${m("npmBuild")}

${chalk.cyan("npm run lint")}

  ${m("npmLint")}

${m("nextAction")}
${enablePluginUploader ? m("howToUsePluginUploader") : ""}

  cd ${outputDir}
  npm start

${m("lastMessage")}
${m("developerSite")}

      `);
    })
    .catch((error: Error) => {
      rimraf(outputDir, () => {
        printError(m("Error_cannotCreatePlugin"), error.message);
      });
    });
}

module.exports = run;
module.exports.default = run;
