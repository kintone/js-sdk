import {
  KintoneFormFieldProperty,
  KintoneRestAPIClient,
} from "@kintone/rest-api-client";
import { AppID } from "@kintone/rest-api-client/lib/client/types";
import { buildRestAPIClient, RestAPIClientOptions } from "../api";
import path from "path";
import fs from "fs";
import { parseJson } from "../parsers/parseJson";
import { parseCsv } from "../parsers/parseCsv";
import { KintoneRecordForParameter } from "../types";
import {
  FileName,
  RecordMetadata,
  uploadAttachments,
  mergeRecordsAndMetadata,
} from "./attachments";

const CHUNK_LENGTH = 100;

export type Options = {
  app: AppID;
  filePath: string;
  attachmentDir?: string;
};

type Reporter = (text: string) => void;

export const run = async (argv: RestAPIClientOptions & Options) => {
  const apiClient = buildRestAPIClient(argv);
  const importRecords = buildImporter({ apiClient, reporter: console.log });
  await importRecords(argv).catch((e) => {
    console.log(e);
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

  async function readStream(stream: fs.ReadStream, encoding = "utf8") {
    stream.setEncoding(encoding);
    let content = "";
    for await (const chunk of stream) {
      content += chunk;
    }
    return content;
  }

  async function importRecords(options: Options) {
    const { app, filePath, attachmentDir } = options;
    const stream = fs.createReadStream(filePath);
    const content = await readStream(stream);
    const type = extractFileType(filePath);
    const records = await parseSourceAsKintoneRecords({
      type,
      source: content,
      options,
    });
    if (!attachmentDir) {
      return addAllRecordsChunk(app, records);
    }
    const filePath1 = path.resolve(attachmentDir, "attachments.json");
    const stream1 = fs.createReadStream(filePath1);
    const content1 = await readStream(stream1);
    const type1 = extractFileType(filePath1);
    const recordMetadataList = await parseSourceAsAttachmentMetadata({
      type: type1,
      source: content1,
    });
    const { properties: schema } = await apiClient.app.getFormFields<
      Record<string, KintoneFormFieldProperty.OneOf>
    >(options);
    const metadata = await uploadAttachments(
      apiClient,
      records,
      schema,
      recordMetadataList,
      attachmentDir
    );
    const recordsWithAttachments = mergeRecordsAndMetadata(
      records,
      schema,
      metadata
    );
    return addAllRecordsChunk(app, recordsWithAttachments);
  }

  async function parseSourceAsKintoneRecords({
    type,
    source,
    options,
  }: {
    type: string;
    source: string;
    options: Options;
  }) {
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
  }

  const parseSourceAsAttachmentMetadata = ({
    type,
    source,
  }: {
    type: string;
    source: string;
  }) => {
    switch (type) {
      case "json":
        return JSON.parse(source) as Array<RecordMetadata<FileName>>;
      default:
        throw new Error(`Unexpected file type: ${type} is unacceptable.`);
    }
  };

  async function addAllRecordsChunk(
    app: AppID,
    allRecords: KintoneRecordForParameter[]
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
