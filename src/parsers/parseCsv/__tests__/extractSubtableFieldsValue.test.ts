import { extractSubtableFieldsValue } from "../extractSubtableFieldsValue";
import { CsvRows, FieldsJson } from "../../../types";
const subtableFieldsJson: FieldsJson = require("./fixtures/subtable_fields.json");

describe("extractSubtableFieldsValue", () => {
  it("should extract subtable fields value correctly", () => {
    const rows = [
      {
        singleLineText: "text",
        subTable: "11111",
        subTableText: "text1",
        subTableCheckbox: "st_sample1",
      },
      {
        singleLineText: "text",
        subTable: "22222",
        subTableText: "text2",
        subTableCheckbox: "st_sample2",
      },
      {
        singleLineText: "text",
        subTable: "33333",
      },
    ] as CsvRows;

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
          {
            id: "33333",
            value: {
              subTableCheckbox: {
                value: [],
              },
              subTableText: {
                value: "",
              },
            },
          },
        ],
      },
    };
    expect(
      extractSubtableFieldsValue({
        rows,
        fieldProperties: subtableFieldsJson.properties,
      })
    ).toEqual(expected);
  });
});
