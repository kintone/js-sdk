import type { Client } from "openapi-fetch";
import createNativeClient from "openapi-fetch";
import type { paths } from "../schemas/schema.js";
import type { MediaType } from "openapi-typescript-helpers";
import {
  buildNativeClientOptions,
  type KintoneClientOptions,
} from "./KintoneClientOptions/index.js";
import { getCsrfMiddleware } from "./Middlewares/CsrfMiddleware.js";
import { isSessionAuth } from "./KintoneClientOptions/Auth.js";
import { getHttpMethodOverrideMiddleware } from "./Middlewares/HttpMethodOverrideMiddleware.js";
import { getFormDataBodySerializer } from "./BodySerializer/FormDataBodySerializer.js";

export const createClient = (
  clientOptions: KintoneClientOptions = {},
): Client<paths> => {
  return _createClient<paths>(clientOptions);
};

const _createClient = <Paths extends {}, Media extends MediaType = MediaType>(
  clientOptions: KintoneClientOptions,
): Client<Paths, Media> => {
  const nativeClientOptions = buildNativeClientOptions(clientOptions);
  nativeClientOptions.bodySerializer = getFormDataBodySerializer();
  const client = createNativeClient<Paths, Media>(nativeClientOptions);

  if (isSessionAuth(clientOptions.auth)) {
    client.use(getCsrfMiddleware());
  }
  client.use(getHttpMethodOverrideMiddleware());

  return client;
};
