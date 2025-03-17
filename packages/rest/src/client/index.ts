import createNativeClient from "openapi-fetch";
import { buildNativeClientOptions } from "./KintoneClientOptions";
import { getCsrfMiddleware } from "./Middlewares/CsrfMiddleware";
import { isSessionAuth } from "./KintoneClientOptions/Auth";
import { getHttpMethodOverrideMiddleware } from "./Middlewares/HttpMethodOverrideMiddleware";
import type { paths } from "../schemas/schema";
import type { MediaType } from "openapi-typescript-helpers";
import type { KintoneClientOptions } from "./KintoneClientOptions";
import type { KintoneApiMethod } from "./KintoneClient/types/api";
import type { KintoneClient } from "./KintoneClient";
import type { GuestSpaceParams } from "./KintoneClient/types/param";

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

  const api: KintoneApiMethod<Paths, Media> = async (url, method, body) => {
    const isGuestSpaceApi = (_url: any): _url is GuestSpaceParams<Paths> => {
      return typeof _url === "object" && "guestSpaceId" in _url;
    };
    let _body;
    if (isGuestSpaceApi(url)) {
      const pathParams = { guestSpaceId: url.guestSpaceId };
      switch (method) {
        case "get": {
          _body = {
            params: {
              path: pathParams,
              query: body,
            },
          };
          return client.request(method, url.path as any, _body as any);
        }
        case "post":
        case "put":
        case "delete": {
          _body = {
            params: {
              path: pathParams,
            },
            body: body,
          };
          return client.request(method, url.path as any, _body as any);
        }
        default: {
          throw new Error(method satisfies never);
        }
      }
    } else {
      switch (method) {
        case "get": {
          _body = {
            params: {
              query: body,
            },
          };
          return client.request(method, url as any, _body as any);
        }
        case "post":
        case "put":
        case "delete": {
          _body = {
            body: body,
          };
          return client.request(method, url as any, _body as any);
        }
        default: {
          throw new Error(method satisfies never);
        }
      }
    }
  };

  return {
    ...client,
    api,
  };
};
