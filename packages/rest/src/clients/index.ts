import _createClient, { ClientOptions, MiddlewareCallbackParams } from "openapi-fetch";
import { platformDeps } from "../platform";

import type {
  DiscriminatedAuth,
  BasicAuth,
  ClientCertAuth,
} from "../types/auth";
import type { Client } from "openapi-fetch";
import type { MediaType } from "openapi-typescript-helpers";
import { buildNativeClientOptions, KintoneClientOptions } from "./KintoneClientOptions";
import { isSession } from "./auth";

type OmitTypePropertyFromUnion<T> = T extends unknown ? Omit<T, "type"> : never;
type Auth = OmitTypePropertyFromUnion<DiscriminatedAuth>;

export const createClient = <
  Paths extends {},
  Media extends MediaType = MediaType,
>(
  clientOptions: KintoneClientOptions,
): Client<Paths, Media> => {

  const nativeClientOptions = buildNativeClientOptions(clientOptions);

  const client = _createClient<Paths, Media>(nativeClientOptions);

  if (isSession(clientOptions.auth ?? {})) {
    client.use(csrfMiddleware);
  }
  return client;
};

const csrfMiddleware = {
  async onRequest({ request }: MiddlewareCallbackParams) {
    const body: any = await request.json();

    body["__REQUEST_TOKEN__"] = await platformDeps.getRequestToken();
    return new Request(request.url, {
      method: request.method,
      headers: request.headers,
      body: JSON.stringify(body),
    });
  },
};

