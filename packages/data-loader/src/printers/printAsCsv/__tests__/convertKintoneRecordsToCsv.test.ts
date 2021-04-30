import { convertKintoneRecordsToCsv } from "../convertKintoneRecordsToCsv";
import { FieldsJson, KintoneRecord } from "../../../types";

const records: KintoneRecord[] = require("./fixtures/input.json");
const fieldsJson: FieldsJson = require("./fixtures/fields.json");
const subtableRecords: KintoneRecord[] = require("./fixtures/subtable_input.json");
const subtableFieldsJson: FieldsJson = require("./fixtures/subtable_fields.json");

describe("convertKintoneRecordsToCsv", () => {
  it("should convert kintone records to csv string correctly", () => {
    const expectedCsv = `"recordNumber","updatedTime","dropDown","creator","modifier","richText","singleLineText","number","radioButton","multiLineText","createdTime","checkBox","calc","multiSelect"
"9","2021-02-16T02:43:00Z","sample1","username","username","<div><div>rich text editor<br /></div></div><div>rich text editor<br /></div><div>rich text editor<br /></div>","""single line text""","8","sample2","multi
line
text","2021-02-10T06:14:00Z","""sample2""","16","""sample3""
sample4"
`;
    expect(
      convertKintoneRecordsToCsv({
        records,
        fieldProperties: fieldsJson.properties,
      })
    ).toBe(expectedCsv);
  });
  it("should convert kintone records to csv string correctly when SUBTABLE included", () => {
    const expectedCsv = `"*","recordNumber","updatedTime","dropDown","creator","subTable","subTableText","subTableCheckbox","modifier","richText","singleLineText","number","radioButton","multiLineText","createdTime","checkBox","calc","multiSelect"
*,"9","2021-02-16T02:43:00Z","sample1","username","537306","text_line1","st_sample1","username","<div><div>rich text editor<br /></div></div><div>rich text editor<br /></div><div>rich text editor<br /></div>","""single line text""","8","sample2","multi
line
text","2021-02-10T06:14:00Z","""sample2""","16","""sample3""
sample4"
,"9","2021-02-16T02:43:00Z","sample1","username","537307","text_line2","st_sample2","username","<div><div>rich text editor<br /></div></div><div>rich text editor<br /></div><div>rich text editor<br /></div>","""single line text""","8","sample2","multi
line
text","2021-02-10T06:14:00Z","""sample2""","16","""sample3""
sample4"
`;
    expect(
      convertKintoneRecordsToCsv({
        records: subtableRecords,
        fieldProperties: subtableFieldsJson.properties,
      })
    ).toBe(expectedCsv);
  });
});
