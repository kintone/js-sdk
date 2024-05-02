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

describe("create-plugin", function () {
  let workingDir: string;
  beforeEach(() => {
    workingDir = generateWorkingDir();
    console.log(`Working directory: ${workingDir}`);
  });

  it("#JsSdkTest-1 Should able to create a plugin with specified output directory and required options successfully", async () => {
    const m = getBoundMessage("en");
    const outputDir = "test1";
    const questionInput: QuestionInput[] = [
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
        question: m("Q_websiteUrlEn"),
        answer: DEFAULT_ANSWER,
      },
      {
        question: m("Q_MobileSupport"),
        answer: ANSWER_NO,
      },
      {
        question: m("Q_enablePluginUploader"),
        answer: ANSWER_NO,
      },
    ];

    const response = await executeCommandWithInteractiveInput(
      CREATE_PLUGIN_COMMAND,
      workingDir,
      outputDir,
      questionInput,
    );

    assert(response.status === 0, "Failed to create plugin");

    const pluginDir = path.resolve(workingDir, outputDir);
    assert.ok(fs.existsSync(pluginDir), "plugin dir is not created.");

    const actualManifestJson = readPluginManifestJson(pluginDir);
    const expectedManifestJson = {
      name: { en: "test1-name" },
      description: { en: "test1-description" },
    };
    assertObjectIncludes(actualManifestJson, expectedManifestJson);
  });

  afterEach(() => {
    rimrafSync(workingDir);
    console.log(`Working directory ${workingDir} has been removed`);
  });
});
