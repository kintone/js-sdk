"use strict";

import { Answers, Question } from "inquirer";
import { Lang } from "./lang";
import { Manifest } from "./manifest";
import { getBoundMessage } from "./messages";

export type UserAnswers = Manifest & {
  ja: boolean;
  cn: boolean;
  mobile?: boolean;
  config?: boolean;
  pluginUploader: boolean;
};

const NAME_MAX_LENGTH = 64;
const DESCRIPTION_MAX_LENGTH = 200;

/**
 * Build questions for creating a kintone plugin project
 * @param outputDir
 */
export function buildQuestions(outputDir: string, lang: Lang): Question[] {
  const m = getBoundMessage(lang);
  return [
    {
      type: "input",
      name: "name.en",
      message: m("Q_NameEn"),
      default: outputDir.replace(/.*\//, ""),
      validate: value =>
        value.length > 0 && value.length <= NAME_MAX_LENGTH
          ? true
          : m("Q_NameEnError")
    },
    {
      type: "input",
      name: "description.en",
      message: m("Q_DescriptionEn"),
      default: (answers: Answers) => answers.name.en,
      validate: value =>
        value.length > 0 && value.length <= DESCRIPTION_MAX_LENGTH
          ? true
          : m("Q_DescriptionEnError")
    },
    {
      type: "confirm",
      name: "ja",
      default: lang === "ja" ? true : false,
      message: m("Q_SupportJa")
    },
    {
      type: "input",
      name: "name.ja",
      when: answers => answers.ja,
      message: m("Q_NameJa"),
      validate: value =>
        value.length === 0 || value.length <= NAME_MAX_LENGTH
          ? true
          : m("Q_NameJaError")
    },
    {
      type: "input",
      name: "description.ja",
      when: answers => answers.ja,
      message: m("Q_DescriptionJa"),
      validate: value =>
        value.length === 0 || value.length <= DESCRIPTION_MAX_LENGTH
          ? true
          : m("Q_DescriptionJaError")
    },
    {
      type: "confirm",
      name: "cn",
      default: false,
      message: m("Q_SupportCn")
    },
    {
      type: "input",
      name: "name.cn",
      when: answers => answers.cn,
      message: m("Q_NameCn"),
      validate: value =>
        value.length === 0 || value.length <= NAME_MAX_LENGTH
          ? true
          : m("Q_NameCnError")
    },
    {
      type: "input",
      name: "description.cn",
      when: answers => answers.cn,
      message: m("Q_DescriptionCn"),
      validate: value =>
        value.length === 0 || value.length <= DESCRIPTION_MAX_LENGTH
          ? true
          : m("Q_DescriptionCnError")
    },
    {
      type: "input",
      name: "homepage_url.en",
      message: m("Q_websiteUrlEn")
    },
    {
      type: "input",
      name: "homepage_url.ja",
      when: answers => answers.ja,
      message: m("Q_websiteUrlJa")
    },
    {
      type: "input",
      name: "homepage_url.cn",
      when: answers => answers.cn,
      message: m("Q_websiteUrlCn")
    },
    {
      type: "confirm",
      name: "mobile",
      default: false,
      message: m("Q_MobileSupport")
    },
    {
      type: "confirm",
      name: "pluginUploader",
      default: true,
      message: m("Q_enablePluginUploader")
    }
  ];
}
