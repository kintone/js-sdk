import path from "path";
import fs from "fs";
import { readZipContentsNames } from "./helper/zip";
import { createContentsZip } from "../src/create-contents-zip";

const fixturesDir = path.join(__dirname, "fixtures");
const pluginDir = path.join(fixturesDir, "sample-plugin", "plugin-dir");

describe("create-contents-zip", () => {
  it("should be able to create buffer from a plugin directory", (done) => {
    const manifestJSONPath = path.join(pluginDir, "manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestJSONPath, "utf-8"));
    createContentsZip(pluginDir, manifest).then((buffer) => {
      readZipContentsNames(buffer as Buffer).then((files) => {
        expect(files).toStrictEqual(["manifest.json", "image/icon.png"]);
        expect(buffer).toBeInstanceOf(Buffer);
        done();
      });
    });
  });
});
