import { UnsupportedPlatformError } from "./UnsupportedPlatformError";

export const readFileFromPath = (filePath: string) => {
  throw new UnsupportedPlatformError("Browser");
};

export const buildPlatformDependentConfig = () => {
  return {};
};
