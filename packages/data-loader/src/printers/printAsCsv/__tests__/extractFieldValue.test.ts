import { extractFieldValue } from "../extractFieldValue";
import { DataLoaderRecord } from "../../../types/data-loader";

const subtableRecords: DataLoaderRecord[] = require("./fixtures/subtable_input.json");
const fileRecords: DataLoaderRecord[] = require("./fixtures/file_input.json");
const fileWithoutAttachmentsDirRecords: DataLoaderRecord[] = require("./fixtures/file_without_attachments_dir.json");

describe("extractFieldValue", () => {
  it("", () => {
    const record = subtableRecords[0];
    expect(extractFieldValue(record.recordNumber)).toEqual(`"9"`);
    expect(extractFieldValue(record.multiLineText)).toEqual(
      `"multi\nline\ntext"`
    );
    expect(extractFieldValue(record.multiSelect)).toEqual(
      `"""sample3""\nsample4"`
    );
    expect(extractFieldValue(record.subTable)).toHaveLength(2);
    expect(extractFieldValue(record.subTable)[0]).toEqual({
      id: `"537306"`,
      subTableText: `"text_line1"`,
      subTableCheckbox: `"st_sample1"`,
    });
  });
  it("should extract file value correctly when file field has two files", () => {
    const record = fileRecords[0];
    expect(extractFieldValue(record.file)).toEqual(
      `"file-9/test.txt\nfile-9/test (1).txt"`
    );
  });
  it("should extract file value correctly without attachments-dir option", () => {
    const record = fileWithoutAttachmentsDirRecords[0];
    expect(extractFieldValue(record.file)).toEqual(`""`);
  });
});
