import { printAsCsv } from "./printAsCsv";
import { printAsJson } from "./printAsJson";

export const buildPrinter = (type = "json") => {
  switch (type) {
    case "json": {
      return printAsJson;
    }
    case "csv": {
      return printAsCsv;
    }
    default: {
      throw new Error(
        `Unknown format type. '${type}' is unknown as a format option.`
      );
    }
  }
};
