import fs from "fs";
import { UnsupportedPlatformError } from "./UnsupportedPlatformError";
import os from "os";
import { Agent } from "undici";
import type { PlatformDeps } from ".";
import type { ClientCertAuth } from "../client/KintoneClientOptions/types/CertAuth";
const packageJson = require("../../package.json");

const getRequestToken = () => {
  throw new UnsupportedPlatformError("Node.js");
};

const getDefaultAuth = () => {
  throw new UnsupportedPlatformError("Node.js");
};

const buildCertAuth = (certAuth: ClientCertAuth): { dispatcher: Agent } => {
  const agent = new Agent({
    connect: {
      pfx:
        "pfx" in certAuth
          ? certAuth.pfx
          : fs.readFileSync(certAuth.pfxFilePath),
      passphrase: certAuth.password,
    },
  });

  return { dispatcher: agent };
};

const buildTimeoutHeader = (options: { socketTimeout?: number }) => {
  if (options.socketTimeout) {
    return { timeout: options.socketTimeout };
  }

  return {};
};

const buildUserAgentHeader = (options: { userAgent?: string }) => {
  const { userAgent } = options;
  return userAgent !== undefined
    ? {
        "User-Agent": `Node.js/${process.version}(${os.type()}) ${
          packageJson.name
        }@${packageJson.version}${userAgent ? ` ${userAgent}` : ""}`,
      }
    : {};
};

const buildBaseUrl = (baseUrl: string | undefined) => {
  if (typeof baseUrl === "undefined") {
    throw new Error("in Node.js environment, baseUrl is required");
  }
  return baseUrl;
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
