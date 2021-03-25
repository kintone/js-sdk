import { extractSubTableFieldsValue } from "../extractSubTableFieldsValue";
import { FieldsJson } from "../../../types";
const subTableFieldsJson: FieldsJson = require("./fixtures/subtable_fields.json");

describe("extractSubTableFieldsValue", () => {
  it("should extract subtable fields value correctly", () => {
    const records = [
      {
        singleLineText: "text",
        "subTable.id": "11111",
        "subTable.subTableText": "text1",
        "subTable.subTableCheckbox": "st_sample1",
      },
      {
        singleLineText: "text",
        "subTable.id": "22222",
        "subTable.subTableText": "text2",
        "subTable.subTableCheckbox": "st_sample2",
      },
    ];

    const expected = {
      subTable: {
        value: [
          {
            id: "11111",
            value: {
              subTableText: {
                value: "text1",
              },
              subTableCheckbox: {
                value: ["st_sample1"],
              },
            },
          },
          {
            id: "22222",
            value: {
              subTableText: {
                value: "text2",
              },
              subTableCheckbox: {
                value: ["st_sample2"],
              },
            },
          },
        ],
      },
    };
    expect(
      extractSubTableFieldsValue({ records, fieldsJson: subTableFieldsJson })
    ).toEqual(expected);
  });
});
