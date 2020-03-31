import fs from "fs";
import { promisify } from "util";
import { basename } from "path";
import { UnsupportedPlatformError } from "./UnsupportedPlatformError";

const readFile = promisify(fs.readFile);

export const readFileFromPath = async (filePath: string) => {
  const data = await readFile(filePath);
  const name = basename(filePath);
  return { data, name };
};

export const getRequestToken = () => {
  throw new UnsupportedPlatformError("Node.js");
};
