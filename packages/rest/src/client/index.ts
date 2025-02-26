import _createClient from "openapi-fetch";
import type { MediaType } from "openapi-typescript-helpers";
import type { KintoneClientOptions } from "./KintoneClientOptions";
import { buildNativeClientOptions } from "./KintoneClientOptions";
import { getCsrfMiddleware } from "./Middlewares/CsrfMiddleware";
import { KintoneClient } from "./KintoneClient";
import { isSessionAuth } from "./KintoneClientOptions/Auth";
import { NativeInitParam } from "./KintoneClient/types/methods";

export const createClient = <
  Paths extends {},
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

  return {
    ...client,
    api: async (url, method, body) => {
      const _body =
        method === "get"
          ? ({
              params: {
                query: body,
              },
            } as NativeInitParam<Paths, typeof url, typeof method>)
          : ({
              body: body,
            } as NativeInitParam<Paths, typeof url, typeof method>);
      return client.request(method, url, _body);
    },
  };
};
