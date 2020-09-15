import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { AppID } from "@kintone/rest-api-client/lib/client/types";
import { csvParser } from "../parser";

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

  const data = csvParser(buf.toString());
  const records = data.map((d) => {
    const keys = Object.keys(d);
    const row: {
      [key: string]: any;
    } = {};
    for (const key of keys) {
      row[key] = {
        value: d[key],
      };
    }
    return row;
  });
  console.log(records);

  // TODO: call rest api
  apiClient.record.addAllRecords({
    app,
    records,
  });
}
