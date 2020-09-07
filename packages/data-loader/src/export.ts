import { promises as fs } from "fs";
import path from "path";

import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { AppID, Record } from "@kintone/rest-api-client/lib/client/types";

type Options = {
  app: AppID;
  attachmentDir: string;
};

type FileInfo = {
  name: string;
  fileKey: string;
};

export async function exportRecords(
  apiClient: KintoneRestAPIClient,
  options: Options,
  downloadAttachmentsCallback = downloadAttachments
) {
  const { app, attachmentDir } = options;
  const result = await apiClient.record.getRecords({
    app,
  });

  // TODO: filter fields

  // TODO: extract attachment fields first

  // download attachments if exists
  result.records.forEach(async (record: Record) => {
    const fileInfos = getFileInfos(record);
    for (const fileInfo of fileInfos) {
      await downloadAttachmentsCallback(
        apiClient,
        record,
        attachmentDir,
        fileInfo
      );
    }
  });
  return result.records;
}

export const getFileInfos = (record: Record) => {
  // console.debug(`>>>record ${recordId}`);
  const fileInfos: FileInfo[] = [];
  Object.entries<{ type: string; value: unknown }>(record).forEach(
    ([fieldCode, field]) => {
      if (field.type === "FILE") {
        // @ts-expect-error field.value should be FileInformation[] type.
        field.value.forEach((fileInfo) => {
          fileInfos.push(fileInfo);
        });
      }
    }
  );
  return fileInfos;
};

export const downloadAttachments = async (
  apiClient: KintoneRestAPIClient,
  record: Record,
  attachmentDir: string,
  fileInfo: FileInfo
) => {
  const { fileKey, name } = fileInfo;
  const file = await apiClient.file.downloadFile({ fileKey: fileKey });
  const recordId = record.$id.value as string;
  const dir = path.resolve(attachmentDir, recordId);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.resolve(dir, name), Buffer.from(file));
};
