import fs from "fs";
import { promisify } from "util";
import { basename } from "path";
import https from "https";

const readFile = promisify(fs.readFile);

export const readFileFromPath = async (filePath: string) => {
  const data = await readFile(filePath);
  const name = basename(filePath);
  return { data, name };
};

export const createHttpsAgent = (pfx: Buffer, password: string) => {
  return new https.Agent({
    pfx,
    passphrase: password,
  });
};
