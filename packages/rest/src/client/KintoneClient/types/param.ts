import type { DefaultParamsOption } from "openapi-fetch";
import type { KintoneMethodType } from "./method";
import type { OperationRequestBodyContent } from "openapi-typescript-helpers";
import type { PathForGuestSpace } from "./path";

export type GuestSpaceParams<Paths extends {}> = {
  path: PathForGuestSpace<Paths>;
  guestSpaceId: number;
};

export type KintoneParams<
  T,
  Method extends KintoneMethodType,
> = Method extends "get" ? KintoneQueryParameters<T> : KintoneRequestBody<T>;

type KintoneQueryParameters<T> = T extends {
  parameters: { query?: infer U };
}
  ? U
  : DefaultParamsOption;

type KintoneRequestBody<T> = OperationRequestBodyContent<T>;
