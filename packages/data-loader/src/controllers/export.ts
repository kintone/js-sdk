import { buildRestAPIClient, RestAPIClientOptions } from "../api";
import { getRecords } from "../usecase/get";
import { ExportFileFormat, printRecords } from "../printers";

export type Options = {
  app: string;
  attachmentsDir?: string;
  format?: ExportFileFormat;
  condition?: string;
  orderBy?: string;
};

export const run: (
  argv: RestAPIClientOptions & Options
) => Promise<void> = async (argv) => {
  const {
    app,
    format,
    condition,
    orderBy,
    attachmentsDir,
    ...restApiClientOptions
  } = argv;
  const apiClient = buildRestAPIClient(restApiClientOptions);
  const records = await getRecords(apiClient, app, {
    condition,
    orderBy,
    attachmentsDir,
  });
  await printRecords({
    apiClient,
    records,
    app,
    format,
    attachmentsDir,
  });
};
