import type { SearchRequest, SearchResponse } from "./types";
import { BaseClient } from "./BaseClient";
import type { HttpClient } from "../http";

export class SearchClient extends BaseClient {
  private isUsRegion: boolean;

  constructor(
    client: HttpClient,
    guestSpaceId: number | string | undefined,
    isUsRegion: boolean = false,
  ) {
    super(client, guestSpaceId);
    this.isUsRegion = isUsRegion;
  }

  public search(params: SearchRequest): Promise<SearchResponse> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "search",
    });
    const { createdAfter, createdBefore, useSynonyms, ...rest } = params;
    return this.client.post(path, {
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
      ...(useSynonyms !== undefined && {
        useSynonyms: this.validatedUseSynonymsOptions(useSynonyms),
      }),
    });
  }

  validatedUseSynonymsOptions(
    useSynonyms: SearchRequest["useSynonyms"],
  ): SearchRequest["useSynonyms"] {
    if (this.isUsRegion && typeof useSynonyms !== "undefined") {
      throw new Error("Can't use useSynonyms parameter in US Region");
    }
    return useSynonyms;
  }
}
