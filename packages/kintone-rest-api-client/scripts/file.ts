import { KintoneAPIClient } from "../src";

export class File {
  private client: KintoneAPIClient;
  constructor(client: KintoneAPIClient) {
    this.client = client;
  }

  public async uploadFile() {
    try {
      console.log(
        await this.client.file.uploadFile({
          file: { name: "Hello.txt", data: "Hello World!" }
        })
      );
    } catch (error) {
      console.log(error);
    }
  }
}
