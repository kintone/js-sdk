import { convertToDataLoaderRecordForParameterList } from "../convertToDataLoaderRecordForParameterList";
import { FieldsJson } from "../../../types/kintone";

const rows = [
  {
    singleLineText: "single line text",
    multiSelect: "sample1\nsample2",
  },
];
const subtableFieldsJson: FieldsJson = require("./fixtures/subtable_fields.json");

describe("convertToDataLoaderRecordForParameterList", () => {
  it("should format correctly", () => {
    expect(
      convertToDataLoaderRecordForParameterList({
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
