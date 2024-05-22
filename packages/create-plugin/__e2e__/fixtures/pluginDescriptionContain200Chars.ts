import type { TestPattern } from "../e2e.test";
import {
  ANSWER_NO,
  CREATE_PLUGIN_COMMAND,
  DEFAULT_ANSWER,
} from "../utils/constants";
import { getBoundMessage } from "../../src/messages";
import { generateRandomString } from "../utils/helper";

const m = getBoundMessage("en");
const pluginDescription = generateRandomString(200);

export const pattern: TestPattern = {
  description:
    "#JsSdkTest-3 Should able to create a plugin with plugin-in description contains 200 characters",
  input: {
    command: CREATE_PLUGIN_COMMAND,
    outputDir: "test3",
    questionsInput: [
      {
        question: m("Q_NameEn"),
        answer: "200characters",
      },
      {
        question: m("Q_DescriptionEn"),
        answer: pluginDescription,
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
        name: { en: "200characters" },
        description: { en: pluginDescription },
      },
    },
  },
};
