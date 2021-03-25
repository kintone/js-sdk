import { promises as fs } from "fs";
import path from "path";
import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { AppID, Record } from "@kintone/rest-api-client/lib/client/types";
import { buildRestAPIClient, RestAPIClientOptions } from "../api";
import { KintoneRecord } from "../types";
import { printAsJson } from "../printers/printAsJson";
import { printAsCsv } from "../printers/printAsCsv";

export type Options = {
  app: AppID;
  attachmentDir?: string;
  format?: "json" | "csv";
  query?: string;
  exportFields?: string;
};

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

const getFileInfos = (record: Record) => {
  // console.debug(`>>>record ${recordId}`);
  const fileInfos: FileInfo[] = [];
  Object.values<{ type: string; value: unknown }>(record).forEach((field) => {
    if (field.type === "FILE") {
      // @ts-expect-error field.value should be FileInformation[] type.
      field.value.forEach((fileInfo) => {
        fileInfos.push(fileInfo);
      });
    }
  });
  return fileInfos;
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
  records: KintoneRecord[];
  argv: RestAPIClientOptions & Options;
  apiClient: KintoneRestAPIClient;
}) {
  switch (argv.format) {
    case "json": {
      printAsJson({ records, exportFields: argv.exportFields });
      break;
    }
    case "csv": {
      printAsCsv({
        records,
        fieldsJson: await apiClient.app.getFormFields(argv),
        exportFields: argv.exportFields,
      });
      break;
    }
    default: {
      throw new Error(
        `Unknown format type. '${argv.format}' is unknown as a format option.`
      );
    }
  }
}
