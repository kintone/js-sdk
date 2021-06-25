import path from "path";
import {
  KintoneRecordField,
  KintoneRestAPIClient,
} from "@kintone/rest-api-client";
import { Record as KintoneRecord } from "@kintone/rest-api-client/lib/client/types";
import { existsSync, promises as fs } from "fs";
import {
  FileFieldMetadata,
  FileName,
  RecordMetadata,
  SubtableFieldMetadata,
  SubtableRowMetadata,
} from "./index";

export const downloadAttachments = async (params: {
  apiClient: KintoneRestAPIClient;
  records: KintoneRecord[];
  targetDir: string;
}) => {
  const { apiClient, records, targetDir } = params;
  const metadataList = await downloadRecordsAttachments({
    apiClient,
    records,
    targetDir,
    metadataBaseDir: targetDir,
  });
  const metadataFilePath = path.join(targetDir, "attachments.json");
  await fs.writeFile(metadataFilePath, JSON.stringify(metadataList, null, 2));
};

const downloadRecordsAttachments = async (params: {
  apiClient: KintoneRestAPIClient;
  records: KintoneRecord[];
  targetDir: string;
  metadataBaseDir: string;
}): Promise<RecordMetadata[]> => {
  const { apiClient, records, targetDir, metadataBaseDir } = params;
  const metadataList: RecordMetadata[] = [];
  for (const record of records) {
    const recordId = record.$id.value as string;
    const dir = path.join(targetDir, recordId);
    const metadata = await downloadRecordAttachments({
      apiClient,
      record,
      targetDir: dir,
      metadataBaseDir,
    });
    metadataList.push(metadata);
  }
  return metadataList;
};

const downloadRecordAttachments = async (params: {
  apiClient: KintoneRestAPIClient;
  record: KintoneRecord;
  targetDir: string;
  metadataBaseDir: string;
}): Promise<RecordMetadata> => {
  const { apiClient, record, targetDir, metadataBaseDir } = params;
  const metadata: RecordMetadata = {};
  for (const [fieldCode, field] of Object.entries(record)) {
    if (field.type === "FILE") {
      metadata[fieldCode] = await downloadFileFieldAttachments({
        apiClient,
        field,
        targetDir,
        metadataBaseDir,
      });
    } else if (field.type === "SUBTABLE") {
      metadata[fieldCode] = await downloadSubtableFieldAttachments({
        apiClient,
        field,
        targetDir,
        metadataBaseDir,
      });
    }
  }
  return metadata;
};

const downloadSubtableFieldAttachments = async <
  T extends { [field: string]: KintoneRecordField.InSubtable }
>(params: {
  apiClient: KintoneRestAPIClient;
  field: KintoneRecordField.Subtable<T>;
  targetDir: string;
  metadataBaseDir: string;
}): Promise<SubtableFieldMetadata> => {
  const { apiClient, field, targetDir, metadataBaseDir } = params;
  const subtableFieldMetadata: SubtableFieldMetadata = [];
  for (const row of field.value) {
    const subtableRowMetadata: SubtableRowMetadata = {};
    for (const [fieldCodeInRow, fieldInRow] of Object.entries(row.value)) {
      if (fieldInRow.type === "FILE") {
        subtableRowMetadata[fieldCodeInRow] =
          await downloadFileFieldAttachments({
            apiClient,
            field: fieldInRow,
            targetDir,
            metadataBaseDir,
          });
      }
    }
    subtableFieldMetadata.push(subtableRowMetadata);
  }
  return subtableFieldMetadata;
};

const downloadFileFieldAttachments = async (params: {
  apiClient: KintoneRestAPIClient;
  field: KintoneRecordField.File;
  targetDir: string;
  metadataBaseDir: string;
}): Promise<FileFieldMetadata> => {
  const { apiClient, field, targetDir, metadataBaseDir } = params;
  const metadata: FileFieldMetadata = [];
  for (const { fileKey, name: fileName } of field.value) {
    const filePath = path.join(targetDir, fileName);
    const fileBuffer = await apiClient.file.downloadFile({ fileKey });
    const savedFilePath = await saveFileWithoutOverwrite(filePath, fileBuffer);
    const relativePath = path.relative(metadataBaseDir, savedFilePath);
    metadata.push(relativePath);
  }
  return metadata;
};

const saveFileWithoutOverwrite = async (
  filePath: string,
  fileBuffer: any
): Promise<FileName> => {
  const uniqueFilePath = generateUniqueLocalFilePath(filePath);
  await fs.mkdir(path.dirname(uniqueFilePath), { recursive: true });
  await fs.writeFile(uniqueFilePath, Buffer.from(fileBuffer));
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
    newFilePath = path.join(path.dirname(newFilePath), newFileName);
  }
  return newFilePath;
};
