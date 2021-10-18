"use strict";

import assert from "assert";
import { isNecessaryFile, getTemplateType } from "../src/template";
import createBaseManifest from "./baseManifest";

describe("template", () => {
  describe("getTemplateType", () => {
    it("should return be mimimum", () => {
      assert.equal(getTemplateType(createBaseManifest()), "minimum");
    });
  });
  describe("filterTemplateFile", () => {
    it("should returns a boolean that shows whether the file should include or not", () => {
      const manifest = createBaseManifest();
      assert(isNecessaryFile(manifest, "js/mobile.js") === false);
      assert(isNecessaryFile(manifest, "js/config.js") === false);
      assert(isNecessaryFile(manifest, "js/other.js") === true);
      assert(
        isNecessaryFile({ ...manifest, mobile: {} }, "js/mobile.js") === true
      );
      assert(
        isNecessaryFile({ ...manifest, config: {} }, "js/config.js") === true
      );
    });
  });
});
