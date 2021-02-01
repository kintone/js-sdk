import crypto from "crypto";
import { hex2a } from "./hex2a";

export function uuid(publicKey: Buffer): string {
  const hash = crypto.createHash("sha256");
  hash.update(publicKey);
  const hexId = hash.digest().toString("hex").slice(0, 32);
  return hex2a(hexId);
}
