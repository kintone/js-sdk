import { HttpClient } from "./../HttpClientInterface";

type AppID = string | number;
type RecordID = string | number;

export class RecordClient {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  public async getRecord(app: AppID, id: RecordID) {
    const path = "/k/v1/record.json";
    return this.client.request(path, { app, id });
  }
}
