import { parseJson } from "./jsonParser";
import { parseCsv } from "./csvParser";

export const buildParser = (type: string) => {
  switch (type) {
    case "json":
      return parseJson;
    case "csv":
      return parseCsv;
    default:
      throw new Error(`Unexpected file type: ${type} is unacceptable.`);
  }
};
