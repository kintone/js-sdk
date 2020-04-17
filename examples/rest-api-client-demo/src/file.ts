import { KintoneRestAPIClient } from "@kintone/rest-api-client";

const APP_ID = 8;

export class File {
  private client: KintoneRestAPIClient;
  constructor(client: KintoneRestAPIClient) {
    this.client = client;
  }

  public async uploadFile() {
    const { fileKey } = await this.client.file.uploadFile({
      file: { name: "Hello.text", data: "Hello World!" },
    });
    console.log(fileKey);
    this.client.record.addRecord({
      app: APP_ID,
      record: {
        Customer: {
          value: `fileKey: ${fileKey}`,
        },
        Attachment: {
          value: [{ fileKey }],
        },
      },
    });
  }

  public async downloadFile() {
    const { record } = await this.client.record.getRecord({
      app: APP_ID,
      id: 537,
    });

    const data = await this.client.file.downloadFile({
      fileKey: record.Attachment.value[0].fileKey,
    });
    console.log(data.toString());
  }
}
