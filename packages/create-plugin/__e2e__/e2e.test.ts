import assert from "assert";
import type { QuestionInput } from "./utils/CreatePlugin";
import type { PluginTemplate } from "./utils/verification";
import {
  CREATE_PLUGIN_COMMAND,
  DEFAULT_ANSWER,
  ANSWER_NO,
} from "./utils/constants";
import path from "path";
import { generateWorkingDir } from "./utils/helper";
import fs from "fs";
import { rimrafSync } from "rimraf";
import {
  assertObjectIncludes,
  readPluginManifestJson,
} from "./utils/verification";
import { getBoundMessage } from "../src/messages";
import { CreatePlugin } from "./utils/CreatePlugin";
import {
  requiredOptions,
  pluginNameContain64Chars,
  pluginDescriptionContain200Chars,
  allOptions,
  languageEN,
  languageJA,
  emptyOutputDir,
  pluginNameContain65Chars,
  pluginDescriptionContain201Chars,
  existOutputDir,
  createKintonePluginCommand,
  minimumTemplate,
  modernTemplate,
} from "./fixtures";

export type TestPattern = {
  description: string;
  prepareFn?: (...arg: any[]) => void;
  input: {
    command: string;
    outputDir: string;
    questionsInput: QuestionInput[];
    commandArgument?: string;
    template?: PluginTemplate;
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
    languageEN,
    languageJA,
    minimumTemplate,
    modernTemplate,
    emptyOutputDir,
    existOutputDir,
    pluginNameContain65Chars,
    pluginDescriptionContain201Chars,
    createKintonePluginCommand,
  ];

  it.each(patterns)("$description", async ({ prepareFn, input, expected }) => {
    if (prepareFn) {
      prepareFn({ workingDir });
    }

    const createPlugin = new CreatePlugin({
      command: input.command,
      workingDir,
      outputDir: input.outputDir,
      questionsInput: input.questionsInput,
      commandArguments: input.commandArgument,
    });
    const response = await createPlugin.executeCommand();

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
          response.stdout.trim(),
          new RegExp(expected.failure.stdout),
        );
      }

      if (expected.failure.stderr) {
        assert.match(
          response.stderr.trim(),
          new RegExp(expected.failure.stderr),
        );
      }
    }
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

    const createPlugin = new CreatePlugin({
      command: CREATE_PLUGIN_COMMAND,
      workingDir,
      outputDir,
      questionsInput,
    });
    const response = await createPlugin.executeCommand();

    if (isWindows) {
      assert.equal(response.status, 0);
      assert.match(
        response.stderr.trim(),
        /Could not create a plug-in project. Error:\nEINVAL: invalid argument, mkdir '.*:'/,
      );
    } else {
      assert.notEqual(response.status, 0);
      assert.match(
        response.stderr.trim(),
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
