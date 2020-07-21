import { KintoneRestAPIClient } from "../KintoneRestAPIClient";
import { injectPlatformDeps } from "../platform";
import * as browserDeps from "../platform/browser";

describe("KintoneRestAPIClient", () => {
  describe("constructor", () => {
    let originalKintone: any;
    let originalLocation: any;
    beforeEach(() => {
      originalKintone = global.kintone;
      originalLocation = global.location;
      global.kintone = {
        getRequestToken: () => "dummy request token",
      };
      global.location = {
        host: "example.com",
        protocol: "https:",
      };
    });
    afterEach(() => {
      global.kintone = originalKintone;
      global.location = originalLocation;
    });
    describe("Header", () => {
      const baseUrl = "https://example.com";
      it("should use a location object in browser environment if baseUrl param is not specified", () => {
        injectPlatformDeps(browserDeps);
        const client = new KintoneRestAPIClient();
        expect(client.getBaseUrl()).toBe("https://example.com");
      });

      it("should raise an error in Node.js environment if baseUrl param is not specified", () => {
        const USERNAME = "user";
        const PASSWORD = "password";
        const auth = {
          username: USERNAME,
          password: PASSWORD,
        };
        expect(() => new KintoneRestAPIClient({ auth })).toThrow(
          "in Node.js environment, baseUrl is required"
        );
      });
      it("should raise an error if trying to use session auth in Node.js environment", () => {
        expect(() => {
          new KintoneRestAPIClient({
            baseUrl,
          });
        }).toThrow(
          "session authentication is not supported in Node.js environment."
        );
      });
    });
  });

  describe("version", () => {
    it("should provide this library version", () => {
      expect(KintoneRestAPIClient.version).toBe(
        require("../../package.json").version
      );
    });
  });
});
