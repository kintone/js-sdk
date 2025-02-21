import { ProxyAgent } from "undici";
import type { Proxy } from "../types/proxy";

export const buildProxy = (proxy: Proxy): { dispatcher: ProxyAgent } => {
  const protocol = proxy.protocol ?? "http";
  if (proxy.auth == undefined) {
    return {
      dispatcher: new ProxyAgent({
        uri: `${protocol}://${proxy.host}:${proxy.port}`,
      }),
    };
  }
  return {
    dispatcher: new ProxyAgent({
      uri: `${protocol}://${proxy.auth.username}:${proxy.auth.password}@${proxy.host}:${proxy.port}`,
    }),
  };
};
