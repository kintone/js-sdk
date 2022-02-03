import { convertRecordsToCsv } from "../convertKintoneRecordsToCsv";
import { FieldsJson } from "../../../types/kintone";
import { DataLoaderRecord } from "../../../types/data-loader";

const records: DataLoaderRecord[] = require("./fixtures/input.json");
const fieldsJson: FieldsJson = require("./fixtures/fields.json");
const fileRecords: DataLoaderRecord[] = require("./fixtures/file_input.json");
const fileWithoutAttachmentsDirRecords: DataLoaderRecord[] = require("./fixtures/file_without_attachments_dir.json");
const fileFieldsJson: FieldsJson = require("./fixtures/file_fields.json");
const subtableRecords: DataLoaderRecord[] = require("./fixtures/subtable_input.json");
const subtableFieldsJson: FieldsJson = require("./fixtures/subtable_fields.json");
const unsupportedRecords: DataLoaderRecord[] = require("./fixtures/unsupported_input.json");
const unsupportedFieldsJson: FieldsJson = require("./fixtures/unsupported_fields.json");

describe("convertKintoneRecordsToCsv", () => {
  it("should convert kintone records to csv string correctly", () => {
    const expectedCsv = `"recordNumber","updatedTime","dropDown","creator","modifier","richText","singleLineText","number","radioButton","multiLineText","createdTime","checkBox","calc","multiSelect"
"9","2021-02-16T02:43:00Z","sample1","username","username","<div><div>rich text editor<br /></div></div><div>rich text editor<br /></div><div>rich text editor<br /></div>","""single line text""","8","sample2","multi
line
text","2021-02-10T06:14:00Z","""sample2""","16","""sample3""
sample4"
`;
    expect(
      convertRecordsToCsv({
        records,
        fieldProperties: fieldsJson.properties,
        attachmentsDir: "attachmentsDir",
      })
    ).toBe(expectedCsv);
  });
  it("should convert kintone records to csv string correctly when FILE included and with attachmentsDir option", () => {
    const expectedCsv = `"recordNumber","updatedTime","dropDown","creator","modifier","richText","singleLineText","number","radioButton","multiLineText","createdTime","checkBox","calc","multiSelect","file"
"9","2021-02-16T02:43:00Z","sample1","username","username","<div><div>rich text editor<br /></div></div><div>rich text editor<br /></div><div>rich text editor<br /></div>","""single line text""","8","sample2","multi
line
text","2021-02-10T06:14:00Z","""sample2""","16","""sample3""
sample4","file-9/test.txt
file-9/test (1).txt"
`;
    expect(
      convertRecordsToCsv({
        records: fileRecords,
        fieldProperties: fileFieldsJson.properties,
        attachmentsDir: "attachmentsDir",
      })
    ).toBe(expectedCsv);
  });
  it("should convert kintone records to csv string correctly when FILE included and without attachmentsDir option", () => {
    const expectedCsv = `"recordNumber","updatedTime","dropDown","creator","modifier","richText","singleLineText","number","radioButton","multiLineText","createdTime","checkBox","calc","multiSelect","file"
"9","2021-02-16T02:43:00Z","sample1","username","username","<div><div>rich text editor<br /></div></div><div>rich text editor<br /></div><div>rich text editor<br /></div>","""single line text""","8","sample2","multi
line
text","2021-02-10T06:14:00Z","""sample2""","16","""sample3""
sample4","test.txt
test.txt"
`;
    expect(
      convertRecordsToCsv({
        records: fileWithoutAttachmentsDirRecords,
        fieldProperties: fileFieldsJson.properties,
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
      convertRecordsToCsv({
        records: subtableRecords,
        fieldProperties: subtableFieldsJson.properties,
      })
    ).toBe(expectedCsv);
  });
  it("should convert kintone records to csv string correctly when unsupported fields included", () => {
    const expectedCsv = `"*","recordNumber","subTable","subTableText","singleLineText"
*,"9","537306","text_line1","""single line text"""
,"9","537307","text_line2","""single line text"""
`;
    expect(
      convertRecordsToCsv({
        records: unsupportedRecords,
        fieldProperties: unsupportedFieldsJson.properties,
      })
    ).toBe(expectedCsv);
  });
});
