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
}
