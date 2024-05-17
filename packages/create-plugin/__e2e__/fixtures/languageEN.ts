import type { TestPattern } from "../e2e.test";
import {
  ANSWER_NO,
  ANSWER_YES,
  CREATE_PLUGIN_COMMAND,
} from "../utils/constants";
import { getBoundMessage } from "../../src/messages";

const lang = "en";
const m = getBoundMessage(lang);

export const pattern: TestPattern = {
  description:
    "#JsSdkTest-5 Should able to create plugin with --lang argument (EN language)",
  input: {
    command: CREATE_PLUGIN_COMMAND,
    outputDir: "test5",
    commandArgument: `--lang ${lang}`,
    questionsInput: [
      {
        question: m("Q_NameEn"),
        answer: "test5-name",
      },
      {
        question: m("Q_DescriptionEn"),
        answer: "test5-description",
      },
      {
        question: m("Q_SupportJa"),
        answer: ANSWER_YES,
      },
      {
        question: m("Q_NameJa"),
        answer: "私のプラグイン",
      },
      {
        question: m("Q_DescriptionJa"),
        answer: "私のプラグイン",
      },
      {
        question: m("Q_SupportZh"),
        answer: ANSWER_YES,
      },
      {
        question: m("Q_NameZh"),
        answer: "我的插件",
      },
      {
        question: m("Q_DescriptionZh"),
        answer: "我的插件",
      },
      {
        question: m("Q_SupportEs"),
        answer: ANSWER_YES,
      },
      {
        question: m("Q_NameEs"),
        answer: "test5-nombre",
      },
      {
        question: m("Q_DescriptionEs"),
        answer: "test5-descripción",
      },
      {
        question: m("Q_WebsiteUrlEn"),
        answer: "https://github.com",
      },
      {
        question: m("Q_WebsiteUrlJa"),
        answer: "https://github.jp",
      },
      {
        question: m("Q_WebsiteUrlZh"),
        answer: "https://github.cn",
      },
      {
        question: m("Q_WebsiteUrlEs"),
        answer: "https://github.es",
      },
      {
        question: m("Q_MobileSupport"),
        answer: ANSWER_NO,
      },
      {
        question: m("Q_EnablePluginUploader"),
        answer: ANSWER_NO,
      },
    ],
  },
  expected: {
    success: {
      manifestJson: {
        name: {
          en: "test5-name",
          ja: "私のプラグイン",
          zh: "我的插件",
          es: "test5-nombre",
        },
        description: {
          en: "test5-description",
          ja: "私のプラグイン",
          zh: "我的插件",
          es: "test5-descripción",
        },
        homepage_url: {
          en: "https://github.com",
          ja: "https://github.jp",
          zh: "https://github.cn",
          es: "https://github.es",
        },
      },
    },
  },
};
