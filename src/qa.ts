"use strict";

import type { Answers, Question } from "inquirer";
import type { Lang } from "./lang";
import { getBoundMessage } from "./messages";

const NAME_MAX_LENGTH = 64;
const DESCRIPTION_MAX_LENGTH = 200;

/**
 * Build questions for creating a kintone plugin project
 * @param outputDir
 * @param lang
 */
export const buildQuestions = (outputDir: string, lang: Lang): Question[] => {
  const m = getBoundMessage(lang);
  return [
    {
      type: "input",
      name: "name.en",
      message: m("Q_NameEn"),
      default: outputDir.replace(/.*\//, ""),
      validate: (value) =>
        value.length > 0 && value.length <= NAME_MAX_LENGTH
          ? true
          : m("Q_NameEnError"),
    },
    {
      type: "input",
      name: "description.en",
      message: m("Q_DescriptionEn"),
      default: (answers: Answers) => answers.name.en,
      validate: (value) =>
        value.length > 0 && value.length <= DESCRIPTION_MAX_LENGTH
          ? true
          : m("Q_DescriptionEnError"),
    },
    {
      type: "confirm",
      name: "ja",
      default: lang === "ja",
      message: m("Q_SupportJa"),
    },
    {
      type: "input",
      name: "name.ja",
      when: (answers) => answers.ja,
      message: m("Q_NameJa"),
      validate: (value) =>
        value.length === 0 || value.length <= NAME_MAX_LENGTH
          ? true
          : m("Q_NameJaError"),
    },
    {
      type: "input",
      name: "description.ja",
      when: (answers) => answers.ja,
      message: m("Q_DescriptionJa"),
      validate: (value) =>
        value.length === 0 || value.length <= DESCRIPTION_MAX_LENGTH
          ? true
          : m("Q_DescriptionJaError"),
    },
    {
      type: "confirm",
      name: "zh",
      default: false,
      message: m("Q_SupportZh"),
    },
    {
      type: "input",
      name: "name.zh",
      when: (answers) => answers.zh,
      message: m("Q_NameZh"),
      validate: (value) =>
        value.length === 0 || value.length <= NAME_MAX_LENGTH
          ? true
          : m("Q_NameZhError"),
    },
    {
      type: "input",
      name: "description.zh",
      when: (answers) => answers.zh,
      message: m("Q_DescriptionZh"),
      validate: (value) =>
        value.length === 0 || value.length <= DESCRIPTION_MAX_LENGTH
          ? true
          : m("Q_DescriptionZhError"),
    },
    {
      type: "confirm",
      name: "es",
      default: false,
      message: m("Q_SupportEs"),
    },
    {
      type: "input",
      name: "name.es",
      when: (answers) => answers.es,
      message: m("Q_NameEs"),
      validate: (value) =>
        value.length === 0 || value.length <= NAME_MAX_LENGTH
          ? true
          : m("Q_NameEsError"),
    },
    {
      type: "input",
      name: "description.es",
      when: (answers) => answers.es,
      message: m("Q_DescriptionEs"),
      validate: (value) =>
        value.length === 0 || value.length <= DESCRIPTION_MAX_LENGTH
          ? true
          : m("Q_DescriptionEsError"),
    },
    {
      type: "input",
      name: "homepage_url.en",
      message: m("Q_WebsiteUrlEn"),
    },
    {
      type: "input",
      name: "homepage_url.ja",
      when: (answers) => answers.ja,
      message: m("Q_WebsiteUrlJa"),
    },
    {
      type: "input",
      name: "homepage_url.zh",
      when: (answers) => answers.zh,
      message: m("Q_WebsiteUrlZh"),
    },
    {
      type: "input",
      name: "homepage_url.es",
      when: (answers) => answers.es,
      message: m("Q_WebsiteUrlEs"),
    },
    {
      type: "confirm",
      name: "mobile",
      default: true,
      message: m("Q_MobileSupport"),
    },
    {
      type: "confirm",
      name: "pluginUploader",
      default: true,
      message: m("Q_EnablePluginUploader"),
    },
  ];
};
