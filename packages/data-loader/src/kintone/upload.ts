import { KintoneRecordForParameter } from "../types/kintone";
import { KintoneRestAPIClient } from "@kintone/rest-api-client";

const CHUNK_LENGTH = 100;

export const uploadRecords: (options: {
  apiClient: KintoneRestAPIClient;
  app: string;
  records: KintoneRecordForParameter[];
}) => Promise<void> = async (options) => {
  const { apiClient, app, records } = options;
  // TODO: convert DataLoaderRecords to KintoneRecordForParameter
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
