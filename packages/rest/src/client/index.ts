import createNativeClient from "openapi-fetch";
import type { paths } from "../schemas/schema";
import type { MediaType } from "openapi-typescript-helpers";
import type { KintoneClientOptions } from "./KintoneClientOptions";
import type {
  KintoneApiMethod,
  NativeInitParam,
} from "./KintoneClient/types/api";
import type { KintoneClient } from "./KintoneClient";
import { buildNativeClientOptions } from "./KintoneClientOptions";
import { getCsrfMiddleware } from "./Middlewares/CsrfMiddleware";
import { isSessionAuth } from "./KintoneClientOptions/Auth";
import { getHttpMethodOverrideMiddleware } from "./Middlewares/HttpMethodOverrideMiddleware";

const validateClientOptions = (options: KintoneClientOptions) => {
  if (!options.baseUrl) {
    throw new Error("baseUrl is required");
  }

  if (options.auth?.type === "password") {
    if (!options.auth.username || !options.auth.password) {
      throw new Error("username and password are required for password authentication");
    }
  }
};

export const createClient = (clientOptions: KintoneClientOptions) => {
  validateClientOptions(clientOptions);
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
  };

  return {
    ...client,
    api,
  };
};
