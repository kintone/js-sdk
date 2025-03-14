import createNativeClient from "openapi-fetch";
import type { paths } from "../schemas/schema";
import type { MediaType } from "openapi-typescript-helpers";
import type { KintoneClientOptions } from "./KintoneClientOptions";
import type { NativeInitParam } from "./KintoneClient/types/api";
import type { KintoneClient } from "./KintoneClient";
import { buildNativeClientOptions } from "./KintoneClientOptions";
import { getCsrfMiddleware } from "./Middlewares/CsrfMiddleware";
import { isSessionAuth } from "./KintoneClientOptions/Auth";
import { getHttpMethodOverrideMiddleware } from "./Middlewares/HttpMethodOverrideMiddleware";

export const createClient = (clientOptions: KintoneClientOptions) => {
  return _createClient<paths>(clientOptions);
};

const _createClient = <Paths extends {}, Media extends MediaType = MediaType>(
  clientOptions: KintoneClientOptions,
): KintoneClient<Paths, Media> => {
  const nativeClientOptions = buildNativeClientOptions(clientOptions);
  const client = createNativeClient<Paths, Media>(
    nativeClientOptions,
  ) as KintoneClient<Paths, Media>;

  if (isSessionAuth(clientOptions.auth)) {
    client.use(getCsrfMiddleware());
  }
  client.use(getHttpMethodOverrideMiddleware());

  const api = async (url: any, method: any, body: any) => {
    const urlPath = typeof url === "object" && "path" in url ? url.path : url;
    const pathParams =
      typeof url === "object" && "guestSpaceId" in url
        ? { guestSpaceId: url.guestSpaceId }
        : null;
    let _body;
    if (pathParams == null) {
      switch (method) {
        case "get": {
          _body = {
            params: {
              query: body,
            },
          } as NativeInitParam<Paths[typeof urlPath], typeof method>;
          break;
        }
        default: {
          _body = {
            body: body,
          } as NativeInitParam<Paths[typeof urlPath], typeof method>;
          break;
        }
      }
    } else {
      switch (method) {
        case "get": {
          _body = {
            params: {
              path: pathParams,
              query: body,
            },
          } as NativeInitParam<Paths[typeof urlPath], typeof method>;
          break;
        }
        default: {
          _body = {
            params: {
              path: pathParams,
            },
            body: body,
          } as unknown as NativeInitParam<Paths[typeof urlPath], typeof method>;
          break;
        }
      }
    }
    return client.request(method, urlPath, _body);
  };

  return {
    ...client,
    api,
  };
};
