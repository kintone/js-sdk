import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { AppID } from "@kintone/rest-api-client/lib/client/types";
import { buildRestAPIClient } from "../api";
import { parser } from "../parser";
import { promises as fs } from "fs";
import path from "path";

type Argv = {
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

export const command = "import";

export const desc = "import the records of the specified app";

export const builder = (yargs: any) =>
  yargs
    .option("base-url", {
      describe: "Kintone Base Url",
      default: process.env.KINTONE_BASE_URL,
    })
    .option("username", {
      alias: "u",
      describe: "Kintone Username",
      default: process.env.KINTONE_USERNAME,
    })
    .option("password", {
      alias: "p",
      describe: "Kintone Password",
      default: process.env.KINTONE_PASSWORD,
    })
    .option("app", {
      describe: "The ID of the app",
    })
    .option("id", {
      describe: "The ID of the record",
    })
    .option("attachment-dir", {
      describe: "Attachment file directory",
      default: "attachments",
    })
    .option("file-path", {
      describe: "file path",
    }).argv;

export const handler = async (argv: Argv) => {
  try {
    const apiClient = buildRestAPIClient(argv);
    await importRecords(apiClient, argv);
  } catch (e) {
    console.error(e);
  }
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
