import { promises as fs } from "fs";
import path from "path";
import {
  KintoneRestAPIClient,
  KintoneRecordField as Field,
} from "@kintone/rest-api-client";
import { AppID, Record } from "@kintone/rest-api-client/lib/client/types";
import { buildRestAPIClient, RestAPIClientOptions } from "../api";
import { KintoneRecordForResponse } from "../types";
import { printAsJson } from "../printers/printAsJson";
import { printAsCsv } from "../printers/printAsCsv";
import {
  AttachmentMetaData,
  FileField,
  SubTableField,
  SubTableRow,
} from "./attachments";

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

const generateAttachmentMetaData = (record: Record): AttachmentMetaData => {
  const localFileNameSet = new Set<string>();
  return Object.entries(record).reduce<AttachmentMetaData>(
    (acc, [fieldCode, field]) => {
      if (field.type === "__ID__") {
        acc.id = field.value;
      }
      if (field.type === "FILE") {
        acc.fields[fieldCode] = {
          type: field.type,
          value: field.value.map((fileInfo) => {
            return {
              name: fileInfo.name,
              filePath: generateUniqueLocalFileName(
                fileInfo.name,
                localFileNameSet
              ),
              fileKey: fileInfo.fileKey,
            };
          }),
        };
        return acc;
      }
      if (field.type === "SUBTABLE") {
        const rows = generateAttachmentMetaDataInSubtable(
          field,
          localFileNameSet
        );
        acc.fields[fieldCode] = {
          type: field.type,
          value: rows,
        };
        return acc;
      }
      return acc;
    },
    { id: "", fields: {} }
  );
};

const generateAttachmentMetaDataInSubtable = <
  T extends { [field: string]: Field.InSubtable }
>(
  subtableField: Field.Subtable<T>,
  localFileNameSet: Set<string>
) => {
  return subtableField.value.map((row) => {
    return Object.entries(row.value).reduce<SubTableRow>(
      (acc, [fieldCode, field]) => {
        acc.id = row.id;
        if (field.type === "FILE") {
          acc.fields[fieldCode] = {
            type: field.type,
            value: field.value.map((fileInfo) => {
              return {
                name: fileInfo.name,
                filePath: generateUniqueLocalFileName(
                  fileInfo.name,
                  localFileNameSet
                ),
                fileKey: fileInfo.fileKey,
              };
            }),
          };
          return acc;
        }
        return acc;
      },
      { id: "", fields: {} }
    );
  });
};

function generateUniqueLocalFileName(
  fileName: string,
  localFileNameSet: Set<string>
) {
  let localFileName = fileName;
  for (let i = 1; localFileNameSet.has(localFileName); i++) {
    console.log(localFileName);
    localFileName =
      path.basename(fileName, path.extname(fileName)) +
      "-" +
      i +
      path.extname(fileName);
  }
  localFileNameSet.add(localFileName);
  return localFileName;
}

const getFileInfos = (record: AttachmentMetaData): FileInfo[] => {
  return Object.values(record.fields).reduce<FileInfo[]>((acc, field) => {
    if (field.type === "FILE") {
      return [...acc, ...field.value];
    }
    if (field.type === "SUBTABLE") {
      const fileInfosInSubtable = getFileInfosInSubtable(field);
      return [...acc, ...fileInfosInSubtable];
    }
    return acc;
  }, []);
};

const getFileInfosInSubtable = (subtableField: SubTableField): FileInfo[] => {
  const rows = subtableField.value;
  return rows
    .map((row) => {
      const fieldsInRow = Object.values(row.fields);
      return fieldsInRow
        .filter((field): field is FileField => field.type === "FILE")
        .reduce<FileInfo[]>((acc, field) => [...acc, ...field.value], []);
    })
    .reduce((acc, fileInfos) => [...acc, ...fileInfos], []);
};

const downloadAttachments = async (
  apiClient: KintoneRestAPIClient,
  records: Record[],
  attachmentDir: string
) => {
  const attachmentMetaDataList = [];
  for (const record of records) {
    const attachmentMetaData = generateAttachmentMetaData(record);
    const fileInfos = getFileInfos(attachmentMetaData);
    for (const fileInfo of fileInfos) {
      const { fileKey, filePath } = fileInfo;
      const file = await apiClient.file.downloadFile({ fileKey });

      const recordId = record.$id.value as string;
      const dir = path.resolve(attachmentDir, recordId);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(path.resolve(dir, filePath), Buffer.from(file));
    }
    attachmentMetaDataList.push(attachmentMetaData);
  }
  await fs.writeFile(
    path.resolve(attachmentDir, "attachments.json"),
    JSON.stringify(attachmentMetaDataList, null, 2)
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
