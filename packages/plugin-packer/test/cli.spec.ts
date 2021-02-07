"use strict";

import fs from "fs";
import path from "path";
import { promisify } from "util";
import _rimraf from "rimraf";
import glob from "glob";
import { readZipContentsNames } from "./helper/zip";
import cli from "../src/cli";
import console from "../src/console";

const rimraf = promisify(_rimraf);

const fixturesDir = path.join(__dirname, "fixtures");
const sampleDir = path.join(fixturesDir, "sample-plugin");
const ppkPath = path.join(fixturesDir, "private.ppk");

const ID = "aaa";
const PRIVATE_KEY = "PRIVATE_KEY";
const PLUGIN_BUFFER = Buffer.from("foo");

describe("cli", () => {
  const consoleLog = console.log;
  const consoleError = console.error;
  beforeEach(() => {
    /* eslint-disable @typescript-eslint/no-empty-function -- This is mock functions */
    console.log = () => {};
    console.error = () => {};
    /* eslint-enable @typescript-eslint/no-empty-function */
  });
  afterEach(() => {
    console.log = consoleLog;
    console.error = consoleError;
  });

  it("is a function", () => {
    expect(typeof cli).toBe("function");
  });

  describe("validation", () => {
    let packer;
    beforeEach(() => {
      packer = jest.fn().mockReturnValue({
        id: ID,
        privateKey: PRIVATE_KEY,
        plugin: PLUGIN_BUFFER,
      });
    });

    it("invalid `url`", (done) => {
      cli(path.join(fixturesDir, "plugin-invalid-url"), {
        packerMock_: packer,
      }).catch((error) => {
        expect(/Invalid manifest.json/.test(error.message)).toBe(true);
        done();
      });
    });

    it("invalid `https-url`", (done) => {
      cli(path.join(fixturesDir, "plugin-invalid-https-url"), {
        packerMock_: packer,
      }).catch((error) => {
        expect(/Invalid manifest.json/.test(error.message)).toBe(true);
        done();
      });
    });

    it("invalid `relative-path`", (done) => {
      cli(path.join(fixturesDir, "plugin-invalid-relative-path"), {
        packerMock_: packer,
      }).catch((error) => {
        expect(/Invalid manifest.json/.test(error.message)).toBe(true);
        done();
      });
    });

    it("invalid `maxFileSize`", (done) => {
      cli(path.join(fixturesDir, "plugin-invalid-maxFileSize"), {
        packerMock_: packer,
      }).catch((error) => {
        expect(/Invalid manifest.json/.test(error.message)).toBe(true);
        done();
      });
    });
  });

  describe("without ppk", () => {
    const pluginDir = path.join(sampleDir, "plugin-dir");
    let packer;
    let resultPluginPath;
    beforeEach(() => {
      packer = jest.fn().mockReturnValue({
        id: ID,
        privateKey: PRIVATE_KEY,
        plugin: PLUGIN_BUFFER,
      });

      return rimraf(`${sampleDir}/*.*(ppk|zip)`)
        .then(() => cli(pluginDir, { packerMock_: packer }))
        .then((filePath) => {
          resultPluginPath = filePath;
        });
    });

    it("calles `packer` with contents.zip as the 1st argument", (done) => {
      expect(packer.mock.calls.length).toBe(1);
      expect(packer.mock.calls[0][0]).toBeTruthy();
      readZipContentsNames(packer.mock.calls[0][0]).then((files) => {
        expect(files.sort()).toStrictEqual(
          ["image/icon.png", "manifest.json"].sort()
        );
        done();
      });
    });

    it("calles `packer` with privateKey as the 2nd argument", () => {
      expect(packer.mock.calls.length).toBe(1);
      expect(packer.mock.calls[0][1]).toBe(undefined);
    });

    it("generates a private key file", () => {
      const privateKey = fs.readFileSync(
        path.join(sampleDir, `${ID}.ppk`),
        "utf8"
      );
      expect(privateKey).toBe(PRIVATE_KEY);
    });

    it("generates a plugin file", () => {
      const pluginBuffer = fs.readFileSync(resultPluginPath);
      expect(PLUGIN_BUFFER.equals(pluginBuffer)).toBe(true);
    });
  });

  describe("with ppk", () => {
    const pluginDir = path.join(sampleDir, "plugin-dir");
    let packer;
    beforeEach(() => {
      packer = jest.fn().mockReturnValue({
        id: ID,
        privateKey: PRIVATE_KEY,
        plugin: PLUGIN_BUFFER,
      });

      return rimraf(`${sampleDir}/*.*(ppk|zip)`).then(() =>
        cli(pluginDir, { ppk: ppkPath, packerMock_: packer })
      );
    });

    it("calles `packer` with privateKey as the 2nd argument", () => {
      expect(packer.mock.calls.length).toBe(1);
      const ppkFile = fs.readFileSync(ppkPath, "utf8");
      expect(packer.mock.calls[0][1]).toBe(ppkFile);
    });

    it("does not generate a private key file", () => {
      const ppkFiles = glob.sync(`${sampleDir}/*.ppk`);
      expect(ppkFiles).toStrictEqual([]);
    });
  });

  it("includes files listed in manifest.json only", () => {
    const pluginDir = path.join(fixturesDir, "plugin-full-manifest");
    const packer = jest.fn().mockReturnValue({
      id: ID,
      privateKey: PRIVATE_KEY,
      plugin: PLUGIN_BUFFER,
    });

    return rimraf(`${sampleDir}/*.*(ppk|zip)`)
      .then(() => cli(pluginDir, { packerMock_: packer }))
      .then(() => {
        return readZipContentsNames(packer.mock.calls[0][0]).then((files) => {
          expect(files.sort()).toStrictEqual(
            [
              "css/config.css",
              "css/desktop.css",
              "css/mobile.css",
              "html/config.html",
              "image/icon.png",
              "js/config.js",
              "js/desktop.js",
              "js/mobile.js",
              "manifest.json",
            ].sort()
          );
        });
      });
  });

  it("includes files listed in manifest.json only", () => {
    const pluginDir = path.join(sampleDir, "plugin-dir");
    const outputDir = path.join("test", ".output");
    const outputPluginPath = path.join(outputDir, "foo.zip");
    const packer = jest.fn().mockReturnValue({
      id: ID,
      privateKey: PRIVATE_KEY,
      plugin: PLUGIN_BUFFER,
    });

    return rimraf(outputDir)
      .then(() =>
        cli(pluginDir, { packerMock_: packer, out: outputPluginPath })
      )
      .then((resultPluginPath) => {
        expect(resultPluginPath).toBe(outputPluginPath);
        const pluginBuffer = fs.readFileSync(outputPluginPath);
        expect(PLUGIN_BUFFER.equals(pluginBuffer)).toBe(true);
        const ppk = fs.readFileSync(path.join(outputDir, `${ID}.ppk`));
        expect(PRIVATE_KEY).toBe(ppk.toString());
      });
  });
});
