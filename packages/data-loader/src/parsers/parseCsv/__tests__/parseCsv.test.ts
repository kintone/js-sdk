import { parseCsv } from "../index";
import { FieldsJson, KintoneRecordForResponse } from "../../../types/kintone";
const expectedJson: KintoneRecordForResponse[] = require("./fixtures/expected.json");
const fieldsJson: FieldsJson = require("./fixtures/fields.json");
const subtableExpectedJson: KintoneRecordForResponse[] = require("./fixtures/subtable_expected.json");
const subtableFieldsJson: FieldsJson = require("./fixtures/subtable_fields.json");

describe("parseCsv", () => {
  it("should convert csv string to JSON correctly", () => {
    const csv = `"recordNumber","updatedTime","dropDown","creator","modifier","richText","singleLineText","number","radioButton","multiLineText","createdTime","checkBox","calc","multiSelect","userSelect","organizationSelect","groupSelect","file"
"9","2021-02-16T02:43:00Z","sample1","username","username","<div><div>rich text editor<br /></div></div><div>rich text editor<br /></div><div>rich text editor<br /></div>","""single line text""","8","sample2","multi
line
text","2021-02-10T06:14:00Z","""sample2""","16","""sample3""
sample4,sample5","sato
tanaka","Development Div","Administrators","AttachementFolder/1.png
AttachementFolder/2.png"
`;
    expect(parseCsv(csv, fieldsJson)).toEqual(expectedJson);
  });
  it("should convert subtable included csv string to JSON correctly", () => {
    const csv = `"*","recordNumber","updatedTime","dropDown","creator","subTable","subTableText","subTableCheckbox","userSelect","organizationSelect","groupSelect","modifier","richText","singleLineText","number","radioButton","multiLineText","createdTime","checkBox","calc","multiSelect"
"*","9","2021-02-16T02:43:00Z","sample1","username","537306","text_line1","st_sample1","sato
tanaka","Development Div","Administrators","username","<div><div>rich text editor<br /></div></div><div>rich text editor<br /></div><div>rich text editor<br /></div>","""single line text""","8","sample2","multi
line
text","2021-02-10T06:14:00Z","""sample2""","16","""sample3""
sample4"
,"9","2021-02-16T02:43:00Z","sample1","username","537307","text_line2","st_sample2","sato
tanaka","Development Div","Administrators","username","<div><div>rich text editor<br /></div></div><div>rich text editor<br /></div><div>rich text editor<br /></div>","""single line text""","8","sample2","multi
line
text","2021-02-10T06:14:00Z","""sample2""","16","""sample3""
sample4"
"*","10","2021-02-16T02:43:00Z","sample1","username","537308","text_line1","st_sample1","sato
tanaka","Development Div","Administrators","username","<div><div>rich text editor<br /></div></div><div>rich text editor<br /></div><div>rich text editor<br /></div>","""single line text""","8","sample2","multi
line
text","2021-02-10T06:14:00Z","""sample2""","16","""sample3""
sample4"
,"10","2021-02-16T02:43:00Z","sample1","username","537309","text_line2","st_sample2","sato
tanaka","Development Div","Administrators","username","<div><div>rich text editor<br /></div></div><div>rich text editor<br /></div><div>rich text editor<br /></div>","""single line text""","8","sample2","multi
line
text","2021-02-10T06:14:00Z","""sample2""","16","""sample3""
sample4"
`;
    expect(parseCsv(csv, subtableFieldsJson)).toEqual(subtableExpectedJson);
  });
});
