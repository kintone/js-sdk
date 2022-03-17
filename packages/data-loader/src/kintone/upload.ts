import { KintoneRecordForParameter } from "../types/kintone";
import {
  KintoneFormFieldProperty,
  KintoneRestAPIClient,
} from "@kintone/rest-api-client";
import { RecordForImport, FieldsForImport } from "../types/data-loader";
import path from "path";

const CHUNK_LENGTH = 100;

export const uploadRecords: (options: {
  apiClient: KintoneRestAPIClient;
  attachmentsDir?: string;
  app: string;
  records: RecordForImport[];
}) => Promise<void> = async (options) => {
  const { apiClient, attachmentsDir, app, records } = options;

  const { properties } = await apiClient.app.getFormFields<
    Record<string, KintoneFormFieldProperty.OneOf>
  >({ app });

  let chunkStartIndex = 0;
  while (chunkStartIndex < records.length) {
    const chunkNextIndex = Math.min(
      records.length,
      chunkStartIndex + CHUNK_LENGTH
    );
    try {
      const kintoneRecords: KintoneRecordForParameter[] = await recordsReducer(
        records,
        (fieldCode, field) =>
          fieldProcessor(fieldCode, field, properties, {
            apiClient,
            attachmentsDir,
          })
      );
      await apiClient.record.addRecords({
        app,
        records: kintoneRecords.slice(chunkStartIndex, chunkNextIndex),
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
  records: RecordForImport[],
  task: (
    fieldCode: string,
    field: FieldsForImport.OneOf
  ) => Promise<KintoneRecordForParameter[string]>
) => Promise<KintoneRecordForParameter[]> = async (kintoneRecords, task) => {
  const records: KintoneRecordForParameter[] = [];
  for (const kintoneRecord of kintoneRecords) {
    const record = await recordReducer(kintoneRecord, (fieldCode, field) =>
      task(fieldCode, field)
    );
    records.push(record);
  }
  return records;
};

const recordReducer: (
  record: RecordForImport,
  task: (
    fieldCode: string,
    field: FieldsForImport.OneOf
  ) => Promise<KintoneRecordForParameter[string]>
) => Promise<KintoneRecordForParameter> = async (record, task) => {
  const newRecord: KintoneRecordForParameter = {};
  for (const [fieldCode, field] of Object.entries(record)) {
    newRecord[fieldCode] = await task(fieldCode, field);
  }
  return newRecord;
};

const fieldProcessor: (
  fieldCode: string,
  field: FieldsForImport.OneOf,
  properties: Record<string, KintoneFormFieldProperty.OneOf>,
  options: { apiClient: KintoneRestAPIClient; attachmentsDir?: string }
) => Promise<KintoneRecordForParameter[string]> = async (
  fieldCode,
  field,
  properties,
  options
) => {
  const { attachmentsDir, apiClient } = options;

  // TODO: filter fields

  switch (properties[fieldCode].type) {
    case "FILE": {
      if (!attachmentsDir) {
        throw new Error("--attachments-dir option is required.");
      }
      const uploadedList: Array<{ fileKey: string }> = [];
      for (const fileInfo of (field as FieldsForImport.File).value) {
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
        value: uploadedList,
      };
    }
    case "SUBTABLE": {
      const newRows = [];

      const subtableValue = (field as FieldsForImport.Subtable).value;
      for (const row of subtableValue) {
        const fieldsInRow: KintoneRecordForParameter = {};
        for (const [fieldCodeInSubtable, fieldInSubtable] of Object.entries(
          row.value
        )) {
          fieldsInRow[fieldCodeInSubtable] = await fieldProcessor(
            fieldCodeInSubtable,
            fieldInSubtable,
            (
              properties[fieldCode] as KintoneFormFieldProperty.Subtable<{
                [fieldCode: string]: KintoneFormFieldProperty.InSubtable;
              }>
            ).fields,
            { apiClient, attachmentsDir }
          );
        }
        newRows.push({ id: row.id, value: fieldsInRow });
      }
      return {
        value: newRows,
      };
    }
    default:
      return field;
  }
};
