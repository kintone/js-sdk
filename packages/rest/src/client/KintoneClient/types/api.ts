import type { FilterKeys, MediaType } from "openapi-typescript-helpers";
import type { FetchOptions, FetchResponse } from "openapi-fetch";
import type { PathExcludeGuestSpace, PathForGuestSpace } from "./path";
import type { KintoneMethodType } from "./method";
import type { MethodOfPath, Selected } from "./util";
import type { KintoneParams } from "./param";

export type KintoneApiMethod<
  Paths extends {
    [path: string]: Partial<Record<KintoneMethodType, Record<string, any>>>;
  },
  Media extends MediaType,
> = <
  Path extends
    | PathExcludeGuestSpace<Paths>
    | { path: PathForGuestSpace<Paths>; guestSpaceId: number },
  SelectedPath extends Selected<Paths, Path>,
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
) => Promise<
  FetchResponse<
    Exclude<Paths[Selected<Paths, Path>][Method], undefined>,
    NativeInit,
    Media
  >
>;
