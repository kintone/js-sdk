import path from "path";
import fs from "fs";
import { readZipContentsNames } from "./helper/zip";
import packer from "../src";
import { packPluginFromManifest } from "../dist/pack-plugin-from-manifest";
import { createContentsZip } from "../dist/create-contents-zip";

const fixturesDir = path.join(__dirname, "fixtures");
const ppkFilePath = path.join(fixturesDir, "private.ppk");
const pluginDir = path.join(fixturesDir, "sample-plugin", "plugin-dir");

describe("pack-plugin-from-manifest", () => {
  it("should be able to create a plugin from the manifest json path", (done) => {
    const manifestJSONPath = path.join(pluginDir, "manifest.json");
    const privateKey = fs.readFileSync(ppkFilePath, "utf-8");
    const manifest = JSON.parse(fs.readFileSync(manifestJSONPath, "utf-8"));
    Promise.all([
      packPluginFromManifest(manifestJSONPath, privateKey),
      createContentsZip(pluginDir, manifest).then((buffer) =>
        packer(buffer as any, privateKey)
      ),
    ]).then(([result1, result2]) => {
      expect(result1.id).toBe(result2.id);
      expect(result1.plugin.length).toBe(result2.plugin.length);
      expect(result1.privateKey).toBe(result2.privateKey);
      readZipContentsNames(result1.plugin).then((files) => {
        expect(files).toStrictEqual(["contents.zip", "PUBKEY", "SIGNATURE"]);
        done();
      });
    });
  });
});
