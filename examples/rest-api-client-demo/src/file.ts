import type { KintoneRestAPIClient } from "@kintone/rest-api-client";

const APP_ID = 8;

export class File {
  private client: KintoneRestAPIClient;
  constructor(client: KintoneRestAPIClient) {
    this.client = client;
  }

  public async uploadFile(
    file: { name: string; data: string | ArrayBuffer } = {
      name: "Hello.text",
      data: "Hello World!",
    }
  ) {
    const { fileKey } = await this.client.file.uploadFile({
      file,
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

  public async uploadFileByPath() {
    const { fileKey } = await this.client.file.uploadFile({
      file: { path: "./foo.txt" },
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
      id: 75085,
    });

    const fileField = record.Attachment;
    let data;
    if (fileField.type === "FILE") {
      data = await this.client.file.downloadFile({
        fileKey: fileField.value[0].fileKey,
      });
      // console.log(data.toString());
    }
    return data;
  }

  public async downloadAndUploadFile() {
    const data = await this.downloadFile();
    if (data) {
      await this.uploadFile({ name: "image.png", data });
    }
  }
}
