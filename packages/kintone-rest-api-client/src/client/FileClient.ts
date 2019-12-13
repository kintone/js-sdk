import { HttpClient } from "../http";
import FormData from "form-data";

export class FileClient {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  public uploadFile(params: { file: { name: string; data: any } }) {
    const path = "/k/v1/file.json";
    const { name, data } = params.file;
    const formData = new FormData();
    formData.append("file", data, name);
    return this.client.post(path, formData);
  }

  public downloadFile(params: { fileKey: string }) {
    const path = "/k/v1/file.json";
    return this.client.get(path, params);
  }
}
