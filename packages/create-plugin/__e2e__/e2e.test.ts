import assert from "assert";
import { interactivePrompt, readManifestJson } from "./utils/helper";
import { CREATE_PLUGIN_COMMAND, DEFAULT_ANSWER } from "./utils/constants";
import path from "path";
import { generateWorkingDir, getWorkingDir } from "./utils/generateWorkingDir";
import fs from "fs";

describe("create-plugin", function () {
  it("Should able create plugin with specified output directory and required options successfully", async () => {
    const outputDir = "test1";
    const workingDir = generateWorkingDir();

    const ANSWER = [
      DEFAULT_ANSWER,
      DEFAULT_ANSWER,
      DEFAULT_ANSWER,
      DEFAULT_ANSWER,
      DEFAULT_ANSWER,
      DEFAULT_ANSWER,
      "No",
    ];
    const response = await interactivePrompt(
      CREATE_PLUGIN_COMMAND,
      workingDir,
      outputDir,
      ANSWER,
    );

    assert(response.status === 0, "Failed to create plugin");

    const pluginDir = path.resolve(workingDir, outputDir);
    assert.ok(fs.existsSync(pluginDir), "plugin dir is not created.");

    const manifestJson = readManifestJson(pluginDir);
    assert.deepEqual(manifestJson.name, { en: "test1" });
    assert.deepEqual(manifestJson.description, { en: "test1" });
  });
});
