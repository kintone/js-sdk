import type { SearchRequest, SearchResponse } from "./types";
import { BaseClient } from "./BaseClient";

export class SearchClient extends BaseClient {
  public search(params: SearchRequest): Promise<SearchResponse> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "search",
    });
    return this.client.get(path, params);
  }
}
