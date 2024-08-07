import type {
  SpaceID,
  ThreadID,
  ThreadComment,
  SpaceMemberForResponse,
  SpaceMemberForRequest,
  GuestSpaceID,
  Guest,
  SpaceTemplateID,
  UpdateSpaceForRequest,
  Space,
} from "./types";
import { BaseClient } from "./BaseClient";

export class SpaceClient extends BaseClient {
  public getSpace(params: { id: SpaceID }): Promise<Space> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "space",
    });
    return this.client.get(path, params);
  }

  public updateSpace(params: UpdateSpaceForRequest): Promise<{}> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "space",
    });
    return this.client.put(path, params);
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

  public addThread(params: {
    space: SpaceID;
    name: string;
  }): Promise<{ id: string }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "space/thread",
    });
    return this.client.post(path, params);
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

  public addGuests(params: { guests: Guest[] }): Promise<{}> {
    const path = this.buildPath({
      endpointName: "guests",
    });
    return this.client.post(path, params);
  }

  public deleteGuests(params: { guests: string[] }): Promise<{}> {
    const path = this.buildPath({
      endpointName: "guests",
    });
    return this.client.delete(path, params);
  }

  public updateSpaceGuests(params: {
    id: GuestSpaceID;
    guests: string[];
  }): Promise<{}> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "space/guests",
    });
    return this.client.put(path, params);
  }

  public addSpaceFromTemplate(params: {
    id: SpaceTemplateID;
    name: string;
    members: SpaceMemberForRequest[];
    isPrivate?: boolean;
    isGuest?: boolean;
    fixedMember?: boolean;
  }): Promise<{ id: SpaceID }> {
    const path = this.buildPath({
      endpointName: "template/space",
    });
    return this.client.post(path, params);
  }
}
