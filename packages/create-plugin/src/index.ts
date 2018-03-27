'use strict';

import chalk from 'chalk';
import * as fs from 'fs';
import { Answers, Questions } from 'inquirer';
import { generatePlugin } from './generator';
import { printError, printLog } from './logger';
import { buildManifest, Manifest } from './manifest';
import { getBoundMessage, getMessage, Lang } from './messages';
import { buildQuestions, UserAnswers } from './qa';

const util = require('util');
const inquirer = require('inquirer');

/**
 * Verify whether the output directory is valid
 * @param outputDirectory
 */
function verifyOutputDirectory(
  outputDirectory: string,
  lang: Lang
): Promise<boolean> {
  if (fs.existsSync(outputDirectory)) {
    return Promise.reject(
      new Error(`${outputDirectory} ${getMessage(lang, 'Error_alreadyExists')}`)
    );
  }
  return Promise.resolve(true);
}

/**
 * Run create-kintone-plugin script
 * @param outputDir
 */
function run(outputDir: string, lang: Lang) {
  const m = getBoundMessage(lang);
  verifyOutputDirectory(outputDir, lang)
    .then(() => {
      printLog(`

${m('introduction')}

      `);
    })
    .then(() => inquirer.prompt(buildQuestions(outputDir, lang)))
    .then((answers: UserAnswers) => {
      const manifest = buildManifest(answers);
      generatePlugin(outputDir, manifest, lang);
      return manifest;
    })
    .then(manifest => {
      printLog(`

Success! Created ${manifest.name.en} at ${outputDir}

${chalk.cyan('npm start')}

  ${m('npmStart')}

${chalk.cyan('npm run build')}

  ${m('npmBuild')}

${chalk.cyan('npm run lint')}

  ${m('npmLint')}

${m('nextAction')}

  cd ${outputDir}
  npm start

${m('lastMessage')}

      `);
    })
    .catch(error => {
      printError(m('Error_cannotCreatePlugin'), error.message);
    });
}

module.exports = run;
module.exports.default = run;
