import type {
  Client,
  ClientMethod,
  FetchResponse,
  MaybeOptionalInit,
} from "openapi-fetch";
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

interface ClientIterator<
  Paths extends {} = any,
  Media extends MediaType = any,
> {
  GET: CreateIteratorMethod<Paths, "get", Media>;
  PUT: CreateIteratorMethod<Paths, "put", Media>;
  POST: CreateIteratorMethod<Paths, "post", Media>;
  DELETE: CreateIteratorMethod<Paths, "delete", Media>;
  OPTIONS: CreateIteratorMethod<Paths, "options", Media>;
  HEAD: CreateIteratorMethod<Paths, "head", Media>;
  PATCH: CreateIteratorMethod<Paths, "patch", Media>;
  TRACE: CreateIteratorMethod<Paths, "trace", Media>;
}

export function iterator<Paths extends {} = any, Media extends MediaType = any>(
  client: Client<Paths, Media>,
): ClientIterator<Paths, Media> {
  async function* createIteratorMethod<Method extends HttpMethod>(
    url: any,
    handleRequest: (init: any, previousResult: any) => any,
    hasNext: (init: any, response: any) => boolean,
    init: any,
    method: ClientMethod<Paths, Method, Media>,
  ) {
    let _init = init;
    let response = null;
    while (true) {
      if (!hasNext(_init, response)) {
        return;
      }
      _init = handleRequest(_init, response);
      response = await method(url, _init);
      yield response;
    }
  }

  return {
    GET: (url, handleRequest, hasNext, init) =>
      createIteratorMethod<"get">(
        url,
        handleRequest,
        hasNext,
        init,
        client.GET,
      ),
    PUT: (url, handleRequest, hasNext, init) =>
      createIteratorMethod<"put">(
        url,
        handleRequest,
        hasNext,
        init,
        client.PUT,
      ),
    POST: (url, handleRequest, hasNext, init) =>
      createIteratorMethod<"post">(
        url,
        handleRequest,
        hasNext,
        init,
        client.POST,
      ),
    DELETE: (url, handleRequest, hasNext, init) =>
      createIteratorMethod<"delete">(
        url,
        handleRequest,
        hasNext,
        init,
        client.DELETE,
      ),
    OPTIONS: (url, handleRequest, hasNext, init) =>
      createIteratorMethod<"options">(
        url,
        handleRequest,
        hasNext,
        init,
        client.OPTIONS,
      ),
    HEAD: (url, handleRequest, hasNext, init) =>
      createIteratorMethod<"head">(
        url,
        handleRequest,
        hasNext,
        init,
        client.HEAD,
      ),
    PATCH: (url, handleRequest, hasNext, init) =>
      createIteratorMethod<"patch">(
        url,
        handleRequest,
        hasNext,
        init,
        client.PATCH,
      ),
    TRACE: (url, handleRequest, hasNext, init) =>
      createIteratorMethod<"trace">(
        url,
        handleRequest,
        hasNext,
        init,
        client.TRACE,
      ),
  };
}
