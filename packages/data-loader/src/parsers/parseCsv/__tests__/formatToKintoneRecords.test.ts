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
  it("should format correctly", () => {
    expect(
      formatToKintoneRecords({ records, fieldsJson: subTableFieldsJson })
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
