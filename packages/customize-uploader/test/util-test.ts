import assert from "assert";
import { isUrlString, wait } from "../src/util";

describe("util", () => {
  describe("isUrlString", () => {
    it("should return true if the string is URL", () => {
      assert(isUrlString("https://example.com") === true);
    });
    it("should return false if the string is not URL", () => {
      assert(isUrlString("example.com") === false);
    });
  });

  describe("wait", () => {
    it("should wait the specific ms", async () => {
      const start = Date.now();
      await wait(50);
      assert(Date.now() >= start + 50);
    });
  });
});
