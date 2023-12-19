import path from "path";
import { loadProfile } from "../";

describe("index", () => {
  let originalUsername: string | undefined;
  let originalPassword: string | undefined;
  let originalBaseUrl: string | undefined;
  let originalApiToken: string | undefined;
  let originalOAuthToken: string | undefined;
  let originalConfigFile: string | undefined;
  let originalCredentialsFile: string | undefined;
  let originalKintoneProfile: string | undefined;
  beforeEach(() => {
    originalUsername = process.env.KINTONE_USERNAME;
    originalPassword = process.env.KINTONE_PASSWORD;
    originalBaseUrl = process.env.KINTONE_BASE_URL;
    originalApiToken = process.env.KINTONE_API_TOKEN;
    originalOAuthToken = process.env.KINTONE_OAUTH_TOKEN;
    originalConfigFile = process.env.KINTONE_CONFIG_FILE;
    originalCredentialsFile = process.env.KINTONE_CREDENTIALS_FILE;
    originalKintoneProfile = process.env.KINTONE_PROFILE;
    delete process.env.KINTONE_USERNAME;
    delete process.env.KINTONE_PASSWORD;
    delete process.env.KINTONE_BASE_URL;
    delete process.env.KINTONE_API_TOKEN;
    delete process.env.KINTONE_OAUTH_TOKEN;
    delete process.env.KINTONE_CONFIG_FILE;
    delete process.env.KINTONE_CREDENTIALS_FILE;
    delete process.env.KINTONE_PROFILE;
  });
  afterEach(() => {
    process.env.KINTONE_USERNAME = originalUsername;
    process.env.KINTONE_PASSWORD = originalPassword;
    process.env.KINTONE_BASE_URL = originalBaseUrl;
    process.env.KINTONE_API_TOKEN = originalApiToken;
    process.env.KINTONE_OAUTH_TOKEN = originalOAuthToken;
    process.env.KINTONE_CONFIG_FILE = originalConfigFile;
    process.env.KINTONE_CREDENTIALS_FILE = originalCredentialsFile;
    process.env.KINTONE_PROFILE = originalKintoneProfile;
  });
  describe("loadProfile", () => {
    const configFilePath = path.resolve(__dirname, "fixtures", "config");
    const credentialsFilePath = path.resolve(
      __dirname,
      "fixtures",
      "credentials",
    );
    it("should return a profile", () => {
      expect(loadProfile({ config: false, credentials: false })).toEqual({
        username: null,
        password: null,
        baseUrl: null,
        apiToken: null,
        oAuthToken: null,
      });
    });
    it("should be able to load settings from environment variable", () => {
      process.env.KINTONE_USERNAME = "bob";
      process.env.KINTONE_PASSWORD = "password";
      process.env.KINTONE_BASE_URL = "https://example.kintone.com";
      process.env.KINTONE_API_TOKEN = "api_token";
      process.env.KINTONE_OAUTH_TOKEN = "oauth_token";
      expect(loadProfile({ config: false, credentials: false })).toEqual({
        username: "bob",
        password: "password",
        baseUrl: "https://example.kintone.com",
        apiToken: "api_token",
        oAuthToken: "oauth_token",
      });
    });
    it("should be able to load settings from a config file", () => {
      expect(
        loadProfile({
          config: configFilePath,
          credentials: credentialsFilePath,
        }),
      ).toEqual({
        username: "jim",
        password: "foo",
        baseUrl: "https://foo.kintone.com",
        apiToken: "api_token_config",
        oAuthToken: "oauth_token_config",
      });
    });
    it("should be able to load a specified profile settings from environment variable", () => {
      expect(
        loadProfile({
          profile: "staging",
          config: configFilePath,
          credentials: credentialsFilePath,
        }),
      ).toEqual({
        username: "staging-jim",
        password: "staging-foo",
        baseUrl: "https://staging-foo.kintone.com",
        apiToken: "staging-api_token_config",
        oAuthToken: "staging-oauth_token_config",
      });
    });
    it("should be able to load a specified profile settings via KINTONE_PROFILE", () => {
      process.env.KINTONE_PROFILE = "staging";
      expect(
        loadProfile({
          config: configFilePath,
          credentials: credentialsFilePath,
        }),
      ).toEqual({
        username: "staging-jim",
        password: "staging-foo",
        baseUrl: "https://staging-foo.kintone.com",
        apiToken: "staging-api_token_config",
        oAuthToken: "staging-oauth_token_config",
      });
    });
    it("should override settings in a config file by environment variable settings", () => {
      process.env.KINTONE_USERNAME = "admin";
      expect(
        loadProfile({
          config: configFilePath,
          credentials: credentialsFilePath,
        }),
      ).toEqual({
        username: "admin",
        password: "foo",
        baseUrl: "https://foo.kintone.com",
        apiToken: "api_token_config",
        oAuthToken: "oauth_token_config",
      });
    });
    it("should be able to change the directory storing a config with KINTONE_CONFIG_FILE", () => {
      process.env.KINTONE_CONFIG_FILE = configFilePath;
      expect(loadProfile({ credentials: false })).toEqual({
        username: null,
        password: null,
        baseUrl: "https://foo.kintone.com",
        apiToken: null,
        oAuthToken: null,
      });
    });
    it("should be able to change the directory storing a credentials with KINTONE_CREDENTIALS_FILE", () => {
      process.env.KINTONE_CREDENTIALS_FILE = credentialsFilePath;
      expect(loadProfile({ config: false })).toEqual({
        username: "jim",
        password: "foo",
        baseUrl: null,
        apiToken: "api_token_config",
        oAuthToken: "oauth_token_config",
      });
    });
  });
});
