import assert from "assert";
import { buildManifest } from "../manifest";

import createBaseManifest from "./helpers/baseManifest";

describe("manifest", () => {
  describe("buildManifest", () => {
    const templateType = "minimum";
    it("should include basic settings", () => {
      // @ts-ignore We can fix this using conditional types
      const manifest = buildManifest(
        {
          ...createBaseManifest(),
          ja: false,
          cn: false,
        },
        templateType
      );
      assert.strictEqual(manifest.manifest_version, 1);
      assert.strictEqual(manifest.name.en, "sample");
      assert.strictEqual(manifest.mobile, undefined);
    });
    it("should include mobile.js if the answers enable mobile", () => {
      // @ts-ignore We can fix this using conditional types
      const manifest = buildManifest(
        {
          ...createBaseManifest(),
          ja: false,
          cn: false,
          mobile: true,
        },
        templateType
      );
      assert(manifest.mobile && Array.isArray(manifest.mobile.js));
    });
    it("should include config if the answers enable config", () => {
      // @ts-ignore We can fix this using conditional types
      const manifest = buildManifest(
        {
          ...createBaseManifest(),
          ja: false,
          cn: false,
          config: true,
        },
        templateType
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
