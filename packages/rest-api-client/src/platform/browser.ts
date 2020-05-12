import { UnsupportedPlatformError } from "./UnsupportedPlatformError";

export const readFileFromPath = (filePath: string) => {
  throw new UnsupportedPlatformError("Browser");
};

export const getRequestToken = () => {
  if (
    typeof kintone === "undefined" ||
    typeof kintone.getRequestToken !== "function"
  ) {
    throw new Error("session authentication must specify a request token");
  }
  return kintone.getRequestToken();
};

export const buildPlatformDependentConfig = () => {
  return {};
};

export const buildHeaders = () => {
  return {};
};
