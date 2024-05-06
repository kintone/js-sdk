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
import { pattern as emptyOutputDir } from "./fixtures/emptyOutputDir";
import { pattern as pluginNameContain65Chars } from "./fixtures/pluginNameContain65Chars";
import { pattern as pluginDescriptionContain201Chars } from "./fixtures/pluginDescriptionContain201Chars";

export type TestPattern = {
  description: string;
  input: {
    command: string;
    outputDir: string;
    questionsInput: QuestionInput[];
    commandArgument?: string;
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
    emptyOutputDir,
    pluginNameContain65Chars,
    pluginDescriptionContain201Chars,
  ];

  it.each(patterns)("$description", async ({ input, expected }) => {
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

      const actualManifestJson = readPluginManifestJson(pluginDir);
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

  it("#JsSdkTest-10 Should throw an error when the output directory is duplicated with the existent directory", async () => {
    const outputDir = "created-folder";
    fs.mkdirSync(`${workingDir}/${outputDir}`);

    const response = await executeCommandWithInteractiveInput({
      command: CREATE_PLUGIN_COMMAND,
      workingDir,
      outputDir,
      questionsInput: [],
    });

    assert.notEqual(response.status, 0, "The command should throw an error.");
    const regex = new RegExp(
      `Error: ${outputDir} already exists. Choose a different directory`,
    );
    assert.match(response.stderr.toString().trim(), regex);
  });

  it("#JsSdkTest-11 Should throw an error when the output directory contains forbidden characters", async () => {
    const m = getBoundMessage("en");
    let outputDir: string;
    const isWindows = process.platform === "win32";
    if (isWindows) {
      outputDir = ":";
    } else {
      outputDir = "/";
    }

    const questionsInput: QuestionInput[] = [
      {
        question: m("Q_NameEn"),
        answer: "test1-name",
      },
      {
        question: m("Q_DescriptionEn"),
        answer: "test1-description",
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
    ];

    const response = await executeCommandWithInteractiveInput({
      command: CREATE_PLUGIN_COMMAND,
      workingDir,
      outputDir,
      questionsInput,
    });

    if (isWindows) {
      assert.equal(response.status, 0);
      assert.match(
        response.stderr.toString().trim(),
        /Could not create a plug-in project. Error:\nEINVAL: invalid argument, mkdir ':'/,
      );
    } else {
      assert.notEqual(response.status, 0);
      assert.match(
        response.stderr.toString().trim(),
        /Error: \/ already exists. Choose a different directory/,
      );
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
