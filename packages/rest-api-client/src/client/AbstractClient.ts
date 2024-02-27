import type { HttpClient } from "../http";
import { buildPath } from "../url";

export abstract class AbstractClient {
  protected client: HttpClient;
  protected guestSpaceId?: number | string;

  protected constructor(client: HttpClient, guestSpaceId?: number | string) {
    this.client = client;
    this.guestSpaceId = guestSpaceId;
  }

  protected buildPathWithGuestSpaceId(params: {
    endpointName: string;
    preview?: boolean;
  }) {
    return buildPath({
      ...params,
      guestSpaceId: this.guestSpaceId,
    });
  }
}
