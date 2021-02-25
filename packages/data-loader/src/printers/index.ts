import { csvPrinter } from "./csvPrinter";
import { jsonPrinter } from "./jsonPrinter";

export const buildPrinter = (type = "json") => {
  switch (type) {
    case "json": {
      return jsonPrinter;
    }
    case "csv": {
      return csvPrinter;
    }
    default: {
      throw new Error(
        `Unknown format type. '${type}' is unknown as a format option.`
      );
    }
  }
};
