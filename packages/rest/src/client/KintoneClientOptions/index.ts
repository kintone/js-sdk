import { Agent as HttpsAgent } from "undici";
import { buildAuth } from "./Auth";
import { buildUserAgent } from "./UserAgent";
import { buildTimeout } from "./SocketTimeout";

import type { ClientOptions } from "openapi-fetch";
import type { AuthOption, BasicAuthOption } from "./types/Auth";
import type { Proxy } from "./types/Proxy";
import type { ClientCertAuth } from "./types/CertAuth";
import { buildProxy } from "./Proxy";
import { buildHttpsAgent } from "./HttpsAgent";
import { buildCertAuth } from "./CertAuth";

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
  const authHeader = buildAuth(_clientOptions.auth ?? { type: "session" });
  const userAgentHeader =
    _clientOptions.userAgent !== undefined
      ? buildUserAgent(_clientOptions.userAgent)
      : {};
  const timeoutOption =
    _clientOptions.socketTimeout !== undefined
      ? buildTimeout(_clientOptions.socketTimeout)
      : {};
  const proxyOption =
    _clientOptions.proxy !== undefined ? buildProxy(_clientOptions.proxy) : {};
  const httpsAgentOption =
    _clientOptions.httpsAgent !== undefined
      ? buildHttpsAgent(_clientOptions.httpsAgent)
      : {};
  const certAuthOption =
    _clientOptions.certAuth !== undefined
      ? buildCertAuth(_clientOptions.certAuth)
      : {};

  return {
    fetch: _clientOptions.fetch,
    Request: _clientOptions.Request,
    querySerializer: _clientOptions.querySerializer,
    bodySerializer: _clientOptions.bodySerializer,
    baseUrl: _clientOptions.baseUrl,
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
