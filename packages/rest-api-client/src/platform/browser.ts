import { UnsupportedPlatformError } from "./UnsupportedPlatformError";
import { DiscriminatedAuth } from "../KintoneRestAPIClient";

export const readFileFromPath = (filePath: string) => {
  throw new UnsupportedPlatformError("Browser");
};

export const getRequestToken = async () => {
  if (
    typeof kintone === "object" &&
    typeof kintone.getRequestToken === "function"
  ) {
    return kintone.getRequestToken();
  }

  if (
    typeof garoon === "object" &&
    typeof garoon.connect === "object" &&
    typeof garoon.connect.kintone === "object" &&
    typeof garoon.connect.kintone.getRequestToken === "function"
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
