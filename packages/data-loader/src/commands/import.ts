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
  const { filePath } = options;
  const content = fs.readFileSync(filePath);
  console.log(content.toString());
  // TODO: call rest api
}
