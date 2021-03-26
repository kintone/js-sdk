import { PRIMARY_MARK } from "../../printers/printAsCsv/constants";
import { CsvRecords } from "../../types";

export const groupByIndex = (records: CsvRecords) => {
  let cursor = 0;
  return records.reduce<Record<string, Array<{ [k: string]: string }>>>(
    (ret, record) => {
      if (record[PRIMARY_MARK]) {
        cursor++;
      }

      if (ret[cursor]) {
        ret[cursor].push(record);
      } else {
        ret[cursor] = [record];
      }
      return ret;
    },
    {}
  );
};
