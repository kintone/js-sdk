import { ClientOptions } from "openapi-fetch";
import type { DiscriminatedAuth, BasicAuth } from "../types/auth";
import type { Proxy } from "../types/proxy";
import { Agent as HttpsAgent } from "undici";
import { buildAuth } from "./auth";
import { buildProxy } from "./proxy";
import { buildCertAuth } from "./certauth";
import { ClientCertAuth } from "../types/certauth";

type OmitTypePropertyFromUnion<T> = T extends unknown ? Omit<T, "type"> : never;
type Auth = OmitTypePropertyFromUnion<DiscriminatedAuth>;

export interface KintoneClientOptions extends ClientOptions {
  auth?: Auth;
  basicAuth?: BasicAuth;
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
