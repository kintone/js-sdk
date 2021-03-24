import { convertKintoneRecordsToCsv } from "../convertKintoneRecordsToCsv";
import fs from "fs";
import path from "path";
import { FieldsJson, KintoneRecord } from "../index";

const records: KintoneRecord[] = require("./fixtures/input.json");
const fieldsJson: FieldsJson = require("./fixtures/fields.json");
const subTableRecords: KintoneRecord[] = require("./fixtures/subtable_input.json");
const subTableFieldsJson: FieldsJson = require("./fixtures/subtable_fields.json");

describe("convertKintoneRecordsToCsv", () => {
  it("should convert kintone records to csv string correctly", async () => {
    const expectedCsv = await fs.promises.readFile(
      path.resolve(__dirname, "fixtures", "records.csv"),
      "utf8"
    );
    expect(convertKintoneRecordsToCsv({ records, fieldsJson })).toBe(
      expectedCsv
    );
  });
  it("should convert kintone records to csv string correctly when SUBTABLE included", async () => {
    const expectedCsv = await fs.promises.readFile(
      path.resolve(__dirname, "fixtures", "subtable_records.csv"),
      "utf8"
    );
    expect(
      convertKintoneRecordsToCsv({
        records: subTableRecords,
        fieldsJson: subTableFieldsJson,
      })
    ).toBe(expectedCsv);
  });
});
