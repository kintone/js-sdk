import type { KintoneRestAPIClient } from "@kintone/rest-api-client";
import type { SpaceMember } from "@kintone/rest-api-client/src/client/types";

const SPACE_ID = "8";

export class Space {
  private client: KintoneRestAPIClient;
  constructor(client: KintoneRestAPIClient) {
    this.client = client;
  }
  public async getSpace() {
    try {
      console.log(await this.client.space.getSpace({ id: SPACE_ID }));
    } catch (error) {
      console.log(error);
    }
  }

  public async deleteSpace() {
    try {
      console.log(await this.client.space.deleteSpace({ id: SPACE_ID }));
    } catch (error) {
      console.log(error);
    }
  }

  public async updateSpaceMembers() {
    const spaceMembers: { id: string; members: SpaceMember[] } = {
      id: SPACE_ID,
      members: [
        {
          entity: {
            type: "USER",
            code: "user1",
          },
          isAdmin: true,
          includeSubs: false,
        },
        {
          entity: {
            type: "USER",
            code: "user2",
          },
          isAdmin: false,
          includeSubs: false,
        },
        {
          entity: {
            type: "GROUP",
            code: "group1",
          },
          isAdmin: false,
          includeSubs: true,
        },
      ],
    };

    try {
      console.log(await this.client.space.updateSpaceMembers(spaceMembers));
    } catch (error) {
      console.log(error);
    }
  }
}
