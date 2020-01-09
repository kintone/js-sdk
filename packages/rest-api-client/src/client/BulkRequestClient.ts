import { HttpClient } from "../http";
import { buildPath } from "../url";

export class BulkRequestClient {
  private client: HttpClient;
  private guestSpaceId?: number | string;

  constructor(client: HttpClient, guestSpaceId?: number | string) {
    this.client = client;
    this.guestSpaceId = guestSpaceId;
  }

  public send(params: {
    requests: Array<{
      method: string;
      api: string;
      payload: object;
    }>;
  }): Promise<object[]> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "bulkRequest"
    });
    return this.client.post(path, params);
  }

  private buildPathWithGuestSpaceId(params: { endpointName: string }) {
    return buildPath({
      ...params,
      guestSpaceId: this.guestSpaceId
    });
  }
}
