import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { AppID } from "@kintone/rest-api-client/lib/client/types";
import { parser } from "../parser";
import { promises as fs } from "fs";
import path from "path";

type Options = {
  app: AppID;
  attachmentDir: string;
  filePath: string;
};

const extractFileType = (filepath: string) => {
  // TODO this cannot detect file type without extensions
  return path.extname(filepath).split(".").pop() || "";
};

export async function importRecords(
  apiClient: KintoneRestAPIClient,
  options: Options
) {
  const { app, filePath } = options;
  const buf = await fs.readFile(filePath);
  const type = extractFileType(filePath);
  const records = parser(type, buf.toString());
  await apiClient.record.addAllRecords({
    app,
    records,
  });
}
