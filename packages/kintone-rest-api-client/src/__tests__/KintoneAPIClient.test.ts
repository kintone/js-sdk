import { KintoneAPIClient } from "../KintoneAPIClient";

describe("KintoneAPIClient", () => {
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
          "X-Cybozu-Authorization": Buffer.from(
            `${USERNAME}:${PASSWORD}`
          ).toString("base64")
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
