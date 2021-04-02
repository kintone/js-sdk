import { formatToKintoneRecords } from "../formatToKintoneRecords";
import { FieldsJson } from "../../../types";

const rows = [
  {
    singleLineText: "single line text",
    multiSelect: "sample1\nsample2",
  },
];
const subTableFieldsJson: FieldsJson = require("./fixtures/subtable_fields.json");

describe("formatToKintoneRecords", () => {
  it("should format correctly", () => {
    expect(
      formatToKintoneRecords({ rows, fieldsJson: subTableFieldsJson })
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
