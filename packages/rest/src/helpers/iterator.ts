import type { Client, FetchResponse, MaybeOptionalInit } from "openapi-fetch";
import type {
  HttpMethod,
  MediaType,
  PathsWithMethod,
} from "openapi-typescript-helpers";

type InitParam<Init> = Init & { [key: string]: unknown };

type CreateIteratorMethod<
  Paths extends Record<string, Record<HttpMethod, {}>>,
  Method extends HttpMethod,
  Media extends MediaType,
> = <
  Path extends PathsWithMethod<Paths, Method>,
  Init extends MaybeOptionalInit<Paths[Path], Method>,
>(
  url: Path,
  handleRequest: (
    previousInit: InitParam<Init>,
    previousResult: FetchResponse<Paths[Path][Method], Init, Media> | null,
  ) => InitParam<Init>,
  hasNext: (
    init: InitParam<Init>,
    response: FetchResponse<Paths[Path][Method], Init, Media> | null,
  ) => boolean,
  init: InitParam<Init>,
) => AsyncGenerator<FetchResponse<Paths[Path][Method], Init, Media>>;

type CreateRequestIteratorMethod<
  Paths extends Record<string, Record<HttpMethod, {}>>,
  Media extends MediaType,
> = <
  Method extends HttpMethod,
  Path extends PathsWithMethod<Paths, Method>,
  Init extends MaybeOptionalInit<Paths[Path], Method>,
>(
  method: Method,
  url: Path,
  handleRequest: (
    previousInit: InitParam<Init>,
    previousResult: FetchResponse<Paths[Path][Method], Init, Media> | null,
  ) => InitParam<Init>,
  hasNext: (
    init: InitParam<Init>,
    response: FetchResponse<Paths[Path][Method], Init, Media> | null,
  ) => boolean,
  init: InitParam<Init>,
) => AsyncGenerator<FetchResponse<Paths[Path][Method], Init, Media>>;

interface ClientIterator<
  Paths extends {} = any,
  Media extends MediaType = any,
> {
  request: CreateRequestIteratorMethod<Paths, Media>;
  GET: CreateIteratorMethod<Paths, "get", Media>;
  PUT: CreateIteratorMethod<Paths, "put", Media>;
  POST: CreateIteratorMethod<Paths, "post", Media>;
  DELETE: CreateIteratorMethod<Paths, "delete", Media>;
  OPTIONS: CreateIteratorMethod<Paths, "options", Media>;
  HEAD: CreateIteratorMethod<Paths, "head", Media>;
  PATCH: CreateIteratorMethod<Paths, "patch", Media>;
  TRACE: CreateIteratorMethod<Paths, "trace", Media>;
}

export const iterator = <Paths extends {} = any, Media extends MediaType = any>(
  client: Client<Paths, Media>,
): ClientIterator<Paths, Media> => {
  // eslint-disable-next-line func-style
  async function* createRequestIteratorMethod(
    method: HttpMethod,
    url: any,
    handleRequest: (init: any, previousResult: any) => any,
    hasNext: (init: any, response: any) => boolean,
    init: any,
  ) {
    let _init = init;
    let response = null;
    while (true) {
      if (!hasNext(_init, response)) {
        return;
      }
      _init = handleRequest(_init, response);

      response = await client.request(method, url, _init);
      yield response;
    }
  }

  return {
    request: (method, url, handleRequest, hasNext, init) =>
      createRequestIteratorMethod(method, url, handleRequest, hasNext, init),
    GET: (url, handleRequest, hasNext, init) =>
      createRequestIteratorMethod("get", url, handleRequest, hasNext, init),
    PUT: (url, handleRequest, hasNext, init) =>
      createRequestIteratorMethod("put", url, handleRequest, hasNext, init),
    POST: (url, handleRequest, hasNext, init) =>
      createRequestIteratorMethod("post", url, handleRequest, hasNext, init),
    DELETE: (url, handleRequest, hasNext, init) =>
      createRequestIteratorMethod("delete", url, handleRequest, hasNext, init),
    OPTIONS: (url, handleRequest, hasNext, init) =>
      createRequestIteratorMethod("options", url, handleRequest, hasNext, init),
    HEAD: (url, handleRequest, hasNext, init) =>
      createRequestIteratorMethod("head", url, handleRequest, hasNext, init),
    PATCH: (url, handleRequest, hasNext, init) =>
      createRequestIteratorMethod("patch", url, handleRequest, hasNext, init),
    TRACE: (url, handleRequest, hasNext, init) =>
      createRequestIteratorMethod("trace", url, handleRequest, hasNext, init),
  };
};
