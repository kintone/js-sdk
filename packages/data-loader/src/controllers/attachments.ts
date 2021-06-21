import path from "path";
import {
  KintoneRestAPIClient,
  KintoneRecordField,
} from "@kintone/rest-api-client";
import { Record as KintoneRecord } from "@kintone/rest-api-client/lib/client/types";
import { promises as fs } from "fs";

type RecordMetadata = {
  [fieldCode: string]: FieldMetadata;
};

type FilePath = string;

type FieldMetadata = FileFieldMetadata | SubtableFieldMetadata;

type FileFieldMetadata = FilePath[];

type SubtableFieldMetadata = SubtableRowMetadata[];

type SubtableRowMetadata = {
  [fieldCode: string]: FileFieldMetadata;
};

type FilePathAndKey = {
  filePath: FilePath;
  fileKey: string;
};

export const downloadAttachments = async (
  apiClient: KintoneRestAPIClient,
  records: KintoneRecord[],
  attachmentDir: string
) => {
  const recordMetadataList = [];
  for (const record of records) {
    const recordMetadata = buildRecordMetadata(record);
    const filePathAndKeys = buildFilePathAndKeys(record, recordMetadata);
    for (const filePathAndKey of filePathAndKeys) {
      const { fileKey, filePath } = filePathAndKey;
      const file = await apiClient.file.downloadFile({ fileKey });

      const recordId = record.$id.value as string;
      const dir = path.resolve(attachmentDir, recordId);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(path.resolve(dir, filePath), Buffer.from(file));
    }
    recordMetadataList.push(recordMetadata);
  }
  await fs.writeFile(
    path.resolve(attachmentDir, "attachments.json"),
    JSON.stringify(recordMetadataList, null, 2)
  );
};

const buildRecordMetadata = (record: KintoneRecord): RecordMetadata => {
  const localFileNameSet = new Set<string>();
  return Object.entries(record).reduce<RecordMetadata>(
    (acc, [fieldCode, field]) => {
      if (field.type === "FILE") {
        acc[fieldCode] = buildFileFieldMetadata(field, localFileNameSet);
      } else if (field.type === "SUBTABLE") {
        acc[fieldCode] = buildSubtableFieldMetadata(field, localFileNameSet);
      }
      return acc;
    },
    {}
  );
};

const buildFileFieldMetadata = (
  fileField: KintoneRecordField.File,
  localFileNameSet: Set<string>
): FileFieldMetadata => {
  return fileField.value.map((fileInformation) =>
    generateUniqueLocalFileName(fileInformation.name, localFileNameSet)
  );
};

const buildSubtableFieldMetadata = <
  T extends { [field: string]: KintoneRecordField.InSubtable }
>(
  subtableField: KintoneRecordField.Subtable<T>,
  localFileNameSet: Set<string>
) => {
  return subtableField.value.map((row) => {
    return Object.entries(row.value).reduce<SubtableRowMetadata>(
      (acc, [fieldCode, field]) => {
        if (field.type === "FILE") {
          acc[fieldCode] = field.value.map((fileInformation) =>
            generateUniqueLocalFileName(fileInformation.name, localFileNameSet)
          );
        }
        return acc;
      },
      {}
    );
  });
};

const buildFilePathAndKeys = (
  record: KintoneRecord,
  attachmentMetadata: RecordMetadata
): FilePathAndKey[] => {
  return Object.entries(record).reduce<FilePathAndKey[]>(
    (acc, [fieldCode, field]) => {
      if (field.type === "FILE") {
        const fileInfos = field.value.map(
          (fileInformation, index): FilePathAndKey => ({
            fileKey: fileInformation.fileKey,
            filePath: attachmentMetadata[fieldCode][index] as string,
          })
        );
        acc.push(...fileInfos);
      } else if (field.type === "SUBTABLE") {
        const fileInfosInSubtable = buildFilePathAndKeysInSubtable(
          field,
          attachmentMetadata[fieldCode] as SubtableFieldMetadata
        );
        acc.push(...fileInfosInSubtable);
      }
      return acc;
    },
    []
  );
};

const buildFilePathAndKeysInSubtable = <
  T extends { [field: string]: KintoneRecordField.InSubtable }
>(
  subtableField: KintoneRecordField.Subtable<T>,
  attachmentMetadataInSubtable: SubtableFieldMetadata
): FilePathAndKey[] => {
  const rows = subtableField.value;
  return rows
    .map((row, rowIndex) => {
      const fieldsInRow = Object.entries(row.value);
      return fieldsInRow.reduce<FilePathAndKey[]>((acc, [fieldCode, field]) => {
        if (field.type === "FILE") {
          const fileInfos = field.value.map((fileInformation, index) => ({
            fileKey: fileInformation.fileKey,
            filePath: attachmentMetadataInSubtable[rowIndex][fieldCode][index],
          }));
          acc.push(...fileInfos);
        }
        return acc;
      }, []);
    })
    .reduce((acc, fileInfos) => acc.concat(fileInfos), []);
};

const generateUniqueLocalFileName = (
  fileName: string,
  localFileNameSet: Set<string>
) => {
  let localFileName = fileName;
  for (let i = 1; localFileNameSet.has(localFileName); i++) {
    localFileName =
      path.basename(fileName, path.extname(fileName)) +
      "-" +
      i +
      path.extname(fileName);
  }
  localFileNameSet.add(localFileName);
  return localFileName;
};
