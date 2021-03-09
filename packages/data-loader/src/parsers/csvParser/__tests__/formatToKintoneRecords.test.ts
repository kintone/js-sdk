import { KintoneFormFieldProperty } from "@kintone/rest-api-client";
import { formatToKintoneRecords } from "../formatToKintoneRecords";

const records = [
  {
    singleLineText: "single line text",
    multiSelect: "sample1\nsample2",
  },
];
const subTableFieldsJson: {
  properties: { [k: string]: KintoneFormFieldProperty.OneOf };
} = require("./fixtures/subtable_fields.json");

describe("formatToKintoneRecords", () => {
  it("should", () => {
    expect(
      formatToKintoneRecords({ records, fieldsJson: subTableFieldsJson })
    ).toEqual([
      {
        singleLineText: {
          value: "single line text",
          type: "SINGLE_LINE_TEXT",
        },
        multiSelect: {
          value: ["sample1", "sample2"],
          type: "MULTI_SELECT",
        },
      },
    ]);
  });
});
