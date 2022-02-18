import { convertToKintoneRecordsForParameter } from "../convertToKintoneRecordsForParameter";
import { FieldsJson } from "../../../types/kintone";

const rows = [
  {
    singleLineText: "single line text",
    multiSelect: "sample1\nsample2",
  },
];
const subtableFieldsJson: FieldsJson = require("./fixtures/subtable_fields.json");

describe("convertToKintoneRecordsForParameter", () => {
  it("should format correctly", () => {
    expect(
      convertToKintoneRecordsForParameter({
        rows,
        fieldProperties: subtableFieldsJson.properties,
      })
    ).toEqual([
      {
        singleLineText: {
          value: "single line text",
        },
        multiSelect: {
          value: ["sample1", "sample2"],
        },
      },
    ]);
  });
});
