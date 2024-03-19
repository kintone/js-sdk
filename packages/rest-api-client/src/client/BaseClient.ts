import type { HttpClient } from "../http";
import { buildPath } from "../url";

export abstract class BaseClient {
  protected client: HttpClient;
  protected guestSpaceId?: number | string;

  constructor(client: HttpClient, guestSpaceId?: number | string) {
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

  protected buildPath(params: { endpointName: string; preview?: boolean }) {
    return buildPath(params);
  }
}
