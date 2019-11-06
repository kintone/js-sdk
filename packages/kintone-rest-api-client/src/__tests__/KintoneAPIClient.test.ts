import { KintoneAPIClient } from "../KintoneAPIClient";
import { Base64 } from "js-base64";

describe("KintoneAPIClient", () => {
  let originalKintone: any;
  beforeEach(() => {
    originalKintone =
      typeof global.kintone !== "undefined" ? global.kintone : undefined;
    global.kintone = {
      getRequestToken: () => "dummy request token"
    };
  });
  afterEach(() => {
    global.kintone = originalKintone;
  });
  describe("constructor", () => {
    describe("Header", () => {
      const subdomain = "example";
      it("ApiToken auth", () => {
        const API_TOKEN = "ApiToken";
        const auth = {
          apiToken: API_TOKEN
        };
        const client = new KintoneAPIClient({ subdomain, auth });
        expect(client.getHeaders()).toEqual({
          "X-Cybozu-API-Token": API_TOKEN
        });
      });
      it("Password  auth", () => {
        const USERNAME = "user";
        const PASSWORD = "password";
        const auth = {
          username: USERNAME,
          password: PASSWORD
        };
        const client = new KintoneAPIClient({ subdomain, auth });
        expect(client.getHeaders()).toEqual({
          "X-Cybozu-Authorization": Base64.encode(`${USERNAME}:${PASSWORD}`)
        });
      });
      it("Session auth", () => {
        const auth = {};
        const client = new KintoneAPIClient({ subdomain, auth });
        expect(client.getHeaders()).toEqual({
          "X-Requested-With": "XMLHttpRequest"
        });
      });
    });
  });
});
