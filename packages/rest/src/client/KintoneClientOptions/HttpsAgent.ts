import type { Agent as HttpsAgent } from "undici";

export const buildHttpsAgent = (
  agent: HttpsAgent,
): { dispatcher: HttpsAgent } => {
  return { dispatcher: agent };
};
