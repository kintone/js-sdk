import {
  KintoneRecordField,
  KintoneFormFieldProperty,
} from "@kintone/rest-api-client";
import { parseCsv } from "../csvParser";
import fs from "fs";
import path from "path";
import readline from "readline";

const outputJson: Array<{
  [k: string]: KintoneRecordField.OneOf;
}> = require("./fixtures/output.json");
const fieldsJson: {
  properties: { [k: string]: KintoneFormFieldProperty.OneOf };
} = require("./fixtures/fields.json");

describe("csvParser", () => {
  it("should convert csv string to JSON correctly", async () => {
    // const csv = await fs.promises.readFile(
    //   path.resolve(__dirname, "fixtures", "records.csv"),
    //   "utf-8"
    // );
    // expect(parseCsv(csv.replace(/((?!.)\s)+/g, "\n"), fieldsJson)).toEqual(outputJson);

    const rl = readline.createInterface({
      input: fs.createReadStream(path.resolve(__dirname, "fixtures", "records.csv")),
      output: process.stdout,
      terminal: false
    });
    let csv = "";
    rl.on("line", (line) => {
      csv += line + "\n";
    });
    rl.once("close", () => {
      const actual = parseCsv(csv, fieldsJson);
      expect(actual).toEqual(outputJson)
    })
  });
});
