import type { Client } from "openapi-fetch";
import createNativeClient from "openapi-fetch";
import type { paths } from "../schemas/schema";
import type { MediaType } from "openapi-typescript-helpers";
import {
  buildNativeClientOptions,
  type KintoneClientOptions,
} from "./KintoneClientOptions";
import { getCsrfMiddleware } from "./Middlewares/CsrfMiddleware";
import { isSessionAuth } from "./KintoneClientOptions/Auth";
import { getHttpMethodOverrideMiddleware } from "./Middlewares/HttpMethodOverrideMiddleware";
import { getFormDataBodySerializer } from "./BodySerializer/FormDataBodySerializer";

export const createClient = (
  clientOptions: KintoneClientOptions,
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
