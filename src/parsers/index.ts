import { parseCsv } from "./csvParser";
import { parseJson } from "./jsonParser";

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
