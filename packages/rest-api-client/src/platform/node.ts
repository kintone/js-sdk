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

export const buildPlatformDependentConfig = (params: {
  clientCertAuth?: {
    pfx: Buffer;
    password: string;
  };
}) => {
  if (params.clientCertAuth) {
    const httpsAgent = new https.Agent({
      pfx: params.clientCertAuth.pfx,
      passphrase: params.clientCertAuth.password,
    });
    return { httpsAgent };
  }
  return {};
};
