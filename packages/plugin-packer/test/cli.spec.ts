import type { Mock } from "vitest";
import fs from "fs";
import path from "path";
import { rimraf } from "rimraf";
import { globSync } from "glob";
import { readZipContentsNames } from "./helper/zip";
import cli from "../src/cli";
import console from "../src/console";

const fixturesDir = path.posix.join(__dirname, "fixtures");
const sampleDir = path.posix.join(fixturesDir, "sample-plugin");
const ppkPath = path.posix.join(fixturesDir, "private.ppk");

const ID = "aaa";
const PRIVATE_KEY = "PRIVATE_KEY";
const PLUGIN_BUFFER = Buffer.from("foo");

describe("cli", () => {
  const consoleLog = console.log;
  const consoleError = console.error;
  const consoleWarn = console.warn;
  beforeEach(() => {
    /* eslint-disable @typescript-eslint/no-empty-function -- This is mock functions */
    console.log = () => {};
    console.error = () => {};
    console.warn = () => {};
    /* eslint-enable @typescript-eslint/no-empty-function */
  });
  afterEach(() => {
    console.log = consoleLog;
    console.error = consoleError;
    console.warn = consoleWarn;
  });

  it("is a function", () => {
    expect(typeof cli).toBe("function");
  });

  describe("validation", () => {
    let packer: Mock;
    beforeEach(() => {
      packer = vi.fn().mockReturnValue({
        id: ID,
        privateKey: PRIVATE_KEY,
        plugin: PLUGIN_BUFFER,
      });
    });

    it("invalid `url`", async () => {
      await expect(
        cli(path.join(fixturesDir, "plugin-invalid-url"), {
          packerMock_: packer,
        }),
      ).rejects.toThrow(/Invalid manifest.json/);
    });

    it("invalid `https-url`", async () => {
      await expect(
        cli(path.join(fixturesDir, "plugin-invalid-https-url"), {
          packerMock_: packer,
        }),
      ).rejects.toThrow(/Invalid manifest.json/);
    });

    it("invalid `relative-path`", async () => {
      await expect(
        cli(path.join(fixturesDir, "plugin-invalid-relative-path"), {
          packerMock_: packer,
        }),
      ).rejects.toThrow(/Invalid manifest.json/);
    });

    it("invalid `maxFileSize`", async () => {
      await expect(
        cli(path.join(fixturesDir, "plugin-invalid-maxFileSize"), {
          packerMock_: packer,
        }),
      ).rejects.toThrow(/Invalid manifest.json/);
    });

    it("invalid `fileExists`", async () => {
      await expect(
        cli(path.join(fixturesDir, "plugin-non-file-exists"), {
          packerMock_: packer,
        }),
      ).rejects.toThrow(/Invalid manifest.json/);
    });
  });

  describe("without ppk", () => {
    const pluginDir = path.join(sampleDir, "plugin-dir");
    let packer: Mock;
    let resultPluginPath: string;
    beforeEach(() => {
      packer = vi.fn().mockReturnValue({
        id: ID,
        privateKey: PRIVATE_KEY,
        plugin: PLUGIN_BUFFER,
      });

      return rimraf(`${sampleDir}/*.*(ppk|zip)`, { glob: true })
        .then(() => cli(pluginDir, { packerMock_: packer }))
        .then((filePath) => {
          resultPluginPath = filePath;
        });
    });

    it("calles `packer` with contents.zip as the 1st argument", async () => {
      expect(packer.mock.calls.length).toBe(1);
      expect(packer.mock.calls[0][0]).toBeTruthy();
      const files = await readZipContentsNames(packer.mock.calls[0][0]);
      expect(files.sort()).toStrictEqual(
        ["image/icon.png", "manifest.json"].sort(),
      );
    });

    it("calles `packer` with privateKey as the 2nd argument", () => {
      expect(packer.mock.calls.length).toBe(1);
      expect(packer.mock.calls[0][1]).toBe(undefined);
    });

    it("generates a private key file", () => {
      const privateKey = fs.readFileSync(
        path.join(sampleDir, `${ID}.ppk`),
        "utf8",
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
    let packer: Mock;
    beforeEach(() => {
      packer = vi.fn().mockReturnValue({
        id: ID,
        privateKey: PRIVATE_KEY,
        plugin: PLUGIN_BUFFER,
      });

      return rimraf(`${sampleDir}/*.*(ppk|zip)`, { glob: true }).then(() =>
        cli(pluginDir, { ppk: ppkPath, packerMock_: packer }),
      );
    });

    it("calles `packer` with privateKey as the 2nd argument", () => {
      expect(packer.mock.calls.length).toBe(1);
      const ppkFile = fs.readFileSync(ppkPath, "utf8");
      expect(packer.mock.calls[0][1]).toBe(ppkFile);
    });

    it("does not generate a private key file", () => {
      const ppkFiles = globSync(`${sampleDir}/*.ppk`);
      expect(ppkFiles).toStrictEqual([]);
    });
  });

  it("includes files listed in manifest.json only", () => {
    const pluginDir = path.join(fixturesDir, "plugin-full-manifest");
    const packer = vi.fn().mockReturnValue({
      id: ID,
      privateKey: PRIVATE_KEY,
      plugin: PLUGIN_BUFFER,
    });

    return rimraf(`${sampleDir}/*.*(ppk|zip)`, { glob: true })
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
            ].sort(),
          );
        });
      });
  });

  it("outputs plugin zip and ppk to specified directory", () => {
    const pluginDir = path.join(sampleDir, "plugin-dir");
    const outputDir = path.join("test", ".output");
    const outputPluginPath = path.join(outputDir, "foo.zip");
    const packer = vi.fn().mockReturnValue({
      id: ID,
      privateKey: PRIVATE_KEY,
      plugin: PLUGIN_BUFFER,
    });

    return rimraf(outputDir)
      .then(() =>
        cli(pluginDir, { packerMock_: packer, out: outputPluginPath }),
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
