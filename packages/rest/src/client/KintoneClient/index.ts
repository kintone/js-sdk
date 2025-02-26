import type { Client, MaybeOptionalInit, FetchResponse } from "openapi-fetch";
import type { MediaType, HttpMethod } from "openapi-typescript-helpers";

export interface KintoneClient<
  Paths extends {},
  Media extends MediaType = MediaType,
> extends Client<Paths, Media> {
  api: KintoneClientMethod<Paths, Media>;
}

export type MethodWithPath<Path extends Record<string, any>> = {
  [Method in keyof Path]: Path[Method] extends never | undefined
    ? never
    : Method extends "get" | "post" | "put" | "delete"
      ? Method
      : never;
}[keyof Path];

export type KintoneClientMethod<
  Paths extends Record<string, Record<HttpMethod, {}>>,
  Media extends MediaType,
> = <
  Path extends keyof Paths,
  Method extends MethodWithPath<Paths[Path]>,
  Init extends MaybeOptionalInit<Paths[Path], Method>,
>(
  url: Path,
  method: Method,
  body: Init & { [key: string]: unknown },
) => Promise<FetchResponse<Paths[Path][Method], Init, Media>>;
