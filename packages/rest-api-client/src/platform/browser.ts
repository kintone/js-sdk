import { UnsupportedPlatformError } from "./UnsupportedPlatformError";

export const readFileFromPath = (filePath: string) => {
  throw new UnsupportedPlatformError("Browser");
};

export const createHttpsAgent = (pfx: Buffer, password: string) => {
  throw new UnsupportedPlatformError("Browser");
};
