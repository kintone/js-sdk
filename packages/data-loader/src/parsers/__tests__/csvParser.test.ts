import {
  KintoneRecordField,
  KintoneFormFieldProperty,
} from "@kintone/rest-api-client";
import { parseCsv } from "../csvParser";
const outputJson: Array<{
  [k: string]: KintoneRecordField.OneOf;
}> = require("./fixtures/output.json");
const fieldsJson: {
  properties: { [k: string]: KintoneFormFieldProperty.OneOf };
} = require("./fixtures/fields.json");

const inputCsv = `"recordNumber","updatedTime","dropDown","creator","modifier","richText","singleLineText","number","radioButton","multiLineText","createdTime","checkBox","calc","multiSelect"
"9","2021-02-16T02:43:00Z","sample1","username","username","<div><div>rich text editor<br /></div></div><div>rich text editor<br /></div><div>rich text editor<br /></div>","""single line text""","8","sample2","multi
line
text","2021-02-10T06:14:00Z","""sample2""","16","""sample3""
sample4,sample5"
`;

describe("csvParser", () => {
  it("should convert csv string to JSON correctly", async () => {
    expect(parseCsv(inputCsv, fieldsJson)).toEqual(outputJson);
  });
});
