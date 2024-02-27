import type { HttpClient } from "../http";
import type { SpaceID, Space } from "./types";
import { AbstractClient } from "./AbstractClient";

export class SpaceClient extends AbstractClient {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(client: HttpClient, guestSpaceId?: number | string) {
    super(client, guestSpaceId);
  }

  public getSpace(params: { id: SpaceID }): Promise<Space> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "space",
    });
    return this.client.get(path, params);
  }

  public deleteSpace(params: { id: SpaceID }): Promise<Space> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "space",
    });
    return this.client.delete(path, params);
  }
}
