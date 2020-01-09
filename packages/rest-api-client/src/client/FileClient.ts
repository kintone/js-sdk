import { HttpClient } from "../http";
import FormData from "form-data";
import { buildPath } from "../url";

export class FileClient {
  private client: HttpClient;
  private guestSpaceId?: number | string;

  constructor(client: HttpClient, guestSpaceId?: number | string) {
    this.client = client;
    this.guestSpaceId = guestSpaceId;
  }

  public uploadFile(params: {
    file: { name: string; data: unknown };
  }): Promise<{ fileKey: string }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "file"
    });
    const { name, data } = params.file;
    const formData = new FormData();
    formData.append("file", data, name);
    return this.client.postData(path, formData);
  }

  public downloadFile(params: { fileKey: string }): Promise<ArrayBuffer> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "file"
    });
    return this.client.getData(path, params);
  }

  private buildPathWithGuestSpaceId(params: { endpointName: string }) {
    return buildPath({
      ...params,
      guestSpaceId: this.guestSpaceId
    });
  }
}
