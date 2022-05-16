import { csv } from "./input";
import { FieldsJson } from "../../../../../types/kintone";
import { RecordForImport } from "../../../../../types/data-loader/import/record";

export const pattern: {
  description: string;
  fieldsJson: FieldsJson;
  input: string;
  expected: RecordForImport;
} = {
  description: "should convert csv string to JSON correctly",
  fieldsJson: require("./fields.json"),
  input: csv,
  expected: require("./expected.json"),
};
