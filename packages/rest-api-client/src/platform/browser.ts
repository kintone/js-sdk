import { UnsupportedPlatformError } from "./UnsupportedPlatformError";
import { DiscriminatedAuth } from "../KintoneRestAPIClient";

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
