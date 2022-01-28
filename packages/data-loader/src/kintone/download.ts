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
    task(recordId, fieldCode, field, { apiClient, attachmentsDir })
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

const task: (
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

          const file = await apiClient.file.downloadFile({
            fileKey: fileInfo.fileKey,
          });
          const savedFilePath = saveFileWithoutOverwrite(localFilePath, file);

          return [
            ...(await downloadedList),
            { ...fileInfo, localFilePath: savedFilePath },
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
