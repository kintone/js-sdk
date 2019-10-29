import { HttpClient } from "./../http/";

type AppID = string | number;
type RecordID = string | number;
type Revision = string | number;

type Record = {
  [fieldCode: string]: any;
};

export class RecordClient {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  public async getRecord<T extends { record: Record }>(
    app: AppID,
    id: RecordID
  ) {
    const path = "/k/v1/record.json";
    return this.client.get<T>(path, { app, id });
  }

  public async addRecord(
    app: AppID,
    record?: object
  ): Promise<{ id: RecordID; revision: Revision }> {
    const path = "/k/v1/record.json";
    return this.client.post(path, { app, record });
  }

  public async updateRecord(
    app: AppID,
    params:
      | { id: RecordID; record?: object; revision?: Revision }
      | { updateKey: object; record?: object; revision?: Revision }
  ): Promise<{ revision: Revision }> {
    const path = "/k/v1/record.json";
    return this.client.put(path, { app, ...params });
  }

  public async deleteRecords(
    app: AppID,
    ids: RecordID[],
    revisions?: Revision[]
  ): Promise<{}> {
    const path = "/k/v1/records.json";
    return this.client.delete(path, { app, ids, revisions });
  }
}
