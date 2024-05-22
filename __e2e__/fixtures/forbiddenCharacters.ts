import type { TestPattern } from "../e2e.test";
import {
  ANSWER_NO,
  CREATE_PLUGIN_COMMAND,
  DEFAULT_ANSWER,
} from "../utils/constants";
import { getBoundMessage } from "../../src/messages";

const m = getBoundMessage("en");
let outputDir: string;
let expectedStderr: string;
const isWindows = process.platform === "win32";
if (isWindows) {
  outputDir = ":";
  expectedStderr = `Could not create a plug-in project. Error:\\nEINVAL: invalid argument, mkdir '.*:'`;
} else {
  outputDir = "/";
  expectedStderr = `Error: ${outputDir} already exists. Choose a different directory`;
}

export const pattern: TestPattern = {
  description:
    "#JsSdkTest-11 Should throw an error when the output directory contains forbidden characters",
  input: {
    command: CREATE_PLUGIN_COMMAND,
    outputDir: outputDir,
    questionsInput: [
      {
        question: m("Q_NameEn"),
        answer: "test11-name",
      },
      {
        question: m("Q_DescriptionEn"),
        answer: "test11-description",
      },
      {
        question: m("Q_SupportJa"),
        answer: DEFAULT_ANSWER,
      },
      {
        question: m("Q_SupportZh"),
        answer: DEFAULT_ANSWER,
      },
      {
        question: m("Q_SupportEs"),
        answer: DEFAULT_ANSWER,
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
    failure: {
      stderr: expectedStderr,
    },
  },
};
