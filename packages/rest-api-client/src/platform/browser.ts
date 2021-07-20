import { UnsupportedPlatformError } from "./UnsupportedPlatformError";
import { DiscriminatedAuth } from "../types/auth";

export const readFileFromPath = (filePath: string) => {
  throw new UnsupportedPlatformError("Browser");
};

export const getRequestToken = async () => {
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

export const getDefaultAuth = (): DiscriminatedAuth => {
  return {
    type: "session",
  };
};

export const buildPlatformDependentConfig = () => {
  return {};
};

export const buildHeaders = () => {
  return {};
};

export const buildFormDataValue = (data: unknown) => {
  return new Blob([data]);
};

export const buildBaseUrl = (baseUrl?: string) => {
  if (baseUrl) {
    return baseUrl;
  }

  const { host, protocol } = location!;
  return `${protocol}//${host}`;
};

export const getVersion = () => {
  return PACKAGE_VERSION;
};
