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

describe("csvParser", () => {
  it("should convert csv string to JSON correctly", async () => {
    const csv = await fs.promises.readFile(
      path.resolve(__dirname, "fixtures", "records.csv"),
      "utf-8"
    );
    expect(parseCsv(csv, fieldsJson)).toEqual(outputJson);
  });
});
