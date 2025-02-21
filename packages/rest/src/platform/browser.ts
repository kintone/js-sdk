import type { DiscriminatedAuth } from "../types/auth";
import packageJson from "../../package.json";

declare var kintone: any;

export const getRequestToken = async () => {
  if (
    typeof kintone === "object" &&
    kintone !== null &&
    typeof kintone.getRequestToken === "function"
  ) {
    return kintone.getRequestToken();
  }

  throw new Error("session authentication must specify a request token");
};

export const getDefaultAuth = (): DiscriminatedAuth => {
  return {
    type: "session",
  };
};

export const buildHeaders = () => {
  return {};
};


export const getVersion = () => {
  return packageJson.version;
};
