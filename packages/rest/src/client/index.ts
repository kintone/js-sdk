import _createClient from "openapi-fetch";
import type { MediaType } from "openapi-typescript-helpers";
import type { KintoneClientOptions } from "./KintoneClientOptions";
import { buildNativeClientOptions } from "./KintoneClientOptions";
import { getCsrfMiddleware } from "./Middlewares/CsrfMiddleware";
import { KintoneClient } from "./KintoneClient";

export const createClient = <
  Paths extends {},
  Media extends MediaType = MediaType,
>(
  clientOptions: KintoneClientOptions,
): KintoneClient<Paths, Media> => {
  const nativeClientOptions = buildNativeClientOptions(clientOptions);
  const client = _createClient<Paths, Media>(nativeClientOptions);

  if (clientOptions.auth?.type == "session") {
    client.use(getCsrfMiddleware());
  }
  return client;
};
