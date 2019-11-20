import { AppID, RecordID, Revision } from "./../KintoneTypes";
import { HttpClient } from "./../http/";

type Record = {
  [fieldCode: string]: any;
};

export class RecordClient {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  public async getRecord<T extends Record>(params: {
    app: AppID;
    id: RecordID;
  }): Promise<{ record: T }> {
    const path = "/k/v1/record.json";
    return this.client.get(path, params);
  }

  public async addRecord(params: {
    app: AppID;
    record?: object;
  }): Promise<{ id: RecordID; revision: Revision }> {
    const path = "/k/v1/record.json";
    return this.client.post(path, params);
  }

  public async updateRecord(
    params:
      | { app: AppID; id: RecordID; record?: object; revision?: Revision }
      | { app: AppID; updateKey: object; record?: object; revision?: Revision }
  ): Promise<{ revision: Revision }> {
    const path = "/k/v1/record.json";
    return this.client.put(path, params);
  }

  // TODO: `records` type in return type should be filtered by `fields`.
  public async getRecords<T extends Record>(params: {
    app: AppID;
    fields?: string[];
    query?: string;
    totalCount?: boolean;
  }): Promise<{ records: T[]; totalCount: string | null }> {
    const path = "/k/v1/records.json";
    return this.client.get(path, params);
  }

  public async addRecords<T extends Record>(params: {
    app: AppID;
    records: Record[];
  }): Promise<{ ids: RecordID[]; revisions: string[] }> {
    const path = "/k/v1/records.json";
    return this.client.post(path, params);
  }

  public async deleteRecords(params: {
    app: AppID;
    ids: RecordID[];
    revisions?: Revision[];
  }): Promise<{}> {
    const path = "/k/v1/records.json";
    return this.client.delete(path, params);
  }
}
