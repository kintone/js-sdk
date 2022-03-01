import { KintoneRecordForParameter } from "../types/kintone";
import {
  KintoneFormFieldProperty,
  KintoneRecordField,
  KintoneRestAPIClient,
} from "@kintone/rest-api-client";
import {
  DataLoaderFields,
  DataLoaderRecordForParameter,
  DataLoaderRecordForResponse,
} from "../types/data-loader";
import path from "path";

const CHUNK_LENGTH = 100;

export const uploadRecords: (options: {
  apiClient: KintoneRestAPIClient;
  app: string;
  records: DataLoaderRecordForParameter[];
}) => Promise<void> = async (options) => {
  const { apiClient, app, records } = options;

  const { properties } = await apiClient.app.getFormFields<
    Record<string, KintoneFormFieldProperty.OneOf>
  >(options);

  let chunkStartIndex = 0;
  while (chunkStartIndex < records.length) {
    const chunkNextIndex =
      records.length < chunkStartIndex + CHUNK_LENGTH
        ? records.length
        : chunkStartIndex + CHUNK_LENGTH;
    try {
      // TODO: convert DataLoaderRecords to KintoneRecordForParameter
      const kintoneRecords: KintoneRecordForParameter[] = await recordsReducer(
        records,
        (recordId, fieldCode, field) =>
          fieldProcessor(recordId, fieldCode, field, properties, {
            apiClient,
          })
      );
      await apiClient.record.addRecords({
        app,
        records: records.slice(chunkStartIndex, chunkNextIndex),
      });
      console.log(
        `SUCCESS: records[${chunkStartIndex} - ${chunkNextIndex - 1}]`
      );
    } catch (e) {
      console.log(
        `FAILED: records[${chunkStartIndex} - ${records.length - 1}]`
      );
      throw e;
    }
    chunkStartIndex = chunkNextIndex;
  }
};

const recordsReducer: (
  records: DataLoaderRecordForParameter[],
  task: (
    recordId: string,
    fieldCode: string,
    field: KintoneRecordField.OneOf
  ) => Promise<KintoneRecordForParameter[string]>
) => Promise<KintoneRecordForParameter[]> = async (kintoneRecords, task) => {
  const records: KintoneRecordForParameter[] = [];
  for (const kintoneRecord of kintoneRecords) {
    const record = await recordReducer(kintoneRecord, (fieldCode, field) =>
      task(kintoneRecord.$id.value as string, fieldCode, field)
    );
    records.push(record);
  }
  return records;
};

const recordReducer: (
  record: DataLoaderRecordForParameter,
  task: (
    fieldCode: string,
    field: KintoneRecordField.OneOf
  ) => Promise<KintoneRecordForParameter[string]>
) => Promise<KintoneRecordForParameter> = async (record, task) => {
  const newRecord: KintoneRecordForParameter = {};
  for (const [fieldCode, field] of Object.entries(record)) {
    newRecord[fieldCode] = await task(fieldCode, field);
  }
  return newRecord;
};

const fieldProcessor: (
  recordId: string,
  fieldCode: string,
  field: DataLoaderRecordForParameter[string],
  properties: Record<string, KintoneFormFieldProperty.OneOf>,
  options: { apiClient: KintoneRestAPIClient; attachmentsDir?: string }
) => Promise<KintoneRecordForParameter[string]> = async (
  recordId,
  fieldCode,
  field,
  options
) => {
  const { attachmentsDir, apiClient } = options;

  // TODO: filter fields

  switch (field.type) {
    case "FILE":
      if (attachmentsDir) {
        const uploadedList: Array<{ fileKey: string }> = [];
        for (const fileInfo of field.value) {
          if (!fileInfo.localFilePath) {
            throw new Error("local file path not defined.");
          }
          const { fileKey } = await apiClient.file.uploadFile({
            file: {
              path: path.join(attachmentsDir, fileInfo.localFilePath),
            },
          });
          uploadedList.push({
            fileKey,
          });
        }
        return {
          type: "FILE",
          value: uploadedList,
        };
      }
      return field;
    default:
      return field;
  }
};
