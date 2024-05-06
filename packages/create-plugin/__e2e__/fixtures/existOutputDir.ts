import type { TestPattern } from "../e2e.test";
import { CREATE_PLUGIN_COMMAND } from "../utils/constants";
import fs from "fs";

const outputDir = "test10";
export const pattern: TestPattern = {
  description:
    "#JsSdkTest-10 Should throw an error when the output directory is duplicated with the existent directory",
  prepareFn: (settings: { workingDir: string }) => {
    fs.mkdirSync(`${settings.workingDir}/${outputDir}`);
  },
  input: {
    command: CREATE_PLUGIN_COMMAND,
    outputDir: outputDir,
    questionsInput: [],
  },
  expected: {
    failure: {
      stderr: `Error: ${outputDir} already exists. Choose a different directory`,
    },
  },
};
