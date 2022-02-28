import { buildRestAPIClient, RestAPIClientOptions } from "../api";
import { readFile } from "../utils/file";
import { parseRecords } from "../parsers";
import { uploadRecords } from "../kintone/upload";

export type Options = {
  app: string;
  filePath: string;
};

export const run: (
  argv: RestAPIClientOptions & Options
) => Promise<void> = async (argv) => {
  const { app, filePath, ...restApiClientOptions } = argv;

  const apiClient = buildRestAPIClient(restApiClientOptions);

  try {
    const { content, format } = await readFile(filePath);
    const records = await parseRecords({
      apiClient,
      source: content,
      app,
      format,
    });
    await uploadRecords({ apiClient, app, records });
  } catch (e) {
    console.log(e);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
};
