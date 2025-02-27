import type {
  FilterKeys,
  HttpMethod,
  MediaType,
  OperationRequestBodyContent,
  PathsWithMethod,
} from "openapi-typescript-helpers";
import type {
  DefaultParamsOption,
  FetchResponse,
  MaybeOptionalInit,
} from "openapi-fetch";

export type KintoneApiMethod<
  Paths extends Record<string, Record<HttpMethod, {}>>,
  Media extends MediaType,
> = <
  Path extends PathsWithMethod<Paths, Method>,
  Method extends MethodOfPath<Paths[Path]>,
  ParamOrRequest extends KintoneBody<FilterKeys<Paths[Path], Method>, Method>,
  NativeInit extends NativeInitParam<Paths, Path, Method>,
>(
  url: Path,
  method: Method,
  body: ParamOrRequest,
) => Promise<FetchResponse<Paths[Path][Method], NativeInit, Media>>;

export type NativeInitParam<
  Paths extends Record<string, Record<HttpMethod, {}>>,
  Path extends PathsWithMethod<Paths, Method>,
  Method extends HttpMethod,
> = MaybeOptionalInit<Paths[Path], Method> & {
  [key: string]: unknown;
};

type KintoneMethodType = Extract<HttpMethod, "get" | "post" | "put" | "delete">;

type MethodOfPath<Path extends Record<string, any>> = {
  [Method in keyof Path]: Path[Method] extends never | undefined
    ? never
    : Method extends KintoneMethodType
      ? Method
      : never;
}[keyof Path];

type KintoneBody<T, Method extends KintoneMethodType> = Method extends "get"
  ? KintoneParams<T>
  : KintoneRequestBody<T>;

type KintoneParams<T> = T extends {
  parameters: { query: any };
}
  ? T["parameters"]["query"]
  : DefaultParamsOption;

type KintoneRequestBody<T> =
  OperationRequestBodyContent<T> extends never
    ? never
    : OperationRequestBodyContent<T>;
