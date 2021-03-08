import {
  KintoneRecordField,
  KintoneFormFieldProperty,
} from "@kintone/rest-api-client";
import fs from "fs";
import path from "path";
import { parseCsv } from "../csvParser";
const outputJson: Array<{
  [k: string]: KintoneRecordField.OneOf;
}> = require("./fixtures/output.json");
const fieldsJson: {
  properties: { [k: string]: KintoneFormFieldProperty.OneOf };
} = require("./fixtures/fields.json");
const subTableOutputJson: Array<{
  [k: string]: KintoneRecordField.OneOf;
}> = require("./fixtures/subtable_output.json");
const subTableFieldsJson: {
  properties: { [k: string]: KintoneFormFieldProperty.OneOf };
} = require("./fixtures/subtable_fields.json");

describe("csvParser", () => {
  it("should convert csv string to JSON correctly", async () => {
    const csv = await fs.promises.readFile(
      path.resolve(__dirname, "fixtures", "records.csv"),
      "utf-8"
    );
    expect(parseCsv(csv, fieldsJson)).toEqual(outputJson);
  });
  it("should convert subtable included csv string to JSON correctly", async () => {
    const csv = await fs.promises.readFile(
      path.resolve(__dirname, "fixtures", "subtable_records.csv"),
      "utf-8"
    );
    expect(parseCsv(csv, subTableFieldsJson)).toEqual(subTableOutputJson);
  });
});
