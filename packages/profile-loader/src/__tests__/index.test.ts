import path from "path";
import { loadProfile } from "../";

describe("index", () => {
  let originalUsername: string | undefined;
  let originalPassword: string | undefined;
  let originalBaseUrl: string | undefined;
  let originalApiToken: string | undefined;
  let originalOAuthToken: string | undefined;
  beforeEach(() => {
    originalUsername = process.env.KINTONE_USERNAME;
    originalPassword = process.env.KINTONE_PASSWORD;
    originalBaseUrl = process.env.KINTONE_BASE_URL;
    originalApiToken = process.env.KINTONE_API_TOKEN;
    originalOAuthToken = process.env.KINTONE_OAUTH_TOKEN;
    delete process.env.KINTONE_USERNAME;
    delete process.env.KINTONE_PASSWORD;
    delete process.env.KINTONE_BASE_URL;
    delete process.env.KINTONE_API_TOKEN;
    delete process.env.KINTONE_OAUTH_TOKEN;
  });
  afterEach(() => {
    process.env.KINTONE_USERNAME = originalUsername;
    process.env.KINTONE_PASSWORD = originalPassword;
    process.env.KINTONE_BASE_URL = originalBaseUrl;
    process.env.KINTONE_API_TOKEN = originalApiToken;
    process.env.KINTONE_OAUTH_TOKEN = originalOAuthToken;
  });
  describe("loadProfile", () => {
    it("should return a profile", () => {
      expect(loadProfile()).toEqual({
        username: null,
        password: null,
        baseUrl: null,
        apiToken: null,
        oAuthToken: null,
      });
    });
    it("should be able to load setting from environment variable", () => {
      process.env.KINTONE_USERNAME = "bob";
      process.env.KINTONE_PASSWORD = "password";
      process.env.KINTONE_BASE_URL = "https://example.kintone.com";
      process.env.KINTONE_API_TOKEN = "api_token";
      process.env.KINTONE_OAUTH_TOKEN = "oauth_token";
      expect(loadProfile()).toEqual({
        username: "bob",
        password: "password",
        baseUrl: "https://example.kintone.com",
        apiToken: "api_token",
        oAuthToken: "oauth_token",
      });
    });
    it("should be able to load setting from environment variable", () => {
      expect(
        loadProfile(path.resolve(__dirname, "fixtures", "config"))
      ).toEqual({
        username: "jim",
        password: "foo",
        baseUrl: "https://foo.kintone.com",
        apiToken: "api_token_config",
        oAuthToken: "oauth_token_config",
      });
    });
  });
});
