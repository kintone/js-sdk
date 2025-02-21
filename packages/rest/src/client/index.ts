import _createClient from "openapi-fetch";
import type { Client } from "openapi-fetch";
import type { MediaType } from "openapi-typescript-helpers";
import { buildNativeClientOptions, KintoneClientOptions } from "./KintoneClientOptions";
import { isSession } from "./KintoneClientOptions/Auth";
import { getCsrfMiddleware } from "./Middlewares/CsrfMiddleware";

export const createClient = <
  Paths extends {},
  Media extends MediaType = MediaType,
>(
  clientOptions: KintoneClientOptions,
): Client<Paths, Media> => {

  const nativeClientOptions = buildNativeClientOptions(clientOptions);
  const client = _createClient<Paths, Media>(nativeClientOptions);

  if (isSession(clientOptions.auth ?? {})) {
    client.use(getCsrfMiddleware());
  }
  return client;
};

