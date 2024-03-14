import type { KintoneRestAPIClient } from "@kintone/rest-api-client";

const SPACE_ID = 8;
const GUEST_SPACE_ID = 9;
const THREAD_ID = 8;

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

  public async updateSpaceBody() {
    const body = "<b>This is a updated space body</b>";
    try {
      console.log(
        await this.client.space.updateSpaceBody({ id: SPACE_ID, body }),
      );
    } catch (error) {
      console.log(error);
    }
  }

  public async getSpaceMembers() {
    try {
      console.log(await this.client.space.getSpaceMembers({ id: SPACE_ID }));
    } catch (error) {
      console.log(error);
    }
  }

  public async updateThread() {
    const body = "<b>This is an updated thread body</b>";
    const name = "Updated Thread Name";
    try {
      console.log(
        await this.client.space.updateThread({ id: THREAD_ID, body, name }),
      );
    } catch (error) {
      console.log(error);
    }
  }

  public async updateSpaceMembers() {
    const spaceMembers = {
      id: SPACE_ID,
      members: [
        {
          entity: {
            type: "USER" as const,
            code: "user1",
          },
          isAdmin: true,
          includeSubs: false,
        },
        {
          entity: {
            type: "USER" as const,
            code: "user2",
          },
          isAdmin: false,
          includeSubs: false,
        },
        {
          entity: {
            type: "GROUP" as const,
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

  public async updateSpaceGuests() {
    const guests = [
      "guestUser1@gmail.com",
      "guestUser2@gmail.com",
      "guestUser3@gmail.com",
    ];

    try {
      console.log(
        await this.client.space.updateSpaceGuests({
          id: GUEST_SPACE_ID,
          guests,
        }),
      );
    } catch (error) {
      console.log(error);
    }
  }
}
