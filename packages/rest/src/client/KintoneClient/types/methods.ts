import { FilterKeys, HttpMethod, MediaType, OperationRequestBodyContent, PathsWithMethod } from "openapi-typescript-helpers";
import { DefaultParamsOption, FetchResponse, MaybeOptionalInit } from "openapi-fetch";


export type KintoneApiMethoda<
  Paths extends Record<string, Record<HttpMethod, {}>>,
  Media extends MediaType,
> = <
  Path extends PathsWithMethod<Paths, Method>,
  Method extends MethodWithPath<Paths[Path]> & HttpMethod,
  ParamOrRequest extends KintoneBody<FilterKeys<Paths[Path], Method>, Method>,
  Init extends MaybeOptionalInit<Paths[Path], Method> & {
    [key: string]: unknown;
  },
>(
  url: Path,
  method: Method,
  body: ParamOrRequest,
) => Promise<FetchResponse<Paths[Path][Method], Init, Media>>;

export type NativeInitParam<Paths extends Record<string, Record<HttpMethod, {}>>, Path extends PathsWithMethod<Paths, Method>,  Method extends HttpMethod> = 
  MaybeOptionalInit<Paths[Path], Method> & {
    [key: string]: unknown;
  };

type KintoneBody<T, Method extends HttpMethod> = Method extends "get"
  ? ParamsOption<T>
  : RequestBodyOption<T>;

type ParamsOption<T> = T extends {
  parameters: { query: any };
}
  ? T["parameters"]["query"]
  : DefaultParamsOption;

type RequestBodyOption<T> =
  OperationRequestBodyContent<T> extends never
    ? never
    : OperationRequestBodyContent<T>;

type MethodWithPath<Path extends Record<string, any>> = {
  [Method in keyof Path]: Path[Method] extends never | undefined
    ? never
    : Method extends "get" | "post" | "put" | "delete"
      ? Method
      : never;
}[keyof Path];

