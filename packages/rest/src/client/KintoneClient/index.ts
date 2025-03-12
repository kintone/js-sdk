import type { Client } from "openapi-fetch";
import type { MediaType } from "openapi-typescript-helpers";
import type { KintoneApiMethod } from "./types/api";

export interface KintoneClient<
  Paths extends {},
  Media extends MediaType = MediaType,
> extends Client<Paths, Media> {
  api: KintoneApiMethod<Paths, Media>;
}
