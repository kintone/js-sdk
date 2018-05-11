"use strict";

import * as assert from "assert";
import { buildManifest } from "../src/manifest";

import createBaseManifest from "./baseManifest";

describe("manifest", () => {
  describe("buildManifest", () => {
    it("should include basic settings", () => {
      // @ts-ignore We can fix this using conditional types
      const manifest = buildManifest({
        ...createBaseManifest(),
        ja: false,
        cn: false
      });
      assert.equal(manifest.manifest_version, 1);
      assert.equal(manifest.name.en, "sample");
      assert.equal(manifest.mobile, undefined);
    });
    it("should include mobile.js if the answers enable mobile", () => {
      // @ts-ignore We can fix this using conditional types
      const manifest = buildManifest({
        ...createBaseManifest(),
        ja: false,
        cn: false,
        mobile: true
      });
      assert(manifest.mobile && Array.isArray(manifest.mobile.js));
    });
    it("should include config if the answers enable config", () => {
      // @ts-ignore We can fix this using conditional types
      const manifest = buildManifest({
        ...createBaseManifest(),
        ja: false,
        cn: false,
        config: true
      });
      assert.deepStrictEqual(manifest.config && Object.keys(manifest.config), [
        "html",
        "js",
        "css",
        "required_params"
      ]);
    });
  });
});
