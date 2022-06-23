import * as assert from "assert";
import { getDefaultLang } from "../lang";

describe("lang", () => {
  describe("getDefaultLang", () => {
    it('should return "ja" or "en" based the passed value', () => {
      assert.strictEqual(getDefaultLang("ja_JP.UTF-8"), "ja");
      assert.strictEqual(getDefaultLang("C"), "en");
    });
    it('should return "en" as the default value if the passed value is undefined', () => {
      assert.strictEqual(getDefaultLang(), "en");
      assert.strictEqual(getDefaultLang(undefined), "en");
    });
  });
});
