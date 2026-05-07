import type { SearchRequest, SearchResponse } from "./types";
import { BaseClient } from "./BaseClient";

export class SearchClient extends BaseClient {
  public search(params: SearchRequest): Promise<SearchResponse> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "search",
    });
    const { createdAfter, createdBefore, ...rest } = params;
    return this.client.get(path, {
      ...rest,
      ...(createdAfter !== undefined && {
        createdAfter:
          createdAfter instanceof Date
            ? createdAfter.toISOString()
            : createdAfter,
      }),
      ...(createdBefore !== undefined && {
        createdBefore:
          createdBefore instanceof Date
            ? createdBefore.toISOString()
            : createdBefore,
      }),
    });
  }
}
