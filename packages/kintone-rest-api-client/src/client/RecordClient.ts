import { AppID, RecordID, Revision } from "./../KintoneTypes";
import { HttpClient } from "./../http/";

type Record = {
  [fieldCode: string]: any;
};

type Mention = {
  code: string;
  type: "USER" | "GROUP" | "ORGANIZATION";
};

type Comment = {
  text: string;
  mentions?: Mention[];
};

type CommentID = string | number;

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

  public async addRecords(params: {
    app: AppID;
    records: Record[];
  }): Promise<{ ids: string[]; revisions: string[] }> {
    const path = "/k/v1/records.json";
    return this.client.post(path, params);
  }

  public async updateRecords(params: {
    app: AppID;
    records: Array<
      | { id: RecordID; record?: object; revision?: Revision }
      | { updateKey: object; record?: object; revision?: Revision }
    >;
  }): Promise<Array<{ id: string; revision: string }>> {
    const path = "/k/v1/records.json";
    return this.client.put(path, params);
  }

  public async deleteRecords(params: {
    app: AppID;
    ids: RecordID[];
    revisions?: Revision[];
  }): Promise<{}> {
    const path = "/k/v1/records.json";
    return this.client.delete(path, params);
  }

  public async createCursor(params: {
    app: AppID;
    fields?: string[];
    query?: string;
    size?: number | string;
  }): Promise<{ id: string; totalCount: string }> {
    const path = "/k/v1/records/cursor.json";
    return this.client.post(path, params);
  }

  public async getRecordsByCursor(params: {
    id: string;
  }): Promise<{
    records: Record[];
    next: boolean;
  }> {
    const path = "/k/v1/records/cursor.json";
    return this.client.get(path, params);
  }

  public async deleteCursor(params: { id: string }): Promise<{}> {
    const path = "/k/v1/records/cursor.json";
    return this.client.delete(path, params);
  }

  public async addComment(params: {
    app: AppID;
    record: RecordID;
    comment: Comment;
  }): Promise<{ id: string }> {
    const path = "/k/v1/record/comment.json";
    return this.client.post(path, params);
  }

  public async deleteComment(params: {
    app: AppID;
    record: RecordID;
    comment: CommentID;
  }): Promise<{}> {
    const path = "/k/v1/record/comment.json";
    return this.client.delete(path, params);
  }
}
