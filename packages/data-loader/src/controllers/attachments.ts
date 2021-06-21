import path from "path";
import {
  KintoneRestAPIClient,
  KintoneRecordField,
} from "@kintone/rest-api-client";
import { Record as KintoneRecord } from "@kintone/rest-api-client/lib/client/types";
import { promises as fs, existsSync } from "fs";

type RecordMetadata = {
  [fieldCode: string]: FieldMetadata;
};

type FileName = string;

type FieldMetadata = FileFieldMetadata | SubtableFieldMetadata;

type FileFieldMetadata = FileName[];

type SubtableFieldMetadata = SubtableRowMetadata[];

type SubtableRowMetadata = {
  [fieldCode: string]: FileFieldMetadata;
};

export const downloadAttachments = async (
  apiClient: KintoneRestAPIClient,
  records: KintoneRecord[],
  attachmentDir: string
) => {
  const metadataList = [];
  for (const record of records) {
    const recordId = record.$id.value as string;
    const dir = path.resolve(attachmentDir, recordId);
    const metadata = await downloadRecordAttachments(apiClient, record, dir);
    metadataList.push(metadata);
  }
  await fs.writeFile(
    path.resolve(attachmentDir, "attachments.json"),
    JSON.stringify(metadataList, null, 2)
  );
};

const downloadRecordAttachments = async (
  apiClient: KintoneRestAPIClient,
  record: KintoneRecord,
  attachmentDir: string
): Promise<RecordMetadata> => {
  const metadata: RecordMetadata = {};
  for (const [fieldCode, field] of Object.entries(record)) {
    if (field.type === "FILE") {
      metadata[fieldCode] = await downloadFileFieldAttachments(
        apiClient,
        field,
        attachmentDir
      );
    } else if (field.type === "SUBTABLE") {
      metadata[fieldCode] = await downloadSubtableFieldAttachments(
        apiClient,
        field,
        attachmentDir
      );
    }
  }
  return metadata;
};

const downloadFileFieldAttachments = async (
  apiClient: KintoneRestAPIClient,
  field: KintoneRecordField.File,
  attachmentDir: string
): Promise<FileFieldMetadata> => {
  const metadata: FileFieldMetadata = [];
  for (const { fileKey, name: fileName } of field.value) {
    const filePath = path.resolve(attachmentDir, fileName);
    const file = await apiClient.file.downloadFile({ fileKey });
    const savedFilePath = await saveFileWithoutOverwrite(filePath, file);
    metadata.push(path.basename(savedFilePath));
  }
  return metadata;
};

const downloadSubtableFieldAttachments = async <
  T extends { [field: string]: KintoneRecordField.InSubtable }
>(
  apiClient: KintoneRestAPIClient,
  field: KintoneRecordField.Subtable<T>,
  attachmentDir: string
): Promise<SubtableFieldMetadata> => {
  const subtableFieldMetadata: SubtableFieldMetadata = [];
  for (const row of field.value) {
    const subtableRowMetadata: SubtableRowMetadata = {};
    for (const [fieldCodeInRow, fieldInRow] of Object.entries(row.value)) {
      if (fieldInRow.type === "FILE") {
        subtableRowMetadata[fieldCodeInRow] =
          await downloadFileFieldAttachments(
            apiClient,
            fieldInRow,
            attachmentDir
          );
      }
    }
    subtableFieldMetadata.push(subtableRowMetadata);
  }
  return subtableFieldMetadata;
};

const saveFileWithoutOverwrite = async (
  filePath: string,
  file: any
): Promise<FileName> => {
  const uniqueFilePath = generateUniqueLocalFilePath(filePath);
  await fs.mkdir(path.dirname(uniqueFilePath), { recursive: true });
  await fs.writeFile(uniqueFilePath, Buffer.from(file));
  return uniqueFilePath;
};

const generateUniqueLocalFilePath = (filePath: string) => {
  let newFilePath = filePath;
  for (let i = 1; existsSync(newFilePath); i++) {
    const newFileName =
      path.basename(filePath, path.extname(filePath)) +
      "-" +
      i +
      path.extname(filePath);
    newFilePath = path.resolve(path.dirname(newFilePath), newFileName);
  }
  return newFilePath;
};
