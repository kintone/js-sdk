import { KintoneRecordForResponse } from "../types/kintone";
import { DataLoaderFields, DataLoaderRecord } from "../types/data-loader";
import path from "path";
import {
  KintoneRecordField,
  KintoneRestAPIClient,
} from "@kintone/rest-api-client";
import { existsSync, mkdirSync, writeFileSync } from "fs";

export const downloadRecords = async (options: {
  apiClient: KintoneRestAPIClient;
  app: string;
  condition?: string;
  orderBy?: string;
  attachmentsDir?: string;
}): Promise<DataLoaderRecord[]> => {
  const { apiClient, app, condition, orderBy, attachmentsDir } = options;
  const kintoneRecords = await apiClient.record.getAllRecords({
    app,
    condition,
    orderBy,
  });
  return recordsReducer(kintoneRecords, (recordId, fieldCode, field) =>
    fieldProcessor(recordId, fieldCode, field, { apiClient, attachmentsDir })
  );
};

const recordsReducer: (
  records: KintoneRecordForResponse[],
  task: (
    recordId: string,
    fieldCode: string,
    field: KintoneRecordField.OneOf
  ) => Promise<DataLoaderFields.OneOf>
) => Promise<DataLoaderRecord[]> = async (kintoneRecords, task) => {
  const records: DataLoaderRecord[] = [];
  for (const kintoneRecord of kintoneRecords) {
    const record = await recordReducer(kintoneRecord, (fieldCode, field) =>
      task(kintoneRecord.$id.value as string, fieldCode, field)
    );
    records.push(record);
  }
  return records;
};

const recordReducer: (
  record: KintoneRecordForResponse,
  task: (
    fieldCode: string,
    field: KintoneRecordField.OneOf
  ) => Promise<DataLoaderFields.OneOf>
) => Promise<DataLoaderRecord> = async (record, task) => {
  const newRecord: DataLoaderRecord = {};
  for (const [fieldCode, field] of Object.entries(record)) {
    newRecord[fieldCode] = await task(fieldCode, field);
  }
  return newRecord;
};

const fieldProcessor: (
  recordId: string,
  fieldCode: string,
  field: KintoneRecordField.OneOf,
  options: { apiClient: KintoneRestAPIClient; attachmentsDir?: string }
) => Promise<DataLoaderFields.OneOf> = async (
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
        const downloadedList: DataLoaderFields.File["value"] = [];
        for (const fileInfo of field.value) {
          const localFilePath = path.join(
            attachmentsDir,
            `${fieldCode}-${recordId}`,
            fileInfo.name
          );

          const savedFilePath = await downloadAndSaveFile(
            apiClient,
            fileInfo.fileKey,
            localFilePath
          );

          downloadedList.push({
            ...fileInfo,
            localFilePath: path.relative(attachmentsDir, savedFilePath),
          });
        }
        return {
          type: "FILE",
          value: downloadedList,
        };
      }
      return field;
    case "SUBTABLE": {
      const newRows = [];
      for (const [rowIndex, row] of field.value.entries()) {
        const fieldsInRow: DataLoaderFields.Subtable["value"][number]["value"] =
          {};
        for (const [fieldCodeInSubtable, fieldInSubtable] of Object.entries(
          row.value
        )) {
          fieldsInRow[fieldCodeInSubtable] = await fieldProcessorInSubtable(
            recordId,
            row.id,
            rowIndex,
            fieldCodeInSubtable,
            fieldInSubtable,
            { apiClient, attachmentsDir }
          );
        }
        newRows.push({ id: row.id, value: fieldsInRow });
      }
      return {
        type: "SUBTABLE",
        value: newRows,
      };
    }
    default:
      return field;
  }
};

const fieldProcessorInSubtable: (
  recordId: string,
  rowId: string,
  rowIndex: number,
  fieldCode: string,
  field: KintoneRecordField.InSubtable,
  options: { apiClient: KintoneRestAPIClient; attachmentsDir?: string }
) => Promise<DataLoaderFields.InSubtable> = async (
  recordId,
  rowId,
  rowIndex,
  fieldCode,
  field,
  options
) => {
  const { apiClient, attachmentsDir } = options;
  switch (field.type) {
    case "FILE":
      if (attachmentsDir) {
        const downloadedList: DataLoaderFields.File["value"] = [];
        for (const fileInfo of field.value) {
          const localFilePath = path.join(
            attachmentsDir,
            `${fieldCode}-${recordId}-${rowIndex}`,
            fileInfo.name
          );

          const savedFilePath = await downloadAndSaveFile(
            apiClient,
            fileInfo.fileKey,
            localFilePath
          );

          downloadedList.push({
            ...fileInfo,
            localFilePath: path.relative(attachmentsDir, savedFilePath),
          });
        }
        return {
          type: "FILE",
          value: downloadedList,
        };
      }
      return field;
    default:
      return field;
  }
};

const downloadAndSaveFile: (
  apiClient: KintoneRestAPIClient,
  fileKey: string,
  localFilePath: string
) => Promise<string> = async (apiClient, fileKey, localFilePath) => {
  const file = await apiClient.file.downloadFile({
    fileKey,
  });
  return saveFileWithoutOverwrite(localFilePath, file);
};

const saveFileWithoutOverwrite: (
  filePath: string,
  file: ArrayBuffer
) => string = (filePath, file) => {
  const uniqueFilePath = generateUniqueLocalFilePath(filePath);
  mkdirSync(path.dirname(uniqueFilePath), { recursive: true });
  writeFileSync(uniqueFilePath, Buffer.from(file));
  return uniqueFilePath;
};

const generateUniqueLocalFilePath: (filePath: string) => string = (
  filePath
) => {
  const internal: (index: number) => string = (index) => {
    const newFileName =
      index === 0
        ? path.basename(filePath)
        : `${path.basename(
            filePath,
            path.extname(filePath)
          )} (${index})${path.extname(filePath)}`;
    const newFilePath = path.join(path.dirname(filePath), newFileName);
    if (existsSync(newFilePath)) {
      return internal(index + 1);
    }
    return newFilePath;
  };
  return internal(0);
};
