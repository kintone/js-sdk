import { KintoneRecordForResponse } from "../types/kintone";
import { DataLoaderFields, DataLoaderRecord } from "../types/data-loader";
import path from "path";
import {
  KintoneRecordField,
  KintoneRestAPIClient,
} from "@kintone/rest-api-client";
import { existsSync, mkdirSync, writeFileSync } from "fs";

export const downloadRecords = async (
  apiClient: KintoneRestAPIClient,
  options: {
    app: string;
    condition?: string;
    orderBy?: string;
    attachmentsDir?: string;
  }
): Promise<DataLoaderRecord[]> => {
  const { app, condition, orderBy, attachmentsDir } = options;
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
) => Promise<DataLoaderRecord[]> = (kintoneRecords, task) =>
  kintoneRecords.reduce<Promise<DataLoaderRecord[]>>(
    async (records, record) => [
      ...(await records),
      await recordReducer(record, (fieldCode, field) =>
        task(record.$id.value as string, fieldCode, field)
      ),
    ],
    Promise.resolve([])
  );

const recordReducer: (
  record: KintoneRecordForResponse,
  task: (
    fieldCode: string,
    field: KintoneRecordField.OneOf
  ) => Promise<DataLoaderFields.OneOf>
) => Promise<DataLoaderRecord> = (record, task) =>
  Object.entries(record).reduce<Promise<DataLoaderRecord>>(
    async (newRecord, [fieldCode, field]) => ({
      ...(await newRecord),
      [fieldCode]: await task(fieldCode, field),
    }),
    Promise.resolve({})
  );

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
        const value = await field.value.reduce<
          Promise<DataLoaderFields.File["value"]>
        >(async (downloadedList, fileInfo) => {
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

          return [
            ...(await downloadedList),
            {
              ...fileInfo,
              localFilePath: path.relative(attachmentsDir, savedFilePath),
            },
          ];
        }, Promise.resolve([]));
        return {
          type: "FILE",
          value,
        };
      }
      return field;
    case "SUBTABLE":
      return {
        type: "SUBTABLE",
        value: await field.value.reduce<
          Promise<
            KintoneRecordField.Subtable<{
              [fieldCode: string]: DataLoaderFields.InSubtable;
            }>["value"]
          >
        >(
          async (newRows, row, rowIndex) => [
            ...(await newRows),
            {
              id: row.id,
              value: await Object.entries(row.value).reduce(
                async (newRow, [fieldCodeInSubtable, fieldInSubtable]) => ({
                  ...(await newRow),
                  [fieldCodeInSubtable]: await fieldProcessorInSubtable(
                    recordId,
                    row.id,
                    rowIndex,
                    fieldCodeInSubtable,
                    fieldInSubtable,
                    { apiClient, attachmentsDir }
                  ),
                }),
                Promise.resolve({})
              ),
            },
          ],
          Promise.resolve([])
        ),
      };
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
        const value = await field.value.reduce<
          Promise<DataLoaderFields.File["value"]>
        >(async (downloadedList, fileInfo) => {
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

          return [
            ...(await downloadedList),
            {
              ...fileInfo,
              localFilePath: path.relative(attachmentsDir, savedFilePath),
            },
          ];
        }, Promise.resolve([]));
        return {
          type: "FILE",
          value,
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
