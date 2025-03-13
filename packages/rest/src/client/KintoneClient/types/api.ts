import type {
  FilterKeys,
  HttpMethod,
  MediaType,
  OperationRequestBodyContent,
} from "openapi-typescript-helpers";
import type {
  DefaultParamsOption,
  FetchOptions,
  FetchResponse,
} from "openapi-fetch";

export type KintoneApiMethod<
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
  Method extends MethodOfPath<Paths[SelectedPath]>,
  NativeInit extends NativeInitParam<Paths[SelectedPath], Method>,
>(
  url: Path,
  method: Method,
  params: Params<
    FilterKeys<Paths[SelectedPath], Method>,
    Method
  >
) => Promise<FetchResponse<Paths[SelectedPath][Method], NativeInit, Media>>;

export type NativeInitParam<
  Path extends Record<KintoneMethodType, {}>,
  Method extends KintoneMethodType,
> = FetchOptions<Path[Method]>;

type KintoneMethodType = Extract<HttpMethod, "get" | "post" | "put" | "delete">;

export type MethodOfPath<Path extends Record<string, any>> = {
  [Method in keyof Path]: Path[Method] extends never | undefined
    ? never
    : Method extends KintoneMethodType
      ? Method
      : never;
}[keyof Path];

export type Params<
  T,
  Method extends KintoneMethodType,
> = Method extends "get" ? KintoneQueryParameters<T> : KintoneRequestBody<T>;

type KintoneQueryParameters<T> = T extends {
  parameters: { query?: infer U };
}
  ? U
  : DefaultParamsOption;

type KintoneRequestBody<T> = OperationRequestBodyContent<T>;

export type PathExcludeGuestSpace<Paths extends {}> = {
  [Path in keyof Paths]: Path extends `${infer _}{guestSpaceId}${infer _}`
    ? never
    : Path;
}[keyof Paths];

export type PathForGuestSpace<Paths extends {}> = {
  [Path in keyof Paths]: Path extends `${infer _}{guestSpaceId}${infer _}`
    ? Path
    : never;
}[keyof Paths];
