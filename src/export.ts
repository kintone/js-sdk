import fs from "fs";
import path from "path";

import mkdirp from "mkdirp";
import { KintoneRestAPIClient } from "@kintone/rest-api-client";

export async function exportRecords(argv: any) {
  const client = new KintoneRestAPIClient({
    auth: {
      username: argv.username,
      password: argv.password,
    },
    baseUrl: argv["base-url"],
  });
  const result = await client.record.getRecords({
    app: argv.app,
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
          const file = await client.file.downloadFile({ fileKey: fileKey });

          // TODO: can accept target directory name as an option
          const dir = path.resolve("attachments", recordId);
          mkdirp.sync(dir);
          fs.writeFileSync(path.resolve(dir, fileName), Buffer.from(file));
        });
      }
      // console.debug(fieldCode, field);
    });
  });
  return result.records;
}
