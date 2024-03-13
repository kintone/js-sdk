import type {
  SpaceID,
  ThreadID,
  Space,
  ThreadComment,
  SpaceMemberForResponse,
  SpaceMemberForRequest,
} from "./types";
import { BaseClient } from "./BaseClient";

export class SpaceClient extends BaseClient {
  public getSpace(params: { id: SpaceID }): Promise<Space> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "space",
    });
    return this.client.get(path, params);
  }

  public deleteSpace(params: { id: SpaceID }): Promise<{}> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "space",
    });
    return this.client.delete(path, params);
  }

  public updateSpaceBody(params: { id: SpaceID; body: string }): Promise<{}> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "space/body",
    });
    return this.client.put(path, params);
  }

  public getSpaceMembers(params: {
    id: SpaceID;
  }): Promise<{ members: SpaceMemberForResponse[] }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "space/members",
    });
    return this.client.get(path, params);
  }

  public updateSpaceMembers(params: {
    id: SpaceID;
    members: SpaceMemberForRequest[];
  }): Promise<{}> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "space/members",
    });
    return this.client.put(path, params);
  }

  public updateThread(params: {
    id: ThreadID;
    name?: string;
    body?: string;
  }): Promise<{}> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "space/thread",
    });
    return this.client.put(path, params);
  }

  public addThreadComment(params: ThreadComment): Promise<{ id: string }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "space/thread/comment",
    });
    return this.client.post(path, params);
  }
}
