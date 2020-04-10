"use strict";

const assert = require("assert");
const path = require("path");
const fs = require("fs");

const { readZipContentsNames } = require("./helper/zip");

const createContentsZip = require("../src/create-contents-zip");

const fixturesDir = path.join(__dirname, "fixtures");
const pluginDir = path.join(fixturesDir, "sample-plugin", "plugin-dir");

describe("create-contents-zip", () => {
  it("should be able to create buffer from a plugin directory", (done) => {
    const manifestJSONPath = path.join(pluginDir, "manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestJSONPath, "utf-8"));
    createContentsZip(pluginDir, manifest).then((buffer) => {
      readZipContentsNames(buffer).then((files) => {
        assert.deepStrictEqual(files, ["manifest.json", "image/icon.png"]);
        assert(buffer instanceof Buffer);
        done();
      });
    });
  });
});
