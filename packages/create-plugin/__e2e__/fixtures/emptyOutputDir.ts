import type { TestPattern } from "../e2e.test";
import { CREATE_PLUGIN_COMMAND } from "../utils/constants";

export const pattern: TestPattern = {
  description:
    "#JsSdkTest-9 Should throw an error when the output directory is empty",
  input: {
    command: CREATE_PLUGIN_COMMAND,
    outputDir: "",
    questionsInput: [],
  },
  expected: {
    failure: { stderr: "Please specify the output directory" },
  },
};
