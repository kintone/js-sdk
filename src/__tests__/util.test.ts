import assert from "assert";
import { isUrlString, parseProxy, wait } from "../util";

describe("util", () => {
  describe("isUrlString", () => {
    it("should return true if the string is URL", () => {
      assert(isUrlString("https://example.com") === true);
      assert(isUrlString("http://localhost:8000") === true);
    });
    it("should return false if the string is not URL", () => {
      assert(isUrlString("example.com") === false);
      assert(isUrlString("js/desktop.js") === false);
    });
  });

  describe("wait", () => {
    it("should wait the specific ms", () => {
      const start = Date.now();
      return wait(100).then(() => {
        assert(Date.now() >= start + 90);
      });
    });
  });

  describe("parseProxy", () => {
    it("should return proxy object", () => {
      const host = "localhost";
      const port = 8080;
      const result = parseProxy(`http://${host}:${port}`);
      expect(result).toStrictEqual({ host, port, auth: undefined });
    });
    it("should return proxy object with username and password", () => {
      const host = "localhost";
      const port = 8080;
      const username = "USERNAME";
      const password = "PASSWORD";
      const result = parseProxy(
        `http://${username}:${password}@${host}:${port}`
      );
      expect(result).toStrictEqual({
        host,
        port,
        auth: { username, password },
      });
    });
  });
});
