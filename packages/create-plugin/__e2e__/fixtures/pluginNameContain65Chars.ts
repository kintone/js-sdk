import type { TestPattern } from "../e2e.test";
import { CREATE_PLUGIN_COMMAND } from "../utils/constants";
import { generateRandomString } from "../utils/helper";
import { getBoundMessage } from "../../src/messages";

const m = getBoundMessage("en");

export const pattern: TestPattern = {
  description:
    "#JsSdkTest-12 Should throw an error when creating plugin with plugin-in name contains 65 characters",
  input: {
    command: CREATE_PLUGIN_COMMAND,
    outputDir: "test12",
    questionsInput: [
      {
        question: m("Q_NameEn"),
        answer: generateRandomString(65),
      },
    ],
  },
  expected: {
    validation: { stdout: "> Plug-in name must be 1-64chars" },
  },
};
