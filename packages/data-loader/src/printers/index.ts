import { DataLoaderRecord } from "../types/data-loader";
import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { printAsJson } from "./printAsJson";
import { printAsCsv } from "./printAsCsv";

export type ExportFileFormat = "json" | "csv";

export const printRecords = async ({
  records,
  app,
  format,
  apiClient,
}: {
  records: DataLoaderRecord[];
  app: string;
  format?: ExportFileFormat;
  apiClient: KintoneRestAPIClient;
}) => {
  switch (format) {
    case "json": {
      printAsJson(records);
      break;
    }
    case "csv": {
      // TODO: pass the schema as arguments
      printAsCsv(records, await apiClient.app.getFormFields({ app }));
      break;
    }
    default: {
      throw new Error(
        `Unknown format type. '${format}' is unknown as a format option.`
      );
    }
  }
};
