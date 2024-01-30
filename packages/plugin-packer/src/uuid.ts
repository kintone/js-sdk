import crypto from "crypto";
import { hex2a } from "./hex2a";

export const uuid = async (publicKey: Buffer): Promise<string> => {
  const data = new TextEncoder().encode(publicKey.toString());
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashHex = Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32);

  return hex2a(hashHex);
};
