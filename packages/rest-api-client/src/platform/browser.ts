import { UnsupportedPlatformError } from "./UnsupportedPlatformError";
import type { DiscriminatedAuth } from "../types/auth";
import mime from "mime/lite";
import packageJson from "../../package.json";

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

export const buildFormDataValue = (data: unknown, fileName?: string) => {
  const options: BlobPropertyBag = {};
  if (fileName) {
    options.type = mime.getType(fileName) || undefined;
  }

  return new Blob([data as BlobPart], options);
};

export const buildBaseUrl = (baseUrl?: string) => {
  if (baseUrl) {
    return baseUrl;
  }

  if (location === undefined) {
    throw new Error("The baseUrl parameter is required for this environment");
  }

  const { host, protocol } = location;

  return `${protocol}//${host}`;
};

export const getVersion = () => {
  return packageJson.version;
};

export const buildFetchDispatcher = () => {
  return undefined;
};

// buildFetchDispatcher() above never returns a dispatcher in the browser, so
// this is never actually invoked; it exists to satisfy the platformDeps
// interface shared with the Node.js implementation.
export const fetchWithDispatcher = (url: string, options: RequestInit) =>
  fetch(url, options);

export const buildFetchFormData = async (
  data: unknown,
): Promise<{ body: unknown; contentType?: string } | null> => {
  if (data instanceof FormData) {
    return { body: data };
  }
  return null;
};
