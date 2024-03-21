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

  /**
   * This method is used to build the endpoint for the API that does not support the guest space URL.
   * Otherwise, please use `buildPathWithGuestSpaceId` instead.
   * @param params
   * @protected
   */
  protected buildPath(params: { endpointName: string; preview?: boolean }) {
    return buildPath(params);
  }
}
