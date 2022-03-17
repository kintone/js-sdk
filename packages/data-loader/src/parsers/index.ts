import {
  KintoneFormFieldProperty,
  KintoneRestAPIClient,
} from "@kintone/rest-api-client";
import { parseJson } from "./parseJson";
import { parseCsv } from "./parseCsv2";
import { RecordForImport } from "../types/data-loader";

export const parseRecords: (options: {
  apiClient: KintoneRestAPIClient;
  source: string;
  format: string;
  app: string;
}) => Promise<RecordForImport[]> = async (options) => {
  const { apiClient, source, format } = options;
  switch (format) {
    case "json":
      return parseJson(source);
    case "csv":
      return parseCsv(
        source,
        await apiClient.app.getFormFields<
          Record<string, KintoneFormFieldProperty.OneOf>
        >(options)
      );
    default:
      throw new Error(`Unexpected file type: ${format} is unacceptable.`);
  }
};
