import type { Client } from "openapi-fetch";
import type { MediaType } from "openapi-typescript-helpers";
import { KintoneApiMethoda } from "./types/methods";

export interface KintoneClient<
  Paths extends {},
  Media extends MediaType = MediaType,
> extends Client<Paths, Media> {
  api: KintoneApiMethoda<Paths, Media>;
}
