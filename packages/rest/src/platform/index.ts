import type { Agent } from "undici";
import { type AuthOption } from "../client/KintoneClientOptions/types/Auth";
import type { ClientCertAuth } from "../client/KintoneClientOptions/types/CertAuth";

export type PlatformDeps = {
  getRequestToken: () => Promise<string>;
  getDefaultAuth: () => AuthOption;
  buildCertAuth: (certAuth: ClientCertAuth) => { dispatcher: Agent };
  buildUserAgentHeader: (options: { userAgent?: string }) => {
    "User-Agent"?: string;
  };
  buildTimeoutHeader: (options: { socketTimeout?: number }) => {
    timeout?: number;
  };
  buildBaseUrl: (baseUrl?: string) => string;
  getVersion: () => string;
};

export const platformDeps: PlatformDeps = {
  getRequestToken: () => {
    throw new Error("not implemented");
  },
  getDefaultAuth: () => {
    throw new Error("not implemented");
  },
  buildBaseUrl: () => {
    throw new Error("not implemented");
  },
  getVersion: () => {
    throw new Error("not implemented");
  },
  buildCertAuth: () => {
    throw new Error("not implemented");
  },
  buildUserAgentHeader: () => {
    throw new Error("not implemented");
  },
  buildTimeoutHeader: () => {
    throw new Error("not implemented");
  },
};

export const injectPlatformDeps = (deps: Partial<PlatformDeps>) => {
  if (deps.getRequestToken) {
    platformDeps.getRequestToken = deps.getRequestToken;
  }
  if (deps.getDefaultAuth) {
    platformDeps.getDefaultAuth = deps.getDefaultAuth;
  }
  if (deps.buildCertAuth) {
    platformDeps.buildCertAuth = deps.buildCertAuth;
  }
  if (deps.buildUserAgentHeader) {
    platformDeps.buildUserAgentHeader = deps.buildUserAgentHeader;
  }
  if (deps.buildTimeoutHeader) {
    platformDeps.buildTimeoutHeader = deps.buildTimeoutHeader;
  }
  if (deps.buildBaseUrl) {
    platformDeps.buildBaseUrl = deps.buildBaseUrl;
  }
  if (deps.getVersion) {
    platformDeps.getVersion = deps.getVersion;
  }
};
