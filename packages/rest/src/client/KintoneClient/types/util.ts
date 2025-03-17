import type { HttpMethod } from "openapi-typescript-helpers";

export type MethodOfPath<
  Path extends Record<string, any>,
  _Method extends HttpMethod,
> = {
  [Method in keyof Path]: Path[Method] extends never | undefined
    ? never
    : Method extends _Method
      ? Method
      : never;
}[keyof Path];

export type Selected<Paths, T> = T extends { path: infer P }
  ? P extends keyof Paths
    ? P
    : never
  : T;
