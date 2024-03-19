import type { KintoneRestAPIClient } from "@kintone/rest-api-client";

const SPACE_ID = 8;
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

  public async addThreadComment() {
    const params = {
      space: "8",
      thread: "1",
      comment: {
        text: "This is a comment",
        files: [
          {
            fileKey: "file1",
            width: 100,
          },
        ],
        mentions: [
          {
            code: "user1",
            type: "USER" as const,
          },
          {
            code: "user2",
            type: "USER" as const,
          },
        ],
      },
    };
    try {
      console.log(await this.client.space.addThreadComment(params));
    } catch (error) {
      console.log(error);
    }
  }

  public async addGuests() {
    const guests = [
      {
        code: "guest1@example.com",
        password: "password123",
        timezone: "America/Los_Angeles",
        locale: "en" as const,
        image: "78a586f2-e73e-4a70-bec2-43976a60746e", // replace with the fileKey of the uploaded file
        name: "John Doe",
        company: "Company Name",
        division: "Sales",
        phone: "999-456-7890",
        callto: "skypecallto",
      },
    ];
    try {
      console.log(await this.client.space.addGuests({ guests }));
    } catch (error) {
      console.log(error);
    }
  }

  public async deleteGuests() {
    const guests = ["abc1@gmail.com", "abc2@gmail.com", "abc3@gmail.com"];
    try {
      console.log(await this.client.space.deleteGuests({ guests }));
    } catch (error) {
      console.log(error);
    }
  }
}
