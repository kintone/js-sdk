import { parseJson } from "./parseJson";
import { parseCsv } from "./parseCsv";
import { FieldsJson, ParsedRecord } from "../types";

function buildParser(
  type: string
): (sourceString: string, fieldsJson?: FieldsJson) => ParsedRecord[];

function buildParser(type: string) {
  switch (type) {
    case "json":
      return parseJson;
    case "csv":
      return parseCsv;
    default:
      throw new Error(`Unexpected file type: ${type} is unacceptable.`);
  }
}

export { buildParser };
