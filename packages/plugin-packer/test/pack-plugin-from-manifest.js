"use strict";

const assert = require("assert");
const path = require("path");
const fs = require("fs");

const { readZipContentsNames } = require("./helper/zip");

const packer = require("../src/");
const packPluginFromManifest = require("../src/pack-plugin-from-manifest");
const createContentsZip = require("../src/create-contents-zip");

const fixturesDir = path.join(__dirname, "fixtures");
const ppkFilePath = path.join(fixturesDir, "private.ppk");
const pluginDir = path.join(fixturesDir, "sample-plugin", "plugin-dir");

describe("pack-plugin-from-manifest", () => {
  it("should be able to create a plugin from the manifest json path", done => {
    const manifestJSONPath = path.join(pluginDir, "manifest.json");
    const privateKey = fs.readFileSync(ppkFilePath, "utf-8");
    const manifest = JSON.parse(fs.readFileSync(manifestJSONPath, "utf-8"));
    Promise.all([
      packPluginFromManifest(manifestJSONPath, privateKey),
      createContentsZip(pluginDir, manifest).then(buffer =>
        packer(buffer, privateKey)
      )
    ]).then(([result1, result2]) => {
      assert(result1.id === result2.id);
      assert(result1.plugin.length === result2.plugin.length);
      assert(result1.privateKey === result2.privateKey);
      readZipContentsNames(result1.plugin).then(files => {
        assert.deepStrictEqual(files, ["contents.zip", "PUBKEY", "SIGNATURE"]);
        done();
      });
    });
  });
});
