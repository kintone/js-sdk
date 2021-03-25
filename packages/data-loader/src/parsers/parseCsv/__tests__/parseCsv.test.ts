import { parseCsv } from "../index";
import { FieldsJson, KintoneRecord } from "../../../types";
const expectedJson: KintoneRecord[] = require("./fixtures/expected.json");
const fieldsJson: FieldsJson = require("./fixtures/fields.json");
const subTableExpectedJson: KintoneRecord[] = require("./fixtures/subtable_expected.json");
const subTableFieldsJson: FieldsJson = require("./fixtures/subtable_fields.json");

describe("csvParser", () => {
  it("should convert csv string to JSON correctly", () => {
    const csv = `"recordNumber","updatedTime","dropDown","creator","modifier","richText","singleLineText","number","radioButton","multiLineText","createdTime","checkBox","calc","multiSelect"
"9","2021-02-16T02:43:00Z","sample1","username","username","<div><div>rich text editor<br /></div></div><div>rich text editor<br /></div><div>rich text editor<br /></div>","""single line text""","8","sample2","multi
line
text","2021-02-10T06:14:00Z","""sample2""","16","""sample3""
sample4,sample5"
`;
    expect(parseCsv(csv, fieldsJson)).toEqual(expectedJson);
  });
  it("should convert subtable included csv string to JSON correctly", () => {
    const csv = `"*","__index__","recordNumber","updatedTime","dropDown","creator","subTable.id","subTable.subTableText","subTable.subTableCheckbox","modifier","richText","singleLineText","number","radioButton","multiLineText","createdTime","checkBox","calc","multiSelect"
*,"1","9","2021-02-16T02:43:00Z","sample1","username","537306","text_line1","st_sample1","username","<div><div>rich text editor<br /></div></div><div>rich text editor<br /></div><div>rich text editor<br /></div>","""single line text""","8","sample2","multi
line
text","2021-02-10T06:14:00Z","""sample2""","16","""sample3""
sample4"
,"1","9","2021-02-16T02:43:00Z","sample1","username","537307","text_line2","st_sample2","username","<div><div>rich text editor<br /></div></div><div>rich text editor<br /></div><div>rich text editor<br /></div>","""single line text""","8","sample2","multi
line
text","2021-02-10T06:14:00Z","""sample2""","16","""sample3""
sample4"
`;
    expect(parseCsv(csv, subTableFieldsJson)).toEqual(subTableExpectedJson);
  });
});
