import { DataLoaderRecord } from "../types/data-loader";
import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { printAsJson } from "./printAsJson";
import { printAsCsv } from "./printAsCsv";

export type ExportFileFormat = "json" | "csv";

export const printRecords: (options: {
  apiClient: KintoneRestAPIClient;
  records: DataLoaderRecord[];
  app: string;
  format?: ExportFileFormat;
  attachmentsDir?: string;
}) => void = async (options) => {
  const { apiClient, records, app, format, attachmentsDir } = options;
  switch (format) {
    case "json": {
      printAsJson(records);
      break;
    }
    case "csv": {
      // TODO: pass the schema as arguments
      printAsCsv({
        records,
        fieldsJson: await apiClient.app.getFormFields({ app }),
        attachmentsDir,
      });
      break;
    }
    default: {
      throw new Error(
        `Unknown format type. '${format}' is unknown as a format option.`
      );
    }
  }
};
