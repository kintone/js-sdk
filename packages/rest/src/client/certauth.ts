import { Agent } from "undici";
import fs from "fs";
import { ClientCertAuth } from "../types/certauth";

export const buildCertAuth = (
  certAuth: ClientCertAuth,
): { dispatcher: Agent } => {
  const agent = new Agent({
    connect: {
      pfx:
        "pfx" in certAuth
          ? certAuth.pfx
          : fs.readFileSync("path/to/client-cert.pfx"),
      passphrase: certAuth.password,
    },
  });

  return { dispatcher: agent };
};
