import { HttpClient } from "./../HttpClientInterface";

type AppID = string | number;
type RecordID = string | number;
type Revision = string | number;

export class RecordClient {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  public async getRecord(app: AppID, id: RecordID) {
    const path = "/k/v1/record.json";
    return this.client.get(path, { app, id });
  }

  public async addRecord(app: AppID, record?: object) {
    const path = "/k/v1/record.json";
    return this.client.post(path, { app, record });
  }

  public async updateRecord(
    app: AppID,
    params:
      | { id: RecordID; record?: object; revision?: Revision }
      | { updateKey: object; record?: object; revision?: Revision }
  ) {
    const path = "/k/v1/record.json";
    return this.client.put(path, { app, ...params });
  }
}
