import fs from "fs";
import path from "path";

import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { AppID, Record } from "@kintone/rest-api-client/lib/client/types";

type Options = {
  app: AppID;
  attachmentDir: string;
};

export async function exportRecords(
  apiClient: KintoneRestAPIClient,
  options: Options,
  processRecordCallback: typeof processRecord
) {
  const { app, attachmentDir } = options;
  const result = await apiClient.record.getRecords({
    app,
  });

  // TODO: filter fields

  // TODO: extract attachment fields first

  // download attachments if exists
  result.records.forEach((record) =>
    processRecordCallback(apiClient, attachmentDir, record)
  );
  return result.records;
}

export const processRecord = async (
  apiClient: KintoneRestAPIClient,
  attachmentDir: string,
  record: Record
) => {
  const recordId = record.$id.value as string;
  // console.debug(`>>>record ${recordId}`);
  Object.entries(record).forEach(([fieldCode, field]) => {
    if (field.type === "FILE") {
      field.value.forEach(async (fileInfo) => {
        const fileName = fileInfo.name;
        const fileKey = fileInfo.fileKey;
        const file = await apiClient.file.downloadFile({ fileKey: fileKey });

        const dir = path.resolve(attachmentDir, recordId);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.resolve(dir, fileName), Buffer.from(file));
      });
    }
    // console.debug(fieldCode, field);
  });
};
