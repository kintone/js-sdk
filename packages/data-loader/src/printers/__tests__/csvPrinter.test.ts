import { convertKintoneRecordsToCsv } from "../csvPrinter";
import { KintoneRecordField } from "@kintone/rest-api-client";
import fs from "fs";
import path from "path";

const records: Array<{
  [k: string]: KintoneRecordField.OneOf;
}> = require("./fixtures/records.json");

const expectedCsv = `"recordNumber","updatedTime","dropDown","creator","modifier","richText","singleLineText","number","radioButton","multiLineText","createdTime","checkBox","calc","multiSelect"
"9","2021-02-16T02:43:00Z","sample1","username","username","<div><div>rich text editor<br /></div></div><div>rich text editor<br /></div><div>rich text editor<br /></div>","""single line text""","8","sample2","multi
line
text","2021-02-10T06:14:00Z","""sample2""","16","""sample3""
sample4"
`;

describe("csvPrinter", () => {
  it("should convert kintone records to csv string correctly", async () => {
    const expectedCsv = await fs.promises.readFile(
      path.resolve(__dirname, "fixtures", "records.csv"),
      "utf8"
    );
    expect(convertKintoneRecordsToCsv(records)).toBe(expectedCsv.replace(/((?!.)\s)+/g, "\n"));
  });
});
