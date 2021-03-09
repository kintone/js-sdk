import { KintoneFormFieldProperty } from "@kintone/rest-api-client";
import { extractSubTableFieldsValue } from "../extractSubTableFieldsValue";
const subTableFieldsJson: {
  properties: { [k: string]: KintoneFormFieldProperty.OneOf };
} = require("./fixtures/subtable_fields.json");

describe("extractSubTableFieldsValue", () => {
  it("should", () => {
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
        type: "SUBTABLE",
        value: [
          {
            id: "11111",
            value: {
              subTableText: {
                type: "SINGLE_LINE_TEXT",
                value: "text1",
              },
              subTableCheckbox: {
                type: "CHECK_BOX",
                value: ["st_sample1"],
              },
            },
          },
          {
            id: "22222",
            value: {
              subTableText: {
                type: "SINGLE_LINE_TEXT",
                value: "text2",
              },
              subTableCheckbox: {
                type: "CHECK_BOX",
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
