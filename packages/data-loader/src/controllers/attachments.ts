import path from "path";
import {
  KintoneRestAPIClient,
  KintoneRecordField,
} from "@kintone/rest-api-client";
import { Record as KintoneRecord } from "@kintone/rest-api-client/lib/client/types";
import { promises as fs } from "fs";

type AttachmentMetadata = Record;

type Record = {
  [fieldCode: string]: Field;
};

type Field = FileField | SubtableField;

type FileField = string[];

export type SubtableField = SubtableRow[];

export type SubtableRow = {
  [fieldCode: string]: FileField;
};
//
// export type AttachmentMetadata = AttachmentMetadataPerRecord;
//
// type AttachmentMetadataPerRecord = {
//   [fieldCode: string]: AttachmentMetadataPerField;
// };
//
// type AttachmentMetadataPerField =
//   | FilePathList
//   | AttachmentMetadataPerSubtableField;
//
// type FilePathList = string[];
//
// export type AttachmentMetadataPerSubtableField =
//   AttachmentMetadataPerSubtableRow[];
//
// export type AttachmentMetadataPerSubtableRow = {
//   [fieldCode: string]: FilePathList;
// };

type FilePathAndKeyPair = {
  filePath: string;
  fileKey: string;
};

export const downloadAttachments = async (
  apiClient: KintoneRestAPIClient,
  records: KintoneRecord[],
  attachmentDir: string
) => {
  const attachmentMetadataList = [];
  for (const record of records) {
    const attachmentMetadata = generateAttachmentMetadata(record);
    const fileInfos = getFileInfos(record, attachmentMetadata);
    for (const fileInfo of fileInfos) {
      const { fileKey, filePath } = fileInfo;
      const file = await apiClient.file.downloadFile({ fileKey });

      const recordId = record.$id.value as string;
      const dir = path.resolve(attachmentDir, recordId);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(path.resolve(dir, filePath), Buffer.from(file));
    }
    attachmentMetadataList.push(attachmentMetadata);
  }
  await fs.writeFile(
    path.resolve(attachmentDir, "attachments.json"),
    JSON.stringify(attachmentMetadataList, null, 2)
  );
};

const generateAttachmentMetadata = (
  record: KintoneRecord
): AttachmentMetadata => {
  const localFileNameSet = new Set<string>();
  return Object.entries(record).reduce<AttachmentMetadata>(
    (acc, [fieldCode, field]) => {
      if (field.type === "FILE") {
        acc[fieldCode] = field.value.map((fileInformation) =>
          generateUniqueLocalFileName(fileInformation.name, localFileNameSet)
        );
      } else if (field.type === "SUBTABLE") {
        acc[fieldCode] = generateAttachmentMetadataInSubtable(
          field,
          localFileNameSet
        );
      }
      return acc;
    },
    {}
  );
};

const generateAttachmentMetadataInSubtable = <
  T extends { [field: string]: KintoneRecordField.InSubtable }
>(
  subtableField: KintoneRecordField.Subtable<T>,
  localFileNameSet: Set<string>
) => {
  return subtableField.value.map((row) => {
    return Object.entries(row.value).reduce<SubtableRow>(
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

const getFileInfos = (
  record: KintoneRecord,
  attachmentMetadata: AttachmentMetadata
): FilePathAndKeyPair[] => {
  return Object.entries(record).reduce<FilePathAndKeyPair[]>(
    (acc, [fieldCode, field]) => {
      if (field.type === "FILE") {
        const fileInfos = field.value.map(
          (fileInformation, index): FilePathAndKeyPair => ({
            fileKey: fileInformation.fileKey,
            filePath: attachmentMetadata[fieldCode][index] as string,
          })
        );
        acc.push(...fileInfos);
      } else if (field.type === "SUBTABLE") {
        const fileInfosInSubtable = getFileInfosInSubtable(
          field,
          attachmentMetadata[fieldCode] as SubtableField
        );
        acc.push(...fileInfosInSubtable);
      }
      return acc;
    },
    []
  );
};

const getFileInfosInSubtable = <
  T extends { [field: string]: KintoneRecordField.InSubtable }
>(
  subtableField: KintoneRecordField.Subtable<T>,
  attachmentMetadataInSubtable: SubtableField
): FilePathAndKeyPair[] => {
  const rows = subtableField.value;
  return rows
    .map((row, rowIndex) => {
      const fieldsInRow = Object.entries(row.value);
      return fieldsInRow.reduce<FilePathAndKeyPair[]>(
        (acc, [fieldCode, field]) => {
          if (field.type === "FILE") {
            const fileInfos = field.value.map((fileInformation, index) => ({
              fileKey: fileInformation.fileKey,
              filePath:
                attachmentMetadataInSubtable[rowIndex][fieldCode][index],
            }));
            acc.push(...fileInfos);
          }
          return acc;
        },
        []
      );
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
