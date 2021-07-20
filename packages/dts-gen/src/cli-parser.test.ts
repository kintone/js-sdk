import { parse } from "./cli-parser";

describe("parse", () => {
  describe("with environment variables", () => {
    beforeEach(() => {
      process.env.KINTONE_BASE_URL = "https://example.kintone.com";
      process.env.KINTONE_USERNAME = "admin";
      process.env.KINTONE_PASSWORD = "password";
      process.env.KINTONE_BASIC_AUTH_USERNAME = "basic-auth-admin";
      process.env.KINTONE_BASIC_AUTH_PASSWORD = "basic-auth-password";
      process.env.KINTONE_API_TOKEN = "api-token";
      process.env.KINTONE_OAUTH_TOKEN = "oauth-token";
    });
    afterEach(() => {
      delete process.env.KINTONE_BASE_URL;
      delete process.env.KINTONE_USERNAME;
      delete process.env.KINTONE_PASSWORD;
      delete process.env.KINTONE_BASIC_AUTH_USERNAME;
      delete process.env.KINTONE_BASIC_AUTH_PASSWORD;
      delete process.env.KINTONE_API_TOKEN;
      delete process.env.KINTONE_OAUTH_TOKEN;
    });
    test("default values", () => {
      const args = parse(["node", "index.js"]);
      expect(args.username).toBe("admin");
      expect(args.password).toBe("password");
      expect(args.baseUrl).toBe("https://example.kintone.com");
      expect(args.basicAuthUsername).toBe("basic-auth-admin");
      expect(args.basicAuthPassword).toBe("basic-auth-password");
      expect(args.apiToken).toBe("api-token");
      expect(args.oAuthToken).toBe("oauth-token");
      expect(args.output).toBe("fields.d.ts");
    });
  });
  describe("without environment variables", () => {
    test("default values", () => {
      // prettier-ignore
      const args = parse([
                "node",
                "index.js",
                "--base-url", "https://example2.kintone.com",
            ]);

      expect(args.demo).toBe(false);
      expect(args.username).toBeNull();
      expect(args.password).toBeNull();
      expect(args.apiToken).toBeNull();
      expect(args.oAuthToken).toBeNull();
      expect(args.appId).toBeNull();
      expect(args.guestSpaceId).toBeNull();
      expect(args.preview).toBe(false);
      expect(args.namespace).toBe("kintone.types");
      expect(args.proxyHost).toBeNull();
      expect(args.proxyPort).toBeNull();
      expect(args.basicAuthUsername).toBeNull();
      expect(args.basicAuthPassword).toBeNull();
      expect(args.output).toBe("fields.d.ts");
    });

    test("long flag values", () => {
      // prettier-ignore
      const args = parse([
                "node", "index.js",
                "--base-url", "https://example2.kintone.com",
                "--demo",
                "--username", "USERNAME",
                "--password", "PASSWORD",
                "--api-token", "API_TOKEN",
                "--oauth-token", "OAUTH_TOKEN",
                "--app-id", "APP_ID",
                "--guest-space-id", "GUEST_SPACE_ID",
                "--preview",
                "--type-name", "TYPE_NAME",
                "--namespace", "NAMESPACE",
                "--basic-auth-username", "BASIC_AUTH_USERNAME",
                "--basic-auth-password", "BASIC_AUTH_PASSWORD",
                "--output", "OUTPUT"
            ]);

      expect(args.demo).toBe(true);
      expect(args.baseUrl).toBe("https://example2.kintone.com");
      expect(args.username).toBe("USERNAME");
      expect(args.password).toBe("PASSWORD");
      expect(args.apiToken).toBe("API_TOKEN");
      expect(args.oAuthToken).toBe("OAUTH_TOKEN");
      expect(args.appId).toBe("APP_ID");
      expect(args.guestSpaceId).toBe("GUEST_SPACE_ID");
      expect(args.preview).toBe(true);
      expect(args.typeName).toBe("TYPE_NAME");
      expect(args.namespace).toBe("NAMESPACE");
      expect(args.basicAuthUsername).toBe("BASIC_AUTH_USERNAME");
      expect(args.basicAuthPassword).toBe("BASIC_AUTH_PASSWORD");
      expect(args.output).toBe("OUTPUT");
    });

    test("short flag values", () => {
      // prettier-ignore
      const args = parse([
                "node", "index.js",
                "--base-url", "https://example2.kintone.com",
                "-u", "USERNAME",
                "-p", "PASSWORD",
                "-o", "OUTPUT"
            ]);

      expect(args.username).toBe("USERNAME");
      expect(args.password).toBe("PASSWORD");
      expect(args.output).toBe("OUTPUT");
    });
  });
  describe("validations", () => {
    test("unspecified baseUrl", () => {
      expect(() => {
        parse(["node", "index.js"]);
      }).toThrow("--base-url (KINTONE_BASE_URL) must be specified");
    });
  });
  describe("deprecated options", () => {
    let spy;
    beforeEach(() => {
      spy = jest.spyOn(console, "warn").mockImplementation();
    });
    afterEach(() => {
      spy.mockRestore();
    });
    test("should print the deprecating message with --host", () => {
      const args = parse([
        "node",
        "index.js",
        "--host",
        "https://example.kintone.com",
        "--username",
        "USERNAME",
        "--password",
        "PASSWORD",
        "--app-id",
        "APP_ID",
      ]);
      expect(args.baseUrl).toBe("https://example.kintone.com");
      expect(spy).toHaveBeenCalledWith(
        "--host option will be deprecated, please use the --base-url option instead."
      );
    });
    test("should print the deprecating message with --proxyHost and --proxyPort", () => {
      const args = parse([
        "node",
        "index.js",
        "--base-url",
        "https://example2.kintone.com",
        "--username",
        "USERNAME",
        "--password",
        "PASSWORD",
        "--app-id",
        "APP_ID",
        "--proxy-host",
        "PROXY_HOST",
        "--proxy-port",
        "PROXY_PORT",
      ]);
      expect(args.proxyHost).toBe("PROXY_HOST");
      expect(args.proxyPort).toBe("PROXY_PORT");
      expect(spy).toHaveBeenCalledWith(
        "--proxy-host and --proxy-port options will be deprecated, please use the --proxy option instead"
      );
    });
  });
});
