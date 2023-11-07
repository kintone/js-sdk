import fs from "fs";
import { promisify } from "util";
import { basename } from "path";
import { UnsupportedPlatformError } from "./UnsupportedPlatformError";
import https from "https";
import os from "os";
const packageJson = require("../../package.json");

// TODO: Remove this testing code before merge.
document.getElementById("123");
window.close();
addEventListener("click", () => true);

const readFile = promisify(fs.readFile);

type ClientCertAuth =
  | {
      pfx: Buffer;
      password: string;
    }
  | {
      pfxFilePath: string;
      password: string;
    };

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

export const buildPlatformDependentConfig = ({
  httpsAgent,
  clientCertAuth,
  socketTimeout,
}: {
  httpsAgent?: https.Agent;
  clientCertAuth?: ClientCertAuth;
  socketTimeout?: number;
}) => {
  return {
    ...buildHttpsAgentConfig({ httpsAgent, clientCertAuth }),
    ...buildTimeoutConfig({ socketTimeout }),
  };
};

const buildHttpsAgentConfig = ({
  httpsAgent,
  clientCertAuth,
}: {
  httpsAgent?: https.Agent;
  clientCertAuth?: ClientCertAuth;
}) => {
  if (httpsAgent !== undefined) {
    return { httpsAgent };
  }

  // use default HTTPS agent
  if (clientCertAuth !== undefined) {
    const pfx =
      "pfx" in clientCertAuth
        ? clientCertAuth.pfx
        : fs.readFileSync(clientCertAuth.pfxFilePath);
    const defaultHttpsAgent = new https.Agent({
      pfx,
      passphrase: clientCertAuth.password,
    });
    return { httpsAgent: defaultHttpsAgent };
  }
  return {};
};

const buildTimeoutConfig = (params: { socketTimeout?: number }) => {
  if (params.socketTimeout) {
    return { timeout: params.socketTimeout };
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
