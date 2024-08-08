import assert from "assert";
import { buildManifest } from "../manifest";

import createBaseManifest from "./helpers/baseManifest";

describe("manifest", () => {
  describe("buildManifest", () => {
    const templateType = "minimum";
    it("should include basic settings", () => {
      const baseManifest = createBaseManifest();
      // @ts-ignore We can fix this using conditional types
      const manifest = buildManifest(
        {
          name: baseManifest.name,
          description: baseManifest.name,
          homepage_url: {},
          supportMobile: false,
          enablePluginUploader: false,
        },
        templateType,
      );
      assert.strictEqual(manifest.manifest_version, 1);
      assert.strictEqual(manifest.name.en, "sample");
      assert.strictEqual(manifest.mobile, undefined);
    });
    it("should include mobile.js if the answers enable mobile", () => {
      const baseManifest = createBaseManifest();
      // @ts-ignore We can fix this using conditional types
      const manifest = buildManifest(
        {
          name: baseManifest.name,
          description: baseManifest.name,
          homepage_url: {},
          supportMobile: true,
          enablePluginUploader: false,
        },
        templateType,
      );
      assert(manifest.mobile && Array.isArray(manifest.mobile.js));
    });
    it("should include config if the answers enable config", () => {
      const baseManifest = createBaseManifest();
      // @ts-ignore We can fix this using conditional types
      const manifest = buildManifest(
        {
          name: baseManifest.name,
          description: baseManifest.name,
          homepage_url: {},
          supportMobile: false,
          enablePluginUploader: false,
        },
        templateType,
      );
      assert.deepStrictEqual(manifest.config && Object.keys(manifest.config), [
        "html",
        "js",
        "css",
        "required_params",
      ]);
    });
  });
});
