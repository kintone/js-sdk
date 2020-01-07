import { buildPath } from "./../url";
import { AppID, RecordID, Revision } from "./../KintoneTypes";
import { HttpClient } from "./../http/";

export type Record = {
  [fieldCode: string]: any;
};

type Mention = {
  code: string;
  type: "USER" | "GROUP" | "ORGANIZATION";
};

type Comment = {
  id: number;
  text: string;
  createdAt: string;
  creator: {
    code: string;
    name: string;
  };
  mentions: Mention[];
};

type CommentID = string | number;

export class RecordClient {
  private client: HttpClient;
  private guestSpaceId?: number | string;

  constructor(client: HttpClient, guestSpaceId?: number | string) {
    this.client = client;
    this.guestSpaceId = guestSpaceId;
  }

  public getRecord<T extends Record>(params: {
    app: AppID;
    id: RecordID;
  }): Promise<{ record: T }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "record"
    });
    return this.client.get(path, params);
  }

  public addRecord(params: {
    app: AppID;
    record?: object;
  }): Promise<{ id: RecordID; revision: Revision }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "record"
    });
    return this.client.post(path, params);
  }

  public updateRecord(
    params:
      | { app: AppID; id: RecordID; record?: object; revision?: Revision }
      | { app: AppID; updateKey: object; record?: object; revision?: Revision }
  ): Promise<{ revision: Revision }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "record"
    });
    return this.client.put(path, params);
  }

  // TODO: `records` type in return type should be filtered by `fields`.
  public getRecords<T extends Record>(params: {
    app: AppID;
    fields?: string[];
    query?: string;
    totalCount?: boolean;
  }): Promise<{ records: T[]; totalCount: string | null }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "records"
    });
    return this.client.get(path, params);
  }

  public addRecords(params: {
    app: AppID;
    records: Record[];
  }): Promise<{ ids: string[]; revisions: string[] }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "records"
    });
    return this.client.post(path, params);
  }

  public updateRecords(params: {
    app: AppID;
    records: Array<
      | { id: RecordID; record?: object; revision?: Revision }
      | { updateKey: object; record?: object; revision?: Revision }
    >;
  }): Promise<Array<{ id: string; revision: string }>> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "records"
    });
    return this.client.put(path, params);
  }

  public deleteRecords(params: {
    app: AppID;
    ids: RecordID[];
    revisions?: Revision[];
  }): Promise<{}> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "records"
    });
    return this.client.delete(path, params);
  }

  public createCursor(params: {
    app: AppID;
    fields?: string[];
    query?: string;
    size?: number | string;
  }): Promise<{ id: string; totalCount: string }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "records/cursor"
    });
    return this.client.post(path, params);
  }

  public getRecordsByCursor<T extends Record>(params: {
    id: string;
  }): Promise<{
    records: T[];
    next: boolean;
  }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "records/cursor"
    });
    return this.client.get(path, params);
  }

  public deleteCursor(params: { id: string }): Promise<{}> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "records/cursor"
    });
    return this.client.delete(path, params);
  }

  public async getAllRecords<T extends Record>(params: {
    app: AppID;
    fields?: string[];
    condition?: string;
    orderBy?: string;
    withCursor?: boolean;
  }): Promise<T[]> {
    const { condition, orderBy, withCursor = true, ...rest } = params;
    if (!orderBy) {
      return this.getAllRecordsWithId({ ...rest, condition });
    }
    if (withCursor) {
      const conditionQuery = condition ? `${condition} ` : "";
      const query = `${conditionQuery}${orderBy ? `order by ${orderBy}` : ""}`;
      return this.getAllRecordsWithCursor({ ...rest, query });
    }
    return this.getAllRecordsWithOffset({ ...rest, orderBy, condition });
  }

  public async getAllRecordsWithId<T extends Record>(params: {
    app: AppID;
    fields?: string[];
    condition?: string;
  }): Promise<T[]> {
    const { fields: originalFields, ...rest } = params;
    let fields = originalFields;
    // Append $id if $id doesn't exist in fields
    if (fields && fields.length > 0 && fields.indexOf("$id") === -1) {
      fields = [...fields, "$id"];
    }
    return this.getAllRecordsRecursiveWithId({ ...rest, fields }, 0, []);
  }

  private async getAllRecordsRecursiveWithId<T extends Record>(
    params: {
      app: AppID;
      fields?: string[];
      condition?: string;
    },
    id: number,
    records: T[]
  ): Promise<T[]> {
    const GET_RECORDS_LIMIT = 500;

    const { condition, ...rest } = params;
    const conditionQuery = condition ? `${condition} and ` : "";
    const query = `${conditionQuery}$id > ${id} order by $id asc limit ${GET_RECORDS_LIMIT}`;
    const result = await this.getRecords<T>({ ...rest, query });
    const allRecords = records.concat(result.records);
    if (result.records.length < GET_RECORDS_LIMIT) {
      return allRecords;
    }
    const lastId = result.records[result.records.length - 1].$id.value;
    return this.getAllRecordsRecursiveWithId(params, lastId, allRecords);
  }

  public async getAllRecordsWithOffset<T extends Record>(params: {
    app: AppID;
    fields?: string[];
    condition?: string;
    orderBy?: string;
  }): Promise<T[]> {
    return this.getAllRecordsRecursiveWithOffset(params, 0, []);
  }

  public async getAllRecordsRecursiveWithOffset<T extends Record>(
    params: {
      app: AppID;
      fields?: string[];
      condition?: string;
      orderBy?: string;
    },
    offset: number,
    records: T[]
  ): Promise<T[]> {
    const GET_RECORDS_LIMIT = 500;

    const { condition, orderBy, ...rest } = params;
    const conditionQuery = condition ? `${condition} ` : "";
    const query = `${conditionQuery}${
      orderBy ? `order by ${orderBy} ` : ""
    }limit ${GET_RECORDS_LIMIT} offset ${offset}`;
    const result = await this.getRecords<T>({ ...rest, query });
    const allRecords = records.concat(result.records);
    if (result.records.length < GET_RECORDS_LIMIT) {
      return allRecords;
    }

    return this.getAllRecordsRecursiveWithOffset(
      params,
      offset + GET_RECORDS_LIMIT,
      allRecords
    );
  }

  public async getAllRecordsWithCursor<T extends Record>(params: {
    app: AppID;
    fields?: string[];
    query?: string;
  }): Promise<T[]> {
    const { id } = await this.createCursor(params);
    try {
      return await this.getAllRecordsRecursiveByCursor<T>(id, []);
    } catch (error) {
      this.deleteCursor({ id });
      throw error;
    }
  }

  private async getAllRecordsRecursiveByCursor<T extends Record>(
    id: string,
    records: T[]
  ): Promise<T[]> {
    const result = await this.getRecordsByCursor<T>({ id });
    const allRecords = records.concat(result.records);
    if (result.next) {
      return this.getAllRecordsRecursiveByCursor(id, allRecords);
    }
    return allRecords;
  }

  public addRecordComment(params: {
    app: AppID;
    record: RecordID;
    comment: {
      text: string;
      mentions?: Mention[];
    };
  }): Promise<{ id: string }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "record/comment"
    });
    return this.client.post(path, params);
  }

  public deleteRecordComment(params: {
    app: AppID;
    record: RecordID;
    comment: CommentID;
  }): Promise<{}> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "record/comment"
    });
    return this.client.delete(path, params);
  }

  public getRecordComments(params: {
    app: AppID;
    record: RecordID;
    order?: "asc" | "desc";
    offset?: number;
    limit?: number;
  }): Promise<{ comments: Comment[]; older: boolean; newer: boolean }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "record/comments"
    });
    return this.client.get(path, params);
  }

  public updateRecordAssignees(params: {
    app: AppID;
    id: RecordID;
    assignees: string[];
    revision?: Revision;
  }): Promise<{ revision: string }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "record/assignees"
    });
    return this.client.put(path, params);
  }

  public updateRecordStatus(params: {
    action: string;
    app: AppID;
    assignee?: string;
    id: RecordID;
    revision?: Revision;
  }): Promise<{ revision: string }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "record/status"
    });
    return this.client.put(path, params);
  }

  public updateRecordsStatus(params: {
    app: AppID;
    records: Array<{
      action: string;
      assignee?: string;
      id: RecordID;
      revision?: Revision;
    }>;
  }): Promise<{ records: Array<{ id: string; revision: string }> }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "records/status"
    });
    return this.client.put(path, params);
  }

  private buildPathWithGuestSpaceId(params: { endpointName: string }) {
    return buildPath({
      ...params,
      guestSpaceId: this.guestSpaceId
    });
  }
}
