import { KintoneRecordForResponse } from "../types/kintone";
import { DataLoaderRecord } from "../types/data-loader";

export const convertKintoneRecordsToDataLoaderRecords = (
  kintoneRecords: KintoneRecordForResponse[]
): DataLoaderRecord[] => {
  const records = [];
  for (const kintoneRecord of kintoneRecords) {
    const record: DataLoaderRecord = {};
    for (const [fieldCode, field] of Object.entries(kintoneRecord)) {
      record[fieldCode] = field;
    }
    records.push(record);
  }
  return records;
};
