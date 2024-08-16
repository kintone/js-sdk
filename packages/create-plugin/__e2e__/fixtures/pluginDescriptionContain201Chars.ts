import type { TestPattern } from "../e2e.test";
import { CREATE_PLUGIN_COMMAND } from "../utils/constants";
import { generateRandomString } from "../utils/helper";
import { getBoundMessage } from "../../src/messages";

const m = getBoundMessage("en");

export const pattern: TestPattern = {
  description:
    "#JsSdkTest-13 Should throw an error when creating plugin with plugin-in description contains 201 characters",
  input: {
    command: CREATE_PLUGIN_COMMAND,
    outputDir: "test13",
    questionsInput: [
      {
        question: m("Q_NameEn"),
        answer: "test13",
      },
      {
        question: m("Q_DescriptionEn"),
        answer: generateRandomString(201),
      },
    ],
  },
  expected: {
    validation: { stdout: "> Plug-in description must be 1-200chars" },
  },
};
