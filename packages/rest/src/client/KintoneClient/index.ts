import type { Client } from "openapi-fetch";
import type { MediaType } from "openapi-typescript-helpers";

export interface KintoneClient<
  Paths extends {},
  Media extends MediaType = MediaType,
> extends Client<Paths, Media> {}
