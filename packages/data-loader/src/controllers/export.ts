import { promises as fs } from "fs";
import path from "path";
import {
  KintoneRecordField as Field,
  KintoneRestAPIClient,
} from "@kintone/rest-api-client";
import { AppID, Record } from "@kintone/rest-api-client/lib/client/types";
import { buildRestAPIClient, RestAPIClientOptions } from "../api";
import { KintoneRecordForResponse } from "../types";
import { printAsJson } from "../printers/printAsJson";
import { printAsCsv } from "../printers/printAsCsv";
import { AttachmentMetadata, SubtableField, SubtableRow } from "./attachments";

export type Options = {
  app: AppID;
  attachmentDir?: string;
  format?: ExportFileFormat;
  condition?: string;
  orderBy?: string;
};

export type ExportFileFormat = "json" | "csv";

type FileInfo = {
  filePath: string;
  fileKey: string;
};

export const run = async (argv: RestAPIClientOptions & Options) => {
  const apiClient = buildRestAPIClient(argv);
  const records = await exportRecords(apiClient, argv);
  await printRecords({
    records,
    argv,
    apiClient,
  });
};

export async function exportRecords(
  apiClient: KintoneRestAPIClient,
  options: Options
) {
  const { app, attachmentDir, condition, orderBy } = options;
  const records = await apiClient.record.getAllRecords({
    app,
    condition,
    orderBy,
  });

  // TODO: filter fields

  // TODO: extract attachment fields first

  if (attachmentDir) {
    await downloadAttachments(apiClient, records, attachmentDir);
  }

  return records;
}

const generateAttachmentMetadata = (record: Record): AttachmentMetadata => {
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
  T extends { [field: string]: Field.InSubtable }
>(
  subtableField: Field.Subtable<T>,
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

function generateUniqueLocalFileName(
  fileName: string,
  localFileNameSet: Set<string>
) {
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
}

const getFileInfos = (
  record: Record,
  attachmentMetadata: AttachmentMetadata
): FileInfo[] => {
  return Object.entries(record).reduce<FileInfo[]>(
    (acc, [fieldCode, field]) => {
      if (field.type === "FILE") {
        const fileInfos = field.value.map(
          (fileInformation, index): FileInfo => ({
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
  T extends { [field: string]: Field.InSubtable }
>(
  subtableField: Field.Subtable<T>,
  attachmentMetadataInSubtable: SubtableField
): FileInfo[] => {
  const rows = subtableField.value;
  return rows
    .map((row, rowIndex) => {
      const fieldsInRow = Object.entries(row.value);
      return fieldsInRow.reduce<FileInfo[]>((acc, [fieldCode, field]) => {
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

const downloadAttachments = async (
  apiClient: KintoneRestAPIClient,
  records: Record[],
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

async function printRecords({
  records,
  argv,
  apiClient,
}: {
  records: KintoneRecordForResponse[];
  argv: RestAPIClientOptions & Options;
  apiClient: KintoneRestAPIClient;
}) {
  switch (argv.format) {
    case "json": {
      printAsJson(records);
      break;
    }
    case "csv": {
      printAsCsv(records, await apiClient.app.getFormFields(argv));
      break;
    }
    default: {
      throw new Error(
        `Unknown format type. '${argv.format}' is unknown as a format option.`
      );
    }
  }
}
