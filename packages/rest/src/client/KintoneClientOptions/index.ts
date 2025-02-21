import { ClientOptions } from "openapi-fetch";
import { Agent as HttpsAgent } from "undici";
import type { Proxy } from "./types/Proxy";
import type { ClientCertAuth } from "./types/CertAuth";
import type { AuthOption, BasicAuthOption } from "./types/Auth";
import { buildAuth } from "./Auth";
import { buildProxy } from "./Proxy";
import { buildCertAuth } from "./CertAuth";

export interface KintoneClientOptions extends ClientOptions {
  auth?: AuthOption;
  basicAuth?: BasicAuthOption;
  proxy?: Proxy;
  httpsAgent?: HttpsAgent;
  clientCertAuth?: ClientCertAuth;
  userAgent?: string;
  socketTimeout?: number;
}

export const buildNativeClientOptions = (
  _clientOptions: KintoneClientOptions,
): ClientOptions => {
  const authHeader =
    _clientOptions.auth !== undefined ? buildAuth(_clientOptions.auth) : {};
  const userAgentHeader =
    _clientOptions.userAgent !== undefined
      ? { "User-Agent": _clientOptions.userAgent }
      : {};
  const timeoutOption =
    _clientOptions.socketTimeout !== undefined
      ? { signal: AbortSignal.timeout(_clientOptions.socketTimeout) }
      : {};
  const proxyOption =
    _clientOptions.proxy !== undefined ? buildProxy(_clientOptions.proxy) : {};
  // TODO: dispatcherを２つ以上定義していたらエラーにした方が良い
  const httpsAgentOption =
    _clientOptions.httpsAgent !== undefined
      ? { dispatcher: _clientOptions.httpsAgent }
      : {};
  const clientCertAuthOption =
    _clientOptions.clientCertAuth !== undefined
      ? buildCertAuth(_clientOptions.clientCertAuth)
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
      ...clientCertAuthOption,
    },
    ...timeoutOption,
  };
};
