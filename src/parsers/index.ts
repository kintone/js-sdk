import {
  KintoneFormFieldProperty,
  KintoneRestAPIClient,
} from "@kintone/rest-api-client";
import { KintoneRecordForParameter } from "../types/kintone";
import fs from "fs";
import { parseJson } from "./parseJson";
import { parseCsv } from "./parseCsv";
import { Options } from "../controllers/import";

export const parseRecords: (options: {
  apiClient: KintoneRestAPIClient;
  source: string;
  format: string;
  app: string;
}) => Promise<KintoneRecordForParameter[]> = async (options) => {
  const { apiClient, source, format } = options;
  // TODO: convert to DataLoaderRecords[]
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
