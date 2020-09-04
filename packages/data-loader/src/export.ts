import fs from "fs";
import path from "path";

import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { AppID } from "@kintone/rest-api-client/lib/client/types";

export async function exportRecords(
  apiClient: KintoneRestAPIClient,
  app: AppID
) {
  const result = await apiClient.record.getRecords({
    app,
  });

  // TODO: filter fields

  // TODO: extract attachment fields first

  // download attachments if exists
  result.records.forEach((record) => {
    const recordId = record.$id.value as string;
    // console.debug(`>>>record ${recordId}`);
    Object.entries(record).forEach(([fieldCode, field]) => {
      if (field.type === "FILE") {
        field.value.forEach(async (fileInfo) => {
          const fileName = fileInfo.name;
          const fileKey = fileInfo.fileKey;
          const file = await apiClient.file.downloadFile({ fileKey: fileKey });

          // TODO: can accept target directory name as an option
          const dir = path.resolve("attachments", recordId);
          fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(path.resolve(dir, fileName), Buffer.from(file));
        });
      }
      // console.debug(fieldCode, field);
    });
  });
  return result.records;
}
