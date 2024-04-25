import assert from "assert";
import { executeCommandWithInteractiveInput } from "./utils/helper";
import { CREATE_PLUGIN_COMMAND, DEFAULT_ANSWER } from "./utils/constants";
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

  it("Should able to create a plugin with specified output directory and required options successfully", async () => {
    const outputDir = "test1";
    const ANSWER = [
      "test1-name",
      "test1-description",
      DEFAULT_ANSWER,
      DEFAULT_ANSWER,
      DEFAULT_ANSWER,
      "No",
      "No",
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

  afterEach(() => {
    rimrafSync(workingDir);
    console.log(`Working directory ${workingDir} has been removed`);
  });
});
