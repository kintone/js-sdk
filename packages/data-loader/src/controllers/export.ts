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

export const run = async (argv: RestAPIClientOptions & Options) => {
  const {
    app,
    format,
    condition,
    orderBy,
    attachmentsDir,
    ...restApiClientOptions
  } = argv;
  const apiClient = buildRestAPIClient(restApiClientOptions);
  const records = await downloadRecords(apiClient, {
    app,
    condition,
    orderBy,
    attachmentsDir,
  });
  await printRecords({
    records,
    app,
    format,
    apiClient,
    attachmentsDir,
  });
};
