import {
  KintoneFormFieldProperty,
  KintoneRestAPIClient,
} from "@kintone/rest-api-client";
import { AppID } from "@kintone/rest-api-client/lib/client/types";
import { buildRestAPIClient, RestAPIClientOptions } from "../api";
import { buildParser } from "../parsers";
import { promises as fs } from "fs";
import path from "path";

const CHUNK_LENGTH = 100;

export type Options = {
  app: AppID;
  filePath: string;
};

type Reporter = (text: string) => void;

export const run = async (argv: RestAPIClientOptions & Options) => {
  const apiClient = buildRestAPIClient(argv);
  const importRecords = buildImporter({ apiClient, reporter: console.log });
  await importRecords(argv).catch(() => {
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  });
};

export const buildImporter = ({
  apiClient,
  reporter,
}: {
  apiClient: KintoneRestAPIClient;
  reporter: Reporter;
}) => {
  const extractFileType = (filepath: string) => {
    // TODO this cannot detect file type without extensions
    return path.extname(filepath).split(".").pop() || "";
  };

  async function importRecords(options: Options) {
    const { app, filePath } = options;
    const buf = await fs.readFile(filePath);
    const type = extractFileType(filePath);
    const parser = buildParser(type);

    const records =
      type === "csv"
        ? parser(buf.toString(), await fetchFieldsJson(options))
        : // @ts-ignore
          parser(buf.toString());
    await addAllRecordsChunk(app, records);
  }

  async function fetchFieldsJson(options: Options) {
    const fieldsJson = await apiClient.app.getFormFields<
      Record<string, KintoneFormFieldProperty.OneOf>
    >(options);
    return fieldsJson;
  }

  async function addAllRecordsChunk(
    app: AppID,
    allRecords: Array<Record<string, Record<"value", unknown>>>
  ) {
    let chunkStartIndex = 0;
    while (chunkStartIndex < allRecords.length) {
      const chunkNextIndex =
        allRecords.length < chunkStartIndex + CHUNK_LENGTH
          ? allRecords.length
          : chunkStartIndex + CHUNK_LENGTH;
      try {
        await apiClient.record.addRecords({
          app,
          records: allRecords.slice(chunkStartIndex, chunkNextIndex),
        });
        reporter(
          `SUCCESS: records[${chunkStartIndex} - ${chunkNextIndex - 1}]`
        );
      } catch (e) {
        reporter(
          `FAILED: records[${chunkStartIndex} - ${allRecords.length - 1}]`
        );
        throw e;
      }
      chunkStartIndex = chunkNextIndex;
    }
  }

  return importRecords;
};
