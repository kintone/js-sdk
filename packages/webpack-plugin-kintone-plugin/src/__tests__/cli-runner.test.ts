import fs from "fs";
import os from "os";
import path from "path";
import { getPluginId, packPlugin } from "../cli-runner";
import {
  manifestJSONPath,
  privateKeyPath,
  expectedPluginId,
  createDummyJsFiles,
  cleanupJsFiles,
} from "./helpers";

describe("cli-runner", () => {
  describe("getPluginId", () => {
    let tempZipPath: string;

    beforeAll(async () => {
      createDummyJsFiles();
      tempZipPath = path.join(os.tmpdir(), `test-plugin-${Date.now()}.zip`);
      await packPlugin(manifestJSONPath, privateKeyPath, tempZipPath);
    });

    afterAll(() => {
      if (fs.existsSync(tempZipPath)) {
        fs.unlinkSync(tempZipPath);
      }
      cleanupJsFiles();
    });

    it("should return the plugin ID from a plugin zip file", async () => {
      const pluginId = await getPluginId(tempZipPath);
      expect(pluginId).toBe(expectedPluginId);
    });
  });
});
