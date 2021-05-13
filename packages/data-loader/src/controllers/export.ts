import { promises as fs } from "fs";
import path from "path";
import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { AppID, Record } from "@kintone/rest-api-client/lib/client/types";
import { buildRestAPIClient, RestAPIClientOptions } from "../api";
import { KintoneRecordForResponse } from "../types";
import { printAsJson } from "../printers/printAsJson";
import { printAsCsv } from "../printers/printAsCsv";

export type Options = {
  app: AppID;
  attachmentDir?: string;
  format?: ExportFileFormat;
  query?: string;
};

export type ExportFileFormat = "json" | "csv";

type FileInfo = {
  name: string;
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
  const { app, attachmentDir, query } = options;
  const records = await apiClient.record.getAllRecords({
    app,
    condition: query,
  });

  // TODO: filter fields

  // TODO: extract attachment fields first

  if (attachmentDir) {
    await downloadAttachments(apiClient, records, attachmentDir);
  }

  return records;
}

const getFileInfos = (record: Record): FileInfo[] => {
  return Object.values(record).reduce<FileInfo[]>((acc, field) => {
    if (field.type === "FILE") {
      return [...acc, ...field.value];
    }
    if (field.type === "SUBTABLE") {
      const rows = field.value;
      const fileInfos = rows
        .map((r) => {
          const fieldsInRow = Object.values(r.value);
          return fieldsInRow.reduce<FileInfo[]>((a, f) => {
            if (f.type === "FILE") {
              return [...a, ...f.value];
            }
            return a;
          }, []);
        })
        .reduce((a, f) => [...a, ...f], []);
      return [...acc, ...fileInfos];
    }
    return acc;
  }, []);
};

const downloadAttachments = async (
  apiClient: KintoneRestAPIClient,
  records: Record[],
  attachmentDir: string
) => {
  for (const record of records) {
    const fileInfos = getFileInfos(record);
    for (const fileInfo of fileInfos) {
      const { fileKey, name } = fileInfo;
      const file = await apiClient.file.downloadFile({ fileKey });

      const recordId = record.$id.value as string;
      const dir = path.resolve(attachmentDir, recordId);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(path.resolve(dir, name), Buffer.from(file));
    }
  }
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
