import { DiscriminatedAuth } from "../types/auth";
type PlatformDeps = {
  readFileFromPath: (
    filePath: string
  ) => Promise<{ name: string; data: unknown }>;
  getRequestToken: () => Promise<string>;
  getDefaultAuth: () => DiscriminatedAuth;
  buildPlatformDependentConfig: (params: object) => object;
  buildHeaders: (params: { userAgent?: string }) => Record<string, string>;
  buildFormDataValue: (data: unknown) => unknown;
  buildBaseUrl: (baseUrl?: string) => string;
  getVersion: () => string;
};

export const platformDeps: PlatformDeps = {
  readFileFromPath: () => {
    throw new Error("not implemented");
  },
  getRequestToken: () => {
    throw new Error("not implemented");
  },
  getDefaultAuth: () => {
    throw new Error("not implemented");
  },
  buildPlatformDependentConfig: () => {
    throw new Error("not implemented");
  },
  buildHeaders: () => {
    throw new Error("not implemented");
  },
  buildFormDataValue: () => {
    throw new Error("not implemented");
  },
  buildBaseUrl: () => {
    throw new Error("not implemented");
  },
  getVersion: () => {
    throw new Error("not implemented");
  },
};

export const injectPlatformDeps = (deps: Partial<PlatformDeps>) => {
  if (deps.readFileFromPath) {
    platformDeps.readFileFromPath = deps.readFileFromPath;
  }
  if (deps.getRequestToken) {
    platformDeps.getRequestToken = deps.getRequestToken;
  }
  if (deps.getDefaultAuth) {
    platformDeps.getDefaultAuth = deps.getDefaultAuth;
  }
  if (deps.buildPlatformDependentConfig) {
    platformDeps.buildPlatformDependentConfig =
      deps.buildPlatformDependentConfig;
  }
  if (deps.buildHeaders) {
    platformDeps.buildHeaders = deps.buildHeaders;
  }
  if (deps.buildFormDataValue) {
    platformDeps.buildFormDataValue = deps.buildFormDataValue;
  }
  if (deps.buildBaseUrl) {
    platformDeps.buildBaseUrl = deps.buildBaseUrl;
  }
  if (deps.getVersion) {
    platformDeps.getVersion = deps.getVersion;
  }
};
