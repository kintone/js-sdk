import fs from "fs";
import { promisify } from "util";
import { basename } from "path";
import { UnsupportedPlatformError } from "./UnsupportedPlatformError";
import https from "https";
import os from "os";
const packageJson = require("../../package.json");

const readFile = promisify(fs.readFile);

export const readFileFromPath = async (filePath: string) => {
  const data = await readFile(filePath);
  const name = basename(filePath);
  return { data, name };
};

export const getRequestToken = () => {
  throw new UnsupportedPlatformError("Node.js");
};

export const getDefaultAuth = () => {
  throw new UnsupportedPlatformError("Node.js");
};

export const buildPlatformDependentConfig = (
  params:
    | { httpsAgent: https.Agent }
    | {
        clientCertAuth?:
          | {
              pfx: Buffer;
              password: string;
            }
          | {
              pfxFilePath: string;
              password: string;
            };
      }
) => {
  if ("httpsAgent" in params) {
    return { httpsAgent: params.httpsAgent };
  }

  // use default HTTPS agent
  const clientCertAuth = params.clientCertAuth;
  if (clientCertAuth) {
    const pfx =
      "pfx" in clientCertAuth
        ? clientCertAuth.pfx
        : fs.readFileSync(clientCertAuth.pfxFilePath);
    const httpsAgent = new https.Agent({
      pfx,
      passphrase: clientCertAuth.password,
    });
    return { httpsAgent };
  }
  return {};
};

export const buildHeaders = (params: { userAgent?: string }) => {
  const { userAgent } = params;
  return {
    "User-Agent": `Node.js/${process.version}(${os.type()}) ${
      packageJson.name
    }@${packageJson.version}${userAgent ? ` ${userAgent}` : ""}`,
  };
};

export const buildFormDataValue = (data: unknown) => {
  return data;
};

export const buildBaseUrl = (baseUrl: string | undefined) => {
  if (typeof baseUrl === "undefined") {
    throw new Error("in Node.js environment, baseUrl is required");
  }
  return baseUrl;
};

export const getVersion = () => {
  return packageJson.version;
};
