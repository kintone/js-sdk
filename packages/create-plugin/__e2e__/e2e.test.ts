import assert from "assert";
import { executeCommandWithInteractiveInput } from "./utils/helper";
import {
  CREATE_PLUGIN_COMMAND,
  DEFAULT_ANSWER,
  ANSWER_NO,
  ANSWER_YES,
} from "./utils/constants";
import path from "path";
import { generateWorkingDir } from "./utils/generateWorkingDir";
import fs from "fs";
import { rimrafSync } from "rimraf";
import {
  assertObjectIncludes,
  readPluginManifestJson,
} from "./utils/verification";

describe("create-plugin", function () {
  let workingDir: string;
  beforeEach(() => {
    workingDir = generateWorkingDir();
  });

  it.skip("Should able to create a plugin with specified output directory and required options successfully", async () => {
    const outputDir = "test1";
    const ANSWER = [
      "test1-name",
      "test1-description",
      DEFAULT_ANSWER,
      DEFAULT_ANSWER,
      DEFAULT_ANSWER,
      ANSWER_NO,
      ANSWER_NO,
    ];
    const response = await executeCommandWithInteractiveInput(
      CREATE_PLUGIN_COMMAND,
      workingDir,
      outputDir,
      ANSWER,
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

  it("Should able to create a plugin with specified output directory and all options successfully", async () => {
    const outputDir = "test1";
    const ANSWER = [
      "test4-name",
      "test1-description",
      ANSWER_YES,
      "私のプラグイン",
      "私のプラグイン",
      ANSWER_YES,
      "我的插件",
      "我的插件",
      "https://github.com",
      "https://github.jp",
      "https://github.cn",
      ANSWER_YES,
      ANSWER_YES,
    ];
    const response = await executeCommandWithInteractiveInput(
      CREATE_PLUGIN_COMMAND,
      workingDir,
      outputDir,
      ANSWER,
    );

    assert(response.status === 0, "Failed to create plugin");

    const pluginDir = path.resolve(workingDir, outputDir);
    assert.ok(fs.existsSync(pluginDir), "plugin dir is not created.");

    const actualManifestJson = readPluginManifestJson(pluginDir);
    const expectedManifestJson = {
      name: { en: "test4-name" },
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

  afterEach(() => {
    rimrafSync(workingDir);
    console.log(`Working directory ${workingDir} has been removed`);
  });
});
