import type { Agent as HttpsAgent } from "undici";
import { buildAuth } from "./Auth";

import type { ClientOptions } from "openapi-fetch";
import type { AuthOption, BasicAuthOption } from "./types/Auth";
import type { Proxy } from "./types/Proxy";
import type { ClientCertAuth } from "./types/CertAuth";
import { buildProxy } from "./Proxy";
import { buildHttpsAgent } from "./HttpsAgent";
import { platformDeps } from "../../platform";

export type KintoneClientOptions = ClientOptions & {
  auth?: AuthOption;
  basicAuth?: BasicAuthOption;
  userAgent?: string;
  socketTimeout?: number;
} & (
    | {
        proxy?: Proxy;
        httpsAgent?: never;
        certAuth?: never;
      }
    | {
        proxy?: never;
        httpsAgent?: HttpsAgent;
        certAuth?: never;
      }
    | {
        proxy?: never;
        httpsAgent?: never;
        certAuth?: ClientCertAuth;
      }
  );

export const buildNativeClientOptions = (
  _clientOptions: KintoneClientOptions,
): ClientOptions => {
  const baseUrl = platformDeps
    .buildBaseUrl(_clientOptions.baseUrl)
    .replace(/\/+$/, ""); // Remove trailing slash
  const authHeader = buildAuth(
    _clientOptions.auth ?? platformDeps.getDefaultAuth(),
  );
  const userAgentHeader = platformDeps.buildUserAgentHeader({
    userAgent: _clientOptions.userAgent,
  });
  const timeoutOption =
    _clientOptions.socketTimeout !== undefined
      ? platformDeps.buildTimeoutHeader({
          socketTimeout: _clientOptions.socketTimeout,
        })
      : {};
  const proxyOption =
    _clientOptions.proxy !== undefined ? buildProxy(_clientOptions.proxy) : {};
  const httpsAgentOption =
    _clientOptions.httpsAgent !== undefined
      ? buildHttpsAgent(_clientOptions.httpsAgent)
      : {};
  const certAuthOption =
    _clientOptions.certAuth !== undefined
      ? platformDeps.buildCertAuth(_clientOptions.certAuth)
      : {};

  return {
    fetch: _clientOptions.fetch,
    Request: _clientOptions.Request,
    querySerializer: _clientOptions.querySerializer,
    bodySerializer: _clientOptions.bodySerializer,
    baseUrl: baseUrl,
    headers: {
      ..._clientOptions.headers,
      ...authHeader,
      ...userAgentHeader,
    },
    requestInitExt: {
      ..._clientOptions.requestInitExt,
      ...proxyOption,
      ...httpsAgentOption,
      ...certAuthOption,
    },
    ...timeoutOption,
  };
};
