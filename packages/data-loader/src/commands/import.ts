import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { AppID } from "@kintone/rest-api-client/lib/client/types";
import { csvParser } from "../parser";
import { promises as fs } from "fs";

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
  const buf = await fs.readFile(filePath);
  const records = csvParser(buf.toString());
  await apiClient.record.addAllRecords({
    app,
    records,
  });
}
