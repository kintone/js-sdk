import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { AppID } from "@kintone/rest-api-client/lib/client/types";
import { buildRestAPIClient } from "../api";
import { parser } from "../parser";
import { promises as fs } from "fs";
import path from "path";

export type Argv = {
  baseUrl: string;
  username: string;
  password: string;
  app: string | number;
  id: string | number;
  attachmentDir: string;
  filePath: string;
};

type Options = {
  app: AppID;
  attachmentDir: string;
  filePath: string;
};

export const run = async (argv: Argv) => {
  const apiClient = buildRestAPIClient(argv);
  await importRecords(apiClient, argv);
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
