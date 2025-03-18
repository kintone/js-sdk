import { UnsupportedPlatformError } from "./UnsupportedPlatformError";
import packageJson from "../../package.json";
import type { AuthOption } from "../client/KintoneClientOptions/types/Auth";
import type { PlatformDeps } from ".";

declare let kintone: {
  getRequestToken(): string;
};

declare let garoon: {
  connect: {
    kintone: {
      getRequestToken(): Promise<string>;
    };
  };
};

const getRequestToken = async () => {
  if (
    typeof kintone === "object" &&
    kintone !== null &&
    typeof kintone.getRequestToken === "function"
  ) {
    return kintone.getRequestToken();
  }

  if (
    typeof garoon === "object" &&
    garoon !== null &&
    typeof garoon.connect?.kintone?.getRequestToken === "function"
  ) {
    return garoon.connect.kintone.getRequestToken();
  }

  throw new Error("session authentication must specify a request token");
};

const getDefaultAuth = (): AuthOption => {
  return {
    type: "session",
  };
};

const buildCertAuth = () => {
  throw new UnsupportedPlatformError("Browser");
};

const buildTimeoutHeader = () => {
  return {};
};

const buildUserAgentHeader = (options: { userAgent?: string }) => {
  return options.userAgent !== undefined
    ? { "User-Agent": options.userAgent }
    : {};
};

const buildBaseUrl = (baseUrl?: string) => {
  if (baseUrl) {
    return baseUrl;
  }

  if (location === undefined) {
    throw new Error("The baseUrl parameter is required for this environment");
  }

  const { host, protocol } = location;

  return `${protocol}//${host}`;
};

const getVersion = () => {
  return packageJson.version;
};

export default {
  getRequestToken,
  getDefaultAuth,
  buildCertAuth,
  buildUserAgentHeader,
  buildTimeoutHeader,
  buildBaseUrl,
  getVersion,
} as PlatformDeps;
