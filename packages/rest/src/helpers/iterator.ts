import type {
  ClientMethod,
  FetchOptions,
  FetchResponse,
  MaybeOptionalInit,
} from "openapi-fetch";
import type {
  FilterKeys,
  HttpMethod,
  MediaType,
  PathsWithMethod,
} from "openapi-typescript-helpers";
import type {} from "../client/KintoneClient/types/api";
import type { KintoneClient } from "../client/KintoneClient";
import type {
  PathExcludeGuestSpace,
  PathForGuestSpace,
} from "../client/KintoneClient/types/path";
import type { MethodOfPath } from "../client/KintoneClient/types/util";
import type { KintoneMethodType } from "../client/KintoneClient/types/method";
import type { KintoneParams } from "../client/KintoneClient/types/param";

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

type CreateKintoneApiIteratorMethod<
  Paths extends Record<string, Record<HttpMethod, {}>>,
  Media extends MediaType,
> = <
  Path extends
    | PathExcludeGuestSpace<Paths>
    | { path: PathForGuestSpace<Paths>; guestSpaceId: number },
  SelectedPath extends Path extends { path: infer P }
    ? P extends keyof Paths
      ? P
      : never
    : Path,
  Method extends MethodOfPath<Paths[SelectedPath], KintoneMethodType>,
  ParamOrRequest extends KintoneParams<
    FilterKeys<Paths[SelectedPath], Method>,
    Method
  >,
  NativeInit extends FetchOptions<Paths[SelectedPath][Method]>,
>(
  url: Path,
  method: Method,
  body: ParamOrRequest,
  handleRequest: (
    previousInit: ParamOrRequest,
    previousResult: FetchResponse<
      Paths[SelectedPath][Method],
      NativeInit,
      Media
    > | null,
  ) => ParamOrRequest,
  hasNext: (
    init: ParamOrRequest,
    response: FetchResponse<
      Paths[SelectedPath][Method],
      NativeInit,
      Media
    > | null,
  ) => boolean,
) => AsyncGenerator<
  FetchResponse<Paths[SelectedPath][Method], NativeInit, Media>
>;

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
  api: CreateKintoneApiIteratorMethod<Paths, Media>;
}

export const iterator = <Paths extends {} = any, Media extends MediaType = any>(
  client: KintoneClient<Paths, Media>,
): ClientIterator<Paths, Media> => {
  // eslint-disable-next-line func-style
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

  // eslint-disable-next-line func-style
  async function* createKintoneApiIteratorMethod(
    url: any,
    handleRequest: (init: any, previousResult: any) => any,
    hasNext: (init: any, response: any) => boolean,
    init: any,
    method: any,
  ) {
    let _init = init;
    let response = null;
    while (true) {
      if (!hasNext(_init, response)) {
        return;
      }
      _init = handleRequest(_init, response);

      response = await client.api(url, method, _init);
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
    api: (url, method, init, handleRequest, hasNext) =>
      createKintoneApiIteratorMethod(url, handleRequest, hasNext, init, method),
  };
};
