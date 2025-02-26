import _createClient, {
  FetchResponse,
  MaybeOptionalInit,
} from "openapi-fetch";
import type {
  HttpMethod,
  MediaType,
} from "openapi-typescript-helpers";
import type { KintoneClientOptions } from "./KintoneClientOptions";
import { buildNativeClientOptions } from "./KintoneClientOptions";
import { getCsrfMiddleware } from "./Middlewares/CsrfMiddleware";
import { KintoneClient, MethodWithPath } from "./KintoneClient";
import { isSessionAuth } from "./KintoneClientOptions/Auth";

export const createClient = <
  Paths extends Record<string, Record<HttpMethod, {}>>,
  Media extends MediaType = MediaType,
>(
  clientOptions: KintoneClientOptions,
): KintoneClient<Paths, Media> => {
  const nativeClientOptions = buildNativeClientOptions(clientOptions);
  const client = _createClient<Paths, Media>(
    nativeClientOptions,
  ) as KintoneClient<Paths, Media>;

  if (isSessionAuth(clientOptions.auth)) {
    client.use(getCsrfMiddleware());
  }

  client.api = async <
    Path extends keyof Paths,
    Method extends MethodWithPath<Paths[Path]>,
    Init extends MaybeOptionalInit<Paths[Path], Method>,
  >(
    url: any,
    method: any,
    body: any,
  ): Promise<FetchResponse<Paths[Path][Method], Init, Media>> => {
    return client.request(method, url, body);
  };

  return client;
};
