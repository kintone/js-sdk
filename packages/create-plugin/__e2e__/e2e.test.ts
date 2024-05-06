import assert from "assert";
import type { QuestionInput } from "./utils/executeCommand";
import { executeCommandWithInteractiveInput } from "./utils/executeCommand";
import {
  CREATE_PLUGIN_COMMAND,
  DEFAULT_ANSWER,
  ANSWER_NO,
  ANSWER_YES,
  CREATE_KINTONE_PLUGIN_COMMAND,
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
import { generateRandomString } from "./utils/helper";

describe("create-plugin", function () {
  let workingDir: string;
  beforeEach(() => {
    workingDir = generateWorkingDir();
    console.log(`Working directory: ${workingDir}`);
  });

  it("#JsSdkTest-1 Should able to create a plugin with specified output directory and required options successfully", async () => {
    const m = getBoundMessage("en");
    const outputDir = "test1";
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

  it("#JsSdkTest-2 Should able to create a plugin with plugin-in name contains 64 characters", async () => {
    const m = getBoundMessage("en");
    const outputDir = "test2";
    const pluginName = generateRandomString(64);
    const questionsInput: QuestionInput[] = [
      {
        question: m("Q_NameEn"),
        answer: pluginName,
      },
      {
        question: m("Q_DescriptionEn"),
        answer: "64characters",
      },
      {
        question: m("Q_SupportJa"),
        answer: ANSWER_NO,
      },
      {
        question: m("Q_SupportZh"),
        answer: ANSWER_NO,
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

    assert(response.status === 0, "Failed to create plugin");

    const pluginDir = path.resolve(workingDir, outputDir);
    assert.ok(fs.existsSync(pluginDir), "plugin dir is not created.");

    const actualManifestJson = readPluginManifestJson(pluginDir);
    const expectedManifestJson = {
      name: { en: pluginName },
      description: { en: "64characters" },
    };
    assertObjectIncludes(actualManifestJson, expectedManifestJson);
  });

  it("#JsSdkTest-3 Should able to create a plugin with plugin-in description contains 200 characters", async () => {
    const m = getBoundMessage("en");
    const outputDir = "test3";
    const pluginDescription = generateRandomString(200);
    const questionsInput: QuestionInput[] = [
      {
        question: m("Q_NameEn"),
        answer: "200characters",
      },
      {
        question: m("Q_DescriptionEn"),
        answer: pluginDescription,
      },
      {
        question: m("Q_SupportJa"),
        answer: ANSWER_NO,
      },
      {
        question: m("Q_SupportZh"),
        answer: ANSWER_NO,
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

    assert(response.status === 0, "Failed to create plugin");

    const pluginDir = path.resolve(workingDir, outputDir);
    assert.ok(fs.existsSync(pluginDir), "plugin dir is not created.");

    const actualManifestJson = readPluginManifestJson(pluginDir);
    const expectedManifestJson = {
      name: { en: "200characters" },
      description: { en: pluginDescription },
    };
    assertObjectIncludes(actualManifestJson, expectedManifestJson);
  });

  it("#JsSdkTest-4 Should able to create a plugin with specified output directory and all options successfully", async () => {
    const m = getBoundMessage("en");
    const outputDir = "test1";
    const questionsInput: QuestionInput[] = [
      {
        question: m("Q_NameEn"),
        answer: "test4-name",
      },
      {
        question: m("Q_DescriptionEn"),
        answer: "test4-description",
      },
      {
        question: m("Q_SupportJa"),
        answer: ANSWER_YES,
      },
      {
        question: m("Q_NameJa"),
        answer: "私のプラグイン",
      },
      {
        question: m("Q_DescriptionJa"),
        answer: "私のプラグイン",
      },
      {
        question: m("Q_SupportZh"),
        answer: ANSWER_YES,
      },
      {
        question: m("Q_NameZh"),
        answer: "我的插件",
      },
      {
        question: m("Q_DescriptionZh"),
        answer: "我的插件",
      },
      {
        question: m("Q_WebsiteUrlEn"),
        answer: "https://github.com",
      },
      {
        question: m("Q_WebsiteUrlJa"),
        answer: "https://github.jp",
      },
      {
        question: m("Q_WebsiteUrlZh"),
        answer: "https://github.cn",
      },
      {
        question: m("Q_MobileSupport"),
        answer: ANSWER_YES,
      },
      {
        question: m("Q_EnablePluginUploader"),
        answer: ANSWER_YES,
      },
    ];

    const response = await executeCommandWithInteractiveInput({
      command: CREATE_PLUGIN_COMMAND,
      workingDir,
      outputDir,
      questionsInput,
    });

    assert(response.status === 0, "Failed to create plugin");

    const pluginDir = path.resolve(workingDir, outputDir);
    assert.ok(fs.existsSync(pluginDir), "plugin dir is not created.");

    const actualManifestJson = readPluginManifestJson(pluginDir);
    const expectedManifestJson = {
      name: {
        en: "test4-name",
        ja: "私のプラグイン",
        zh: "我的插件",
      },
      description: {
        en: "test4-description",
        ja: "私のプラグイン",
        zh: "我的插件",
      },
      homepage_url: {
        en: "https://github.com",
        ja: "https://github.jp",
        zh: "https://github.cn",
      },
      mobile: {
        js: ["js/mobile.js"],
        css: ["css/mobile.css"],
      },
    };
    assertObjectIncludes(actualManifestJson, expectedManifestJson);
  });

  it("#JsSdkTest-9 Should throw an error when the output directory is empty", async () => {
    const outputDir = "";
    const response = await executeCommandWithInteractiveInput({
      command: CREATE_PLUGIN_COMMAND,
      workingDir,
      outputDir,
      questionsInput: [],
    });

    assert.notEqual(response.status, 0, "The command should throw an error.");
    assert.equal(
      response.stderr.toString().trim(),
      "Please specify the output directory",
    );
  });

  it("#JsSdkTest-14 Should able to create plugin with `create-kintone-plugin` command and all options", async () => {
    const m = getBoundMessage("en");
    const outputDir = "test14";
    const questionsInput: QuestionInput[] = [
      {
        question: m("Q_NameEn"),
        answer: "test14-name",
      },
      {
        question: m("Q_DescriptionEn"),
        answer: "test14-description",
      },
      {
        question: m("Q_SupportJa"),
        answer: ANSWER_YES,
      },
      {
        question: m("Q_NameJa"),
        answer: "私のプラグイン",
      },
      {
        question: m("Q_DescriptionJa"),
        answer: "私のプラグイン",
      },
      {
        question: m("Q_SupportZh"),
        answer: ANSWER_YES,
      },
      {
        question: m("Q_NameZh"),
        answer: "我的插件",
      },
      {
        question: m("Q_DescriptionZh"),
        answer: "我的插件",
      },
      {
        question: m("Q_WebsiteUrlEn"),
        answer: "https://github.com",
      },
      {
        question: m("Q_WebsiteUrlJa"),
        answer: "https://github.jp",
      },
      {
        question: m("Q_WebsiteUrlZh"),
        answer: "https://github.cn",
      },
      {
        question: m("Q_MobileSupport"),
        answer: ANSWER_YES,
      },
      {
        question: m("Q_EnablePluginUploader"),
        answer: ANSWER_YES,
      },
    ];

    const response = await executeCommandWithInteractiveInput({
      command: CREATE_PLUGIN_COMMAND,
      workingDir,
      outputDir,
      questionsInput,
    });

    assert(response.status === 0, "Failed to create plugin");

    const pluginDir = path.resolve(workingDir, outputDir);
    assert.ok(fs.existsSync(pluginDir), "plugin dir is not created.");

    const actualManifestJson = readPluginManifestJson(pluginDir);
    const expectedManifestJson = {
      name: {
        en: "test14-name",
        ja: "私のプラグイン",
        zh: "我的插件",
      },
      description: {
        en: "test14-description",
        ja: "私のプラグイン",
        zh: "我的插件",
      },
      homepage_url: {
        en: "https://github.com",
        ja: "https://github.jp",
        zh: "https://github.cn",
      },
      mobile: {
        js: ["js/mobile.js"],
        css: ["css/mobile.css"],
      },
    };
    assertObjectIncludes(actualManifestJson, expectedManifestJson);
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
