import { ClientOptions } from "openapi-fetch";
import type {
  DiscriminatedAuth,
  BasicAuth,
  ClientCertAuth,
} from "../../types/auth";
import type { ProxyConfig } from "../../types/proxy";
import { Agent as HttpsAgent } from "https";

import { buildAuth } from "./auth";

type OmitTypePropertyFromUnion<T> = T extends unknown ? Omit<T, "type"> : never;
type Auth = OmitTypePropertyFromUnion<DiscriminatedAuth>;

export interface KintoneClientOptions extends ClientOptions {
  auth?: Auth;
  basicAuth?: BasicAuth;
  proxy?: ProxyConfig;
  httpsAgent?: HttpsAgent;
  clientCertAuth?: ClientCertAuth;
  userAgent?: string;
  socketTimeout?: number;
}

export const buildNativeClientOptions = (_clientOptions: KintoneClientOptions): ClientOptions => {
  return {
    ...buildAuth(_clientOptions.auth ?? {}),
    baseUrl: _clientOptions.baseUrl,
    headers: _clientOptions.headers,
    fetch: _clientOptions.fetch,
    Request: _clientOptions.Request,
    querySerializer: _clientOptions.querySerializer,
    bodySerializer: _clientOptions.bodySerializer,
    requestInitExt: _clientOptions.requestInitExt,
  };
}
