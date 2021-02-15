import { promises as fs } from "fs";
import path from "path";
import PQueue from "p-queue";

import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { AppID, Record } from "@kintone/rest-api-client/lib/client/types";
import { buildRestAPIClient, RestAPIClientOptions } from "../api";
import { buildPrinter } from "../printers";

export type Options = {
  app: AppID;
  attachmentDir?: string;
  format?: "json" | "csv";
  query?: string;
};

type FileInfo = {
  name: string;
  fileKey: string;
};

export const run = async (argv: RestAPIClientOptions & Options) => {
  const apiClient = buildRestAPIClient(argv);
  const records = await exportRecords(apiClient, argv);
  const printer = buildPrinter(argv.format);
  printer(records);
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

  if (!attachmentDir) {
    return records;
  }
  // download attachments if exists
  const fetchFiles = async (record: Record) => {
    const fileInfos = getFileInfos(record);
    for (const fileInfo of fileInfos) {
      await downloadAttachments(apiClient, record, attachmentDir, fileInfo);
    }
  };
  const queue = new PQueue({ concurrency: 5 });
  await queue.addAll(
    records.map((record: Record) => {
      return () => {
        return fetchFiles(record);
      };
    })
  );
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
  record: Record,
  attachmentDir: string,
  fileInfo: FileInfo
) => {
  const { fileKey, name } = fileInfo;
  const file = await apiClient.file.downloadFile({ fileKey });
  const recordId = record.$id.value as string;
  const dir = path.resolve(attachmentDir, recordId);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.resolve(dir, name), Buffer.from(file));
};
