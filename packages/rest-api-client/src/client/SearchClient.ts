import type { SearchRequest, SearchResponse } from "./types";
import { BaseClient } from "./BaseClient";
import type { HttpClient } from "../http";

export class SearchClient extends BaseClient {
  private isUsRegion: boolean;

  constructor(
    client: HttpClient,
    guestSpaceId?: number | string,
    isUsRegion: boolean = false,
  ) {
    super(client, guestSpaceId);
    this.isUsRegion = isUsRegion;
  }

  public async search(params: SearchRequest): Promise<SearchResponse> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "search",
    });
    const { createdAfter, createdBefore, includeSynonyms, ...rest } = params;
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
      ...(includeSynonyms !== undefined && {
        includeSynonyms: this.validatedIncludeSynonymsOptions(includeSynonyms),
      }),
    });
  }

  validatedIncludeSynonymsOptions(
    includeSynonyms: SearchRequest["includeSynonyms"],
  ): SearchRequest["includeSynonyms"] {
    if (
      this.isUsRegion &&
      (includeSynonyms === true || includeSynonyms === "true")
    ) {
      throw new Error("Can't use includeSynonyms parameter in US Region");
    }
    return includeSynonyms;
  }
}
