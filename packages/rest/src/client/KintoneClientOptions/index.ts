import type { Agent as HttpsAgent } from "undici";
import { buildAuth } from "./Auth.js";

import type { ClientOptions } from "openapi-fetch";
import type { AuthOption, BasicAuthOption } from "./types/Auth.js";
import type { Proxy } from "./types/Proxy.js";
import type { ClientCertAuth } from "./types/CertAuth.js";
import { buildHttpsAgent } from "./HttpsAgent.js";
import { platformDeps } from "../../platform/index.js";

export type KintoneClientOptions = ClientOptions & {
  auth?: AuthOption;
  basicAuth?: BasicAuthOption;
  userAgent?: string;
  socketTimeout?: number;
} & (
    | {
        proxy?: Proxy;
        httpsAgent?: never;
        clientCertAuth?: never;
      }
    | {
        proxy?: never;
        httpsAgent?: HttpsAgent;
        clientCertAuth?: never;
      }
    | {
        proxy?: never;
        httpsAgent?: never;
        clientCertAuth?: ClientCertAuth;
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
    _clientOptions.proxy !== undefined
      ? platformDeps.buildProxy(_clientOptions.proxy)
      : {};
  const httpsAgentOption =
    _clientOptions.httpsAgent !== undefined
      ? buildHttpsAgent(_clientOptions.httpsAgent)
      : {};
  const certAuthOption =
    _clientOptions.clientCertAuth !== undefined
      ? platformDeps.buildCertAuth(_clientOptions.clientCertAuth)
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
