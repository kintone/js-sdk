import { KintoneRecordField } from "@kintone/rest-api-client";
import { fromJSON } from "./csvConverter/fromJSON";

const printJSON = (value: unknown) => {
  console.log(JSON.stringify(value, null, 2));
};

const printCSV = (
  records: Array<{ [k: string]: KintoneRecordField.OneOf }>
) => {
  console.log(fromJSON(records));
};

export const buildPrinter = (type = "json") => {
  switch (type) {
    case "json": {
      return printJSON;
    }
    case "csv": {
      return printCSV;
    }
    default: {
      throw new Error(
        `Unknown format type. '${type}' is unknown as a format option.`
      );
    }
  }
};
