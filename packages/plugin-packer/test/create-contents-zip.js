"use strict";

const path = require("path");
const fs = require("fs");

const { readZipContentsNames } = require("./helper/zip");

const { createContentsZip } = require("../dist/create-contents-zip");

const fixturesDir = path.join(__dirname, "fixtures");
const pluginDir = path.join(fixturesDir, "sample-plugin", "plugin-dir");

describe("create-contents-zip", () => {
  it("should be able to create buffer from a plugin directory", (done) => {
    const manifestJSONPath = path.join(pluginDir, "manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestJSONPath, "utf-8"));
    createContentsZip(pluginDir, manifest).then((buffer) => {
      readZipContentsNames(buffer).then((files) => {
        expect(files).toStrictEqual(["manifest.json", "image/icon.png"]);
        expect(buffer).toBeInstanceOf(Buffer);
        done();
      });
    });
  });
});
