import assert from "assert";
import type { QuestionInput } from "./utils/CreatePlugin";
import type { PluginTemplate } from "./utils/verification";
import path from "path";
import { generateWorkingDir } from "./utils/helper";
import fs from "fs";
import { rimrafSync } from "rimraf";
import {
  assertObjectIncludes,
  readPluginManifestJson,
} from "./utils/verification";
import { CreatePlugin } from "./utils/CreatePlugin";
import {
  requiredOptions,
  pluginNameContain64Chars,
  pluginDescriptionContain200Chars,
  allOptions,
  languageEN,
  languageJA,
  emptyOutputDir,
  existOutputDir,
  forbiddenCharacters,
  pluginNameContain65Chars,
  pluginDescriptionContain201Chars,
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
    validation?: {
      stdout?: string;
    }
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
    forbiddenCharacters,
    pluginNameContain65Chars,
    pluginDescriptionContain201Chars,
    createKintonePluginCommand,
  ];

  let createPlugin: CreatePlugin;

  it.each(patterns)("$description", async ({ prepareFn, input, expected }) => {
    if (prepareFn) {
      prepareFn({ workingDir });
    }

    try {
      createPlugin = new CreatePlugin({
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
        assert.notEqual(
          response.status,
          0,
          "The command should throw an error.",
        );
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

      if (expected.validation !== undefined) {
        if (expected.validation.stdout) {
          assert.match(
            response.stdout.trim(),
            new RegExp(expected.validation.stdout),
          );
        }
      }
    } catch (e: any) {
      assert.fail(e);
    }
  });

  afterEach(async () => {
    await createPlugin?.teardownProcess();
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
