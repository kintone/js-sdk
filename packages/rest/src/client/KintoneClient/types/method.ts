import type { HttpMethod } from "openapi-typescript-helpers";

export type KintoneMethodType = Extract<
  HttpMethod,
  "get" | "post" | "put" | "delete"
>;
