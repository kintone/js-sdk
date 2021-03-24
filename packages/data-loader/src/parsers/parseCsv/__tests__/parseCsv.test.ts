import {
  KintoneRecordField,
  KintoneFormFieldProperty,
} from "@kintone/rest-api-client";
import fs from "fs";
import path from "path";
import { parseCsv } from "../index";
const expectedJson: Array<{
  [k: string]: KintoneRecordField.OneOf;
}> = require("./fixtures/expected.json");
const fieldsJson: {
  properties: { [k: string]: KintoneFormFieldProperty.OneOf };
} = require("./fixtures/fields.json");
const subTableExpectedJson: Array<{
  [k: string]: KintoneRecordField.OneOf;
}> = require("./fixtures/subtable_expected.json");
const subTableFieldsJson: {
  properties: { [k: string]: KintoneFormFieldProperty.OneOf };
} = require("./fixtures/subtable_fields.json");

describe("csvParser", () => {
  it("should convert csv string to JSON correctly", async () => {
    const csv = await fs.promises.readFile(
      path.resolve(__dirname, "fixtures", "records.csv"),
      "utf-8"
    );
    expect(parseCsv(csv, fieldsJson)).toEqual(expectedJson);
  });
  it("should convert subtable included csv string to JSON correctly", async () => {
    const csv = await fs.promises.readFile(
      path.resolve(__dirname, "fixtures", "subtable_records.csv"),
      "utf-8"
    );
    expect(parseCsv(csv, subTableFieldsJson)).toEqual(subTableExpectedJson);
  });
});
