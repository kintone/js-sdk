import type { TestPattern } from "../e2e.test";
import { ANSWER_YES, CREATE_PLUGIN_COMMAND } from "../utils/constants";
import { getBoundMessage } from "../../src/messages";

const m = getBoundMessage("en");

export const pattern: TestPattern = {
  description:
    "#JsSdkTest-4 Should able to create a plugin with specified output directory and all options successfully",
  input: {
    command: CREATE_PLUGIN_COMMAND,
    outputDir: "test4",
    questionsInput: [
      {
        question: m("Q_NameEn"),
        answer: "test4-name",
      },
      {
        question: m("Q_DescriptionEn"),
        answer: "test4-description",
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
        answer: "test4-nombre",
      },
      {
        question: m("Q_DescriptionEs"),
        answer: "test4-descripción",
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
        answer: ANSWER_YES,
      },
      {
        question: m("Q_EnablePluginUploader"),
        answer: ANSWER_YES,
      },
    ],
  },
  expected: {
    success: {
      manifestJson: {
        name: {
          en: "test4-name",
          ja: "私のプラグイン",
          zh: "我的插件",
          es: "test4-nombre",
        },
        description: {
          en: "test4-description",
          ja: "私のプラグイン",
          zh: "我的插件",
          es: "test4-descripción",
        },
        homepage_url: {
          en: "https://github.com",
          ja: "https://github.jp",
          zh: "https://github.cn",
          es: "https://github.es",
        },
        mobile: {
          js: ["js/mobile.js"],
          css: ["css/mobile.css"],
        },
      },
    },
  },
};
