import assert from "assert";
import type { QuestionInput } from "./utils/executeCommand";
import { executeCommandWithInteractiveInput } from "./utils/executeCommand";
import {
  CREATE_PLUGIN_COMMAND,
  DEFAULT_ANSWER,
  ANSWER_NO,
} from "./utils/constants";
import path from "path";
import { generateWorkingDir } from "./utils/generateWorkingDir";
import fs from "fs";
import { rimrafSync } from "rimraf";
import {
  assertObjectIncludes,
  readPluginManifestJson,
} from "./utils/verification";
import { getBoundMessage } from "../src/messages";
import { pattern as requiredOptions } from "./fixtures/requiredOptions";
import { pattern as pluginNameContain64Chars } from "./fixtures/pluginNameContain64Chars";
import { pattern as pluginDescriptionContain200Chars } from "./fixtures/pluginDescriptionContain200Chars";
import { pattern as allOptions } from "./fixtures/allOptions";
import { pattern as emptyOutputDir } from "./fixtures/emptyOutputDir";
import { pattern as pluginNameContain65Chars } from "./fixtures/pluginNameContain65Chars";
import { pattern as pluginDescriptionContain201Chars } from "./fixtures/pluginDescriptionContain201Chars";
import { pattern as existOutputDir } from "./fixtures/existOutputDir";
import { pattern as forbiddenCharacters } from "./fixtures/forbiddenCharacters";
import { pattern as createKintonePluginCommand } from "./fixtures/createKintonePluginCommand";

export type TestPattern = {
  description: string;
  prepareFn?: (...arg: any[]) => void;
  input: {
    command: string;
    outputDir: string;
    questionsInput: QuestionInput[];
    commandArgument?: string;
    template?: "minimum" | "modern";
  };
  expected: {
    success?: {
      manifestJson: { [key: PropertyKey]: unknown };
    };
    failure?: {
      stdout?: string;
      stderr?: string;
    };
  };
};

describe("create-plugin", function () {
  let workingDir: string;
  beforeEach(() => {
    workingDir = generateWorkingDir();
    console.log(`Working directory: ${workingDir}`);
  });

  const patterns = [
    requiredOptions,
    pluginNameContain64Chars,
    pluginDescriptionContain200Chars,
    allOptions,
    emptyOutputDir,
    existOutputDir,
    pluginNameContain65Chars,
    pluginDescriptionContain201Chars,
    forbiddenCharacters,
    createKintonePluginCommand,
  ];

  it.each(patterns)("$description", async ({ prepareFn, input, expected }) => {
    if (prepareFn) {
      prepareFn({ workingDir });
    }

    const response = await executeCommandWithInteractiveInput({
      command: input.command,
      workingDir,
      outputDir: input.outputDir,
      questionsInput: input.questionsInput,
      commandArguments: input.commandArgument,
    });

    if (expected.success !== undefined) {
      assert(response.status === 0, "Failed to create plugin");

      const pluginDir = path.resolve(workingDir, input.outputDir);
      assert.ok(fs.existsSync(pluginDir), "plugin dir is not created.");

      const actualManifestJson = readPluginManifestJson(
        pluginDir,
        input.template,
      );
      assertObjectIncludes(actualManifestJson, expected.success.manifestJson);
    }

    if (expected.failure !== undefined) {
      assert.notEqual(response.status, 0, "The command should throw an error.");
      if (expected.failure.stdout) {
        assert.match(
          response.stdout.toString().trim(),
          new RegExp(expected.failure.stdout),
        );
      }

      if (expected.failure.stderr) {
        assert.match(
          response.stderr.toString().trim(),
          new RegExp(expected.failure.stderr),
        );
      }
    }
  });

  afterEach(() => {
    const testName = expect.getState().currentTestName;
    if (!testName || !workingDir) {
      return;
    }

    // @ts-ignore
    const match = Object.keys(globalThis.testStatuses).find((item: string) =>
      testName.includes(item),
    );

    // @ts-ignore
    if (match && globalThis.testStatuses[match] === "passed") {
      rimrafSync(workingDir);
      console.log(`Working directory ${workingDir} has been removed`);
    }
  });
});
