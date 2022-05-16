import { buildRestAPIClient, RestAPIClientOptions } from "../api";
import { readFile } from "../utils/file";
import { parseRecords } from "../parsers";
import { addRecords } from "../usecase/add";
import { upsertRecords } from "../usecase/upsert";
import { KintoneRestAPIClient } from "@kintone/rest-api-client";

export type Options = {
  app: string;
  filePath: string;
  attachmentsDir?: string;
  updateKey?: string;
};

export const run: (
  argv: RestAPIClientOptions & Options
) => Promise<void> = async (argv) => {
  const { app, filePath, attachmentsDir, updateKey, ...restApiClientOptions } =
    argv;

  const apiClient = buildRestAPIClient(restApiClientOptions);

  try {
    const { content, format } = await readFile(filePath);
    const records = await parseRecords({
      apiClient,
      source: content,
      app,
      format,
    });
    if (updateKey) {
      await upsertRecords(apiClient, app, records, updateKey, {
        attachmentsDir,
      });
    } else {
      await addRecords(apiClient, app, records, { attachmentsDir });
    }
  } catch (e) {
    console.log(e);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
};

type Deps = { apiClient: KintoneRestAPIClient };
export const func = (deps: Deps) => (appId: string) => {
  return true;
};
