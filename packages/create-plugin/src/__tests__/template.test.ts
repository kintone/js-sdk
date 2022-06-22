import assert from "assert";
import { isNecessaryFile, getTemplateType } from "../template";
import createBaseManifest from "./helpers/baseManifest";

describe("template", () => {
  describe("getTemplateType", () => {
    it("should return be mimimum", () => {
      assert.strictEqual(getTemplateType(createBaseManifest()), "minimum");
    });
  });
  describe("filterTemplateFile", () => {
    it("should returns a boolean that shows whether the file should include or not", () => {
      const manifest = createBaseManifest();
      assert(!isNecessaryFile(manifest, "js/mobile.js"));
      assert(!isNecessaryFile(manifest, "js/config.js"));
      assert(isNecessaryFile(manifest, "js/other.js"));
      assert(isNecessaryFile({ ...manifest, mobile: {} }, "js/mobile.js"));
      assert(isNecessaryFile({ ...manifest, config: {} }, "js/config.js"));
    });
  });
});
