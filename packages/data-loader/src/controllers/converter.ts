import { KintoneRecordForResponse } from "../types/kintone";
import { DataLoaderRecord, DataLoaderFields } from "../types/data-loader";

export const convertKintoneRecordsToDataLoaderRecords = (
  kintoneRecords: KintoneRecordForResponse[]
): DataLoaderRecord[] => {
  const records = [];
  for (const kintoneRecord of kintoneRecords) {
    const record: DataLoaderRecord = {};
    for (const [fieldCode, field] of Object.entries(kintoneRecord)) {
      if (field.type === "FILE") {
        const fileField: DataLoaderFields.File = {
          type: "FILE",
          value: field.value.map((fileInfo) => {
            return {
              ...fileInfo,
              localFilePath: "",
            };
          }),
        };
        record[fieldCode] = fileField;
      } else {
        record[fieldCode] = field;
      }
    }
    records.push(record);
  }
  return records;
};
