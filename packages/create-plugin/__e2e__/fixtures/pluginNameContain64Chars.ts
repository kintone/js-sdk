import type { TestPattern } from "../e2e.test";
import {
  ANSWER_NO,
  CREATE_PLUGIN_COMMAND,
  DEFAULT_ANSWER,
} from "../utils/constants";
import { getBoundMessage } from "../../src/messages";
import { generateRandomString } from "../utils/helper";

const m = getBoundMessage("en");
const pluginName = generateRandomString(64);

export const pattern: TestPattern = {
  description:
    "#JsSdkTest-2 Should able to create a plugin with plugin-in name contains 64 characters",
  input: {
    command: CREATE_PLUGIN_COMMAND,
    outputDir: "test2",
    questionsInput: [
      {
        question: m("Q_NameEn"),
        answer: pluginName,
      },
      {
        question: m("Q_DescriptionEn"),
        answer: "64characters",
      },
      {
        question: m("Q_SupportJa"),
        answer: ANSWER_NO,
      },
      {
        question: m("Q_SupportZh"),
        answer: ANSWER_NO,
      },
      {
        question: m("Q_SupportEs"),
        answer: ANSWER_NO,
      },
      {
        question: m("Q_WebsiteUrlEn"),
        answer: DEFAULT_ANSWER,
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
        name: { en: pluginName },
        description: { en: "64characters" },
      },
    },
  },
};
