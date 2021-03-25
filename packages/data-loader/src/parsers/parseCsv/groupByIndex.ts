import { RECORD_INDEX } from "../../printers/printAsCsv/constants";
import { CsvRecords } from "../../types";

export const groupByIndex = (records: CsvRecords) => {
  return records.reduce<Record<string, Array<{ [k: string]: string }>>>(
    (ret, record) => {
      if (ret[record[RECORD_INDEX]]) {
        ret[record[RECORD_INDEX]].push(record);
      } else {
        ret[record[RECORD_INDEX]] = [record];
      }
      return ret;
    },
    {}
  );
};
