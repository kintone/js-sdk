import { Agent } from "undici";
import fs from "fs";
import type { ClientCertAuth } from "./types/CertAuth";

export const buildCertAuth = (
  certAuth: ClientCertAuth,
): { dispatcher: Agent } => {
  const agent = new Agent({
    connect: {
      pfx:
        "pfx" in certAuth
          ? certAuth.pfx
          : fs.readFileSync(certAuth.pfxFilePath),
      passphrase: certAuth.password,
    },
  });

  return { dispatcher: agent };
};
