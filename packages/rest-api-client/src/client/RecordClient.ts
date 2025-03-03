import type { HttpClient } from "../http";
import type { BulkRequestClient } from "./BulkRequestClient";
import { KintoneAllRecordsError } from "../error";
import type {
  AppID,
  RecordID,
  Revision,
  Record,
  UpdateKey,
  CommentID,
  Comment,
  Mention,
  UpdateRecordsForResponse,
} from "./types";
import { BaseClient } from "./BaseClient";

const ADD_RECORDS_LIMIT = 100;
const UPDATE_RECORDS_LIMIT = 100;
const DELETE_RECORDS_LIMIT = 100;
const GET_RECORDS_LIMIT = 500;

type RecordForParameter = {
  [fieldCode: string]: {
    value: unknown;
  };
};

export class RecordClient extends BaseClient {
  private bulkRequestClient: BulkRequestClient;
  private didWarnMaximumOffsetValue: boolean;

  constructor(
    client: HttpClient,
    bulkRequestClient: BulkRequestClient,
    guestSpaceId?: number | string,
  ) {
    super(client, guestSpaceId);
    this.bulkRequestClient = bulkRequestClient;
    this.didWarnMaximumOffsetValue = false;
  }

  public getRecord<T extends Record>(params: {
    app: AppID;
    id: RecordID;
  }): Promise<{ record: T }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "record",
    });
    return this.client.get(path, params);
  }

  public addRecord(params: {
    app: AppID;
    record?: RecordForParameter;
  }): Promise<{ id: string; revision: string }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "record",
    });
    return this.client.post(path, params);
  }

  public updateRecord(
    params:
      | {
          app: AppID;
          id: RecordID;
          record?: RecordForParameter;
          revision?: Revision;
        }
      | {
          app: AppID;
          updateKey: UpdateKey;
          record?: RecordForParameter;
          revision?: Revision;
        },
  ): Promise<{ revision: string }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "record",
    });
    return this.client.put(path, params);
  }

  public async upsertRecord(params: {
    app: AppID;
    updateKey: UpdateKey;
    record?: RecordForParameter;
    revision?: Revision;
  }): Promise<{ id: string; revision: string }> {
    const { app, updateKey, record } = params;
    // if the client can't get a record matches `updateKey`, use `addRecord`
    const { records } = await this.getRecords({
      app,
      query: `${updateKey.field} = "${updateKey.value}"`,
    });
    if (records.length > 0) {
      if (records[0].$id.type === "__ID__") {
        const { revision } = await this.updateRecord(params);
        return { id: records[0].$id.value, revision };
      }
      throw new Error(
        "Missing `$id` in `getRecords` response. This error is likely caused by a bug in Kintone REST API Client. Please file an issue.",
      );
    }
    return this.addRecord({
      app,
      record: Object.assign({}, record, {
        [updateKey.field]: { value: updateKey.value },
      }),
    });
  }

  // TODO: `records` type in return type should be filtered by `fields`.
  public async getRecords<T extends Record>(params: {
    app: AppID;
    fields?: string[];
    query?: string;
    totalCount?: boolean;
  }): Promise<{ records: T[]; totalCount: string | null }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "records",
    });
    const response = await this.client.get<{
      records: T[];
      totalCount: string | null;
    }>(path, params);
    this.warnMaximumOffsetValueIfNeeded(params.query);
    return response;
  }

  private warnMaximumOffsetValueIfNeeded(query?: string) {
    if (query) {
      const regexp = /offset\s+(\d+)/i;
      const result = query.match(regexp);
      if (
        !this.didWarnMaximumOffsetValue &&
        result &&
        Number(result[1]) > 10000
      ) {
        this.didWarnMaximumOffsetValue = true;
        console.warn(
          "Warning: The maximum offset value will be limited to 10,000 in the future. Please use `createCursor()` and `getRecordsByCursor()` instead.",
        );
      }
    }
  }

  public async addRecords(params: {
    app: AppID;
    records: RecordForParameter[];
  }): Promise<{
    ids: string[];
    revisions: string[];
    records: Array<{ id: string; revision: string }>;
  }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "records",
    });
    const { ids, revisions } = await this.client.post<{
      ids: string[];
      revisions: string[];
    }>(path, params);
    return {
      ids,
      revisions,
      records: ids.map((id, i) => ({ id, revision: revisions[i] })),
    };
  }

  public updateRecords(params: {
    app: AppID;
    upsert?: boolean;
    records: Array<
      | { id: RecordID; record?: RecordForParameter; revision?: Revision }
      | {
          updateKey: UpdateKey;
          record?: RecordForParameter;
          revision?: Revision;
        }
    >;
  }): Promise<{
    records: UpdateRecordsForResponse;
  }> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "records",
    });
    return this.client.put(path, params);
  }

  public deleteRecords(params: {
    app: AppID;
    ids: RecordID[];
    revisions?: Revision[];
  }): Promise<{}> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "records",
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
      endpointName: "records/cursor",
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
      endpointName: "records/cursor",
    });
    return this.client.get(path, params);
  }

  public deleteCursor(params: { id: string }): Promise<{}> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "records/cursor",
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
    const { fields: originalFields, condition, ...rest } = params;
    let fields = originalFields;
    // Append $id if $id doesn't exist in fields
    if (fields && fields.length > 0 && fields.indexOf("$id") === -1) {
      fields = [...fields, "$id"];
    }

    const conditionQuery = condition ? `(${condition}) and ` : "";
    let allRecords: T[] = [];
    let lastId = "0";
    while (true) {
      const query = `${conditionQuery}$id > ${lastId} order by $id asc limit ${GET_RECORDS_LIMIT}`;
      const result = await this.getRecords<T>({ ...rest, fields, query });
      allRecords = allRecords.concat(result.records);
      if (result.records.length < GET_RECORDS_LIMIT) {
        break;
      }
      const lastRecord = result.records[result.records.length - 1];
      if (lastRecord.$id.type === "__ID__") {
        lastId = lastRecord.$id.value;
      } else {
        throw new Error(
          "Missing `$id` in `getRecords` response. This error is likely caused by a bug in Kintone REST API Client. Please file an issue.",
        );
      }
    }

    return allRecords;
  }

  public async getAllRecordsWithOffset<T extends Record>(params: {
    app: AppID;
    fields?: string[];
    condition?: string;
    orderBy?: string;
  }): Promise<T[]> {
    const { condition, orderBy, ...rest } = params;
    const conditionQuery = condition ? `${condition} ` : "";
    let allRecords: T[] = [];
    let offset = 0;
    while (true) {
      const query = `${conditionQuery}${
        orderBy ? `order by ${orderBy} ` : ""
      }limit ${GET_RECORDS_LIMIT} offset ${offset}`;

      const result = await this.getRecords<T>({ ...rest, query });
      allRecords = allRecords.concat(result.records);
      if (result.records.length < GET_RECORDS_LIMIT) {
        break;
      }

      offset += GET_RECORDS_LIMIT;
    }

    return allRecords;
  }

  public async getAllRecordsWithCursor<T extends Record>(params: {
    app: AppID;
    fields?: string[];
    query?: string;
  }): Promise<T[]> {
    const { id } = await this.createCursor(params);
    try {
      let allRecords: T[] = [];
      while (true) {
        const result = await this.getRecordsByCursor<T>({ id });
        allRecords = allRecords.concat(result.records);
        if (!result.next) {
          break;
        }
      }

      return allRecords;
    } catch (error) {
      await this.deleteCursor({ id });
      throw error;
    }
  }

  public async addAllRecords(params: {
    app: AppID;
    records: RecordForParameter[];
  }): Promise<{ records: Array<{ id: string; revision: string }> }> {
    if (
      !params.records.every(
        (record) => !Array.isArray(record) && record instanceof Object,
      )
    ) {
      throw new Error("the `records` parameter must be an array of object.");
    }
    return this.addAllRecordsRecursive(params, params.records.length, []);
  }

  private async addAllRecordsRecursive(
    params: { app: AppID; records: RecordForParameter[] },
    numOfAllRecords: number,
    results: Array<{ id: string; revision: string }>,
  ): Promise<{ records: Array<{ id: string; revision: string }> }> {
    const CHUNK_LENGTH =
      this.bulkRequestClient.REQUESTS_LENGTH_LIMIT * ADD_RECORDS_LIMIT;
    const { app, records } = params;
    const recordsChunk = records.slice(0, CHUNK_LENGTH);
    if (recordsChunk.length === 0) {
      return { records: results };
    }
    let newResults;
    try {
      newResults = await this.addAllRecordsWithBulkRequest({
        app,
        records: recordsChunk,
      });
    } catch (e: any) {
      throw new KintoneAllRecordsError(
        { records: results },
        records,
        numOfAllRecords,
        e,
        ADD_RECORDS_LIMIT,
      );
    }
    return this.addAllRecordsRecursive(
      {
        app,
        records: records.slice(CHUNK_LENGTH),
      },
      numOfAllRecords,
      results.concat(newResults),
    );
  }

  private async addAllRecordsWithBulkRequest(params: {
    app: AppID;
    records: RecordForParameter[];
  }): Promise<
    Array<{
      id: string;
      revision: string;
    }>
  > {
    const separatedRecords = this.separateArrayRecursive(
      ADD_RECORDS_LIMIT,
      [],
      params.records,
    );
    const requests = separatedRecords.map((records) => ({
      method: "POST",
      endpointName: "records" as const,
      payload: {
        app: params.app,
        records,
      },
    }));
    const results = (await this.bulkRequestClient.send({ requests }))
      .results as Array<{ ids: string[]; revisions: string[] }>;
    return results
      .map((result) => {
        const { ids, revisions } = result;
        return ids.map((id, i) => ({ id, revision: revisions[i] }));
      })
      .reduce((acc, records) => {
        return acc.concat(records);
      }, []);
  }

  public async updateAllRecords(params: {
    app: AppID;
    upsert?: boolean;
    records: Array<
      | { id: RecordID; record?: RecordForParameter; revision?: Revision }
      | {
          updateKey: UpdateKey;
          record?: RecordForParameter;
          revision?: Revision;
        }
    >;
  }): Promise<{
    records: UpdateRecordsForResponse;
  }> {
    return this.updateAllRecordsRecursive(params, params.records.length, []);
  }

  private async updateAllRecordsRecursive(
    params: {
      app: AppID;
      upsert?: boolean;
      records: Array<
        | { id: RecordID; record?: RecordForParameter; revision?: Revision }
        | {
            updateKey: UpdateKey;
            record?: RecordForParameter;
            revision?: Revision;
          }
      >;
    },
    numOfAllRecords: number,
    results: UpdateRecordsForResponse,
  ): Promise<{
    records: UpdateRecordsForResponse;
  }> {
    const CHUNK_LENGTH =
      this.bulkRequestClient.REQUESTS_LENGTH_LIMIT * UPDATE_RECORDS_LIMIT;
    const { app, upsert, records } = params;
    const recordsChunk = records.slice(0, CHUNK_LENGTH);
    if (recordsChunk.length === 0) {
      return { records: results };
    }
    let newResults;
    try {
      newResults = await this.updateAllRecordsWithBulkRequest({
        app,
        upsert,
        records: recordsChunk,
      });
    } catch (e: any) {
      throw new KintoneAllRecordsError(
        { records: results },
        records,
        numOfAllRecords,
        e,
        UPDATE_RECORDS_LIMIT,
      );
    }
    return this.updateAllRecordsRecursive(
      {
        app,
        upsert,
        records: records.slice(CHUNK_LENGTH),
      },
      numOfAllRecords,
      results.concat(newResults),
    );
  }

  private async updateAllRecordsWithBulkRequest(params: {
    app: AppID;
    upsert?: boolean;
    records: Array<
      | { id: RecordID; record?: RecordForParameter; revision?: Revision }
      | {
          updateKey: UpdateKey;
          record?: RecordForParameter;
          revision?: Revision;
        }
    >;
  }): Promise<UpdateRecordsForResponse> {
    const separatedRecords = this.separateArrayRecursive(
      UPDATE_RECORDS_LIMIT,
      [],
      params.records,
    );
    const requests = separatedRecords.map((records) => ({
      method: "PUT",
      endpointName: "records" as const,
      payload: {
        app: params.app,
        upsert: params.upsert,
        records,
      },
    }));
    const results = (await this.bulkRequestClient.send({ requests }))
      .results as Array<{
      records: UpdateRecordsForResponse;
    }>;
    return results
      .map((result) => result.records)
      .reduce((acc, records) => {
        return acc.concat(records);
      }, []);
  }

  public deleteAllRecords(params: {
    app: AppID;
    records: Array<{
      id: RecordID;
      revision?: Revision;
    }>;
  }): Promise<{}> {
    return this.deleteAllRecordsRecursive(params, params.records.length);
  }

  private async deleteAllRecordsRecursive(
    params: {
      app: AppID;
      records: Array<{
        id: RecordID;
        revision?: Revision;
      }>;
    },
    numOfAllRecords: number,
  ): Promise<{}> {
    const CHUNK_LENGTH =
      this.bulkRequestClient.REQUESTS_LENGTH_LIMIT * DELETE_RECORDS_LIMIT;
    const { app, records } = params;
    const recordsChunk = records.slice(0, CHUNK_LENGTH);
    if (recordsChunk.length === 0) {
      return {};
    }
    try {
      await this.deleteAllRecordsWithBulkRequest({
        app,
        records: recordsChunk,
      });
    } catch (e: any) {
      throw new KintoneAllRecordsError(
        {},
        records,
        numOfAllRecords,
        e,
        DELETE_RECORDS_LIMIT,
      );
    }
    return this.deleteAllRecordsRecursive(
      {
        app,
        records: records.slice(CHUNK_LENGTH),
      },
      numOfAllRecords,
    );
  }

  private async deleteAllRecordsWithBulkRequest(params: {
    app: AppID;
    records: Array<{
      id: RecordID;
      revision?: Revision;
    }>;
  }): Promise<void> {
    const separatedRecords = this.separateArrayRecursive(
      DELETE_RECORDS_LIMIT,
      [],
      params.records,
    );
    const requests = separatedRecords.map((records) => ({
      method: "DELETE",
      endpointName: "records" as const,
      payload: {
        app: params.app,
        ids: records.map((record) => record.id),
        revisions: records.map((record) => record.revision),
      },
    }));
    await this.bulkRequestClient.send({ requests });
  }

  private separateArrayRecursive<T>(
    size: number,
    separated: T[][],
    array: T[],
  ): T[][] {
    const chunk = array.slice(0, size);
    if (chunk.length === 0) {
      return separated;
    }
    return this.separateArrayRecursive(
      size,
      [...separated, chunk],
      array.slice(size),
    );
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
      endpointName: "record/comment",
    });
    return this.client.post(path, params);
  }

  public deleteRecordComment(params: {
    app: AppID;
    record: RecordID;
    comment: CommentID;
  }): Promise<{}> {
    const path = this.buildPathWithGuestSpaceId({
      endpointName: "record/comment",
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
      endpointName: "record/comments",
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
      endpointName: "record/assignees",
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
      endpointName: "record/status",
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
      endpointName: "records/status",
    });
    return this.client.put(path, params);
  }
}
