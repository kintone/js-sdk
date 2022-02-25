import {
  KintoneFormFieldProperty,
  KintoneRestAPIClient,
} from "@kintone/rest-api-client";
import { buildRestAPIClient, RestAPIClientOptions } from "../api";
import path from "path";
import fs from "fs";
import { parseJson } from "../parsers/parseJson";
import { parseCsv } from "../parsers/parseCsv";
import { KintoneRecordForParameter } from "../types/kintone";

const CHUNK_LENGTH = 100;

export type Options = {
  app: string;
  filePath: string;
};

export const run = async (argv: RestAPIClientOptions & Options) => {
  const { app, filePath } = argv;

  const apiClient = buildRestAPIClient(argv);

  try {
    const records = await parseRecords({ app, filePath, apiClient });
    await uploadRecords({ records, app, apiClient });
  } catch (e) {
    console.log(e);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
};

const parseRecords: (options: {
  app: string;
  filePath: string;
  apiClient: KintoneRestAPIClient;
}) => Promise<KintoneRecordForParameter[]> = async (options) => {
  const { filePath, apiClient } = options;
  const stream = fs.createReadStream(filePath);
  const content = await readStream(stream);
  const type = extractFileType(filePath);
  const records = await parseSource({
    type,
    source: content,
    options,
    apiClient,
  });
  console.log(records);
  // TODO: convert to DataLoaderRecords[]
  return records;
};

const readStream = async (stream: fs.ReadStream, encoding = "utf8") => {
  stream.setEncoding(encoding);
  let content = "";
  for await (const chunk of stream) {
    content += chunk;
  }
  return content;
};

const extractFileType = (filepath: string) => {
  // TODO this cannot detect file type without extensions
  return path.extname(filepath).split(".").pop() || "";
};

const parseSource = async ({
  type,
  source,
  options,
  apiClient,
}: {
  type: string;
  source: string;
  options: Options;
  apiClient: KintoneRestAPIClient;
}) => {
  switch (type) {
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
      throw new Error(`Unexpected file type: ${type} is unacceptable.`);
  }
};

const uploadRecords: (options: {
  app: string;
  records: KintoneRecordForParameter[];
  apiClient: KintoneRestAPIClient;
}) => Promise<void> = async (options) => {
  const { app, records, apiClient } = options;
  let chunkStartIndex = 0;
  while (chunkStartIndex < records.length) {
    const chunkNextIndex =
      records.length < chunkStartIndex + CHUNK_LENGTH
        ? records.length
        : chunkStartIndex + CHUNK_LENGTH;
    try {
      await apiClient.record.addRecords({
        app,
        records: records.slice(chunkStartIndex, chunkNextIndex),
      });
      console.log(
        `SUCCESS: records[${chunkStartIndex} - ${chunkNextIndex - 1}]`
      );
    } catch (e) {
      console.log(
        `FAILED: records[${chunkStartIndex} - ${records.length - 1}]`
      );
      throw e;
    }
    chunkStartIndex = chunkNextIndex;
  }
};
