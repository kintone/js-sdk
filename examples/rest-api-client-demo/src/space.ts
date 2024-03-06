import type { KintoneRestAPIClient } from "@kintone/rest-api-client";

const SPACE_ID = 8;

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
}
