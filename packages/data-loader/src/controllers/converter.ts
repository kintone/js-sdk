import { KintoneRecordForResponse } from "../types/kintone";
import { DataLoaderRecord, DataLoaderFields } from "../types/data-loader";
import path from "path";

export const convertKintoneRecordsToDataLoaderRecords = (
  kintoneRecords: KintoneRecordForResponse[],
  attachmentsDir?: string
): DataLoaderRecord[] => {
  const records = [];
  for (const kintoneRecord of kintoneRecords) {
    const record: DataLoaderRecord = {};
    for (const [fieldCode, field] of Object.entries(kintoneRecord)) {
      if (field.type === "FILE") {
        const fileField: DataLoaderFields.File = {
          type: "FILE",
          value: field.value.map((fileInfo) => {
            if (attachmentsDir) {
              return {
                ...fileInfo,
                localFilePath: path.join(
                  attachmentsDir,
                  `${fieldCode}-${kintoneRecord.$id.value as string}`,
                  fileInfo.name
                ),
              };
            }

            return fileInfo;
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
