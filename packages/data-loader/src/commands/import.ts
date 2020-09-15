import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { AppID } from "@kintone/rest-api-client/lib/client/types";

import fs from "fs";

type Options = {
  app: AppID;
  attachmentDir: string;
  filePath: string;
};

export async function importRecords(
  apiClient: KintoneRestAPIClient,
  options: Options
) {
  const { app, filePath } = options;
  const buf = fs.readFileSync(filePath);
  const data = buf.toString().split("\n");
  const [columnRow, ...dataRows] = data;
  const records = [];
  const columns = columnRow.split(",");
  for (const dataRow of dataRows) {
    const fields = dataRow.split(",");
    const row: {
      [key: string]: any;
    } = {};
    for (const index in columns) {
      const fieldValue = fields[index];
      const column = columns[index];
      row[column] = {
          value: fieldValue,
      }
    }
    records.push(row);
  }

  // TODO: call rest api
  apiClient.record.addAllRecords({
    app,
    records,
  });
}
