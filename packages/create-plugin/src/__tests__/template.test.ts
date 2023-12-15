import assert from "assert";
import {
  isNecessaryFile,
  getTemplateType,
  processTemplateFile,
} from "../template";
import createBaseManifest from "./helpers/baseManifest";
import { promises as fs } from "fs";
import path from "path";
import os from "os";

describe("template", () => {
  describe("getTemplateType", () => {
    it("should return be minimum", () => {
      assert.strictEqual(getTemplateType(createBaseManifest()), "minimum");
    });
  });
  describe("isNecessaryFile", () => {
    it("should returns a boolean that shows whether the file should include or not", () => {
      const manifest = createBaseManifest();
      assert(!isNecessaryFile(manifest, "webpack.entry.json"));
      assert(!isNecessaryFile(manifest, "with-plugin-uploader.json"));
      assert(!isNecessaryFile(manifest, "js/mobile.js"));
      assert(!isNecessaryFile(manifest, "js/config.js"));
      assert(isNecessaryFile(manifest, "js/other.js"));
      assert(isNecessaryFile({ ...manifest, mobile: {} }, "js/mobile.js"));
      assert(isNecessaryFile({ ...manifest, config: {} }, "js/config.js"));
    });
  });
  describe("processTemplateFile", () => {
    let destDir: string;
    const manifest = createBaseManifest();

    beforeEach(async () => {
      destDir = await fs.mkdtemp(
        path.join(os.tmpdir(), "kintone-create-plugin-"),
      );
    });

    const patterns: Array<{ template: string; enablePluginUploader: boolean }> =
      [
        { template: "minimum", enablePluginUploader: false },
        { template: "minimum", enablePluginUploader: true },
        { template: "modern", enablePluginUploader: false },
        { template: "modern", enablePluginUploader: true },
      ];

    it.each(patterns)(
      "should convert package.json correctly (template: $template, enablePluginUploader: $enablePluginUploader)",
      async ({ template, enablePluginUploader }) => {
        const srcDir = path.resolve(
          __dirname,
          "..",
          "..",
          "templates",
          template,
        );

        await processTemplateFile(
          path.resolve(srcDir, "package.json"),
          srcDir,
          destDir,
          manifest,
          enablePluginUploader,
        );

        const packageJson = JSON.parse(
          await fs.readFile(path.resolve(destDir, "package.json"), "utf8"),
        );

        assert(packageJson.name);
        assert(packageJson.version);
        assert(packageJson.scripts);
        assert(packageJson.devDependencies);

        if (enablePluginUploader) {
          assert(packageJson.scripts.upload);
          assert(packageJson.devDependencies["@kintone/plugin-uploader"]);
        }
      },
    );

    it.each(patterns)(
      "should convert template file correctly (template: $template, enablePluginUploader: $enablePluginUploader)",
      async ({ template, enablePluginUploader }) => {
        const srcDir = path.resolve(
          __dirname,
          "..",
          "..",
          "templates",
          template,
        );

        const templateFile =
          template === "modern"
            ? path.resolve(srcDir, "plugin", "html", "config.html.tmpl")
            : path.resolve(srcDir, "src", "html", "config.html.tmpl");

        await processTemplateFile(
          templateFile,
          srcDir,
          destDir,
          manifest,
          enablePluginUploader,
        );

        const destFile =
          template === "modern"
            ? path.resolve(destDir, "plugin", "html", "config.html")
            : path.resolve(destDir, "src", "html", "config.html");
        assert(await fs.stat(destFile));
      },
    );
    it.each(patterns)(
      "should copy normal file correctly (template: $template, enablePluginUploader: $enablePluginUploader)",
      async ({ template, enablePluginUploader }) => {
        const srcDir = path.resolve(
          __dirname,
          "..",
          "..",
          "templates",
          template,
        );

        const templateFile = path.resolve(srcDir, ".gitignore");

        await processTemplateFile(
          templateFile,
          srcDir,
          destDir,
          manifest,
          enablePluginUploader,
        );

        assert(await fs.stat(path.resolve(destDir, ".gitignore")));
      },
    );

    it("should convert webpack.config.js correctly with modern template", async () => {
      const srcDir = path.resolve(__dirname, "..", "..", "templates", "modern");

      await processTemplateFile(
        path.resolve(srcDir, "webpack.config.template.js"),
        srcDir,
        destDir,
        manifest,
        false,
      );
      const destFile = path.resolve(destDir, "webpack.config.js");
      assert(await fs.stat(destFile));
    });
  });
});
