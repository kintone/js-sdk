import { extractFieldValue } from "../extractFieldValue";
import { KintoneRecord } from "../index";

const subTableRecords: KintoneRecord[] = require("./fixtures/subtable_records.json");

describe("extractFieldValue", () => {
  it("", () => {
    const record = subTableRecords[0];
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
});
