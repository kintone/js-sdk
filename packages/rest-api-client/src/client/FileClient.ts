import { HttpClient } from "../http";
import { buildPath } from "../url";
import FormData from "form-data";
import { platformDeps } from "../platform";

export class FileClient {
  private client: HttpClient;
  private guestSpaceId?: number | string;

  constructor(client: HttpClient, guestSpaceId?: number | string) {
    this.client = client;
    this.guestSpaceId = guestSpaceId;
  }

  public async uploadFile(params: {
    file: { name: string; data: unknown } | { path: string };
  }): Promise<{ fileKey: string }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "file"
    });

    const formData = new FormData();
    if ("path" in params.file) {
      try {
        const { name, data } = await platformDeps.readFileFromPath(
          params.file.path
        );
        formData.append("file", data, name);
      } catch (e) {
        throw new Error(
          "uploadFile doesn't allow to accept a file path on a browser environment."
        );
      }
    } else {
      const { name, data } = params.file;
      formData.append("file", data, name);
    }
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
