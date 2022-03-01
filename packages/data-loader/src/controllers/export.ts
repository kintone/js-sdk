import { buildRestAPIClient, RestAPIClientOptions } from "../api";
import { downloadRecords } from "../kintone/download";
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
  const records = await downloadRecords({
    apiClient,
    app,
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
