import { exportFieldsFilter } from "../printAsJson";

const records = require("../printAsCsv/__tests__/fixtures/input.json");

describe("exportFieldsFilter", () => {
  it("should filter in order to export fields option", () => {
    expect(
      exportFieldsFilter({
        records,
        exportFields: "recordNumber,number",
      })
    ).toEqual([
      {
        recordNumber: {
          type: "RECORD_NUMBER",
          value: "9",
        },
        number: {
          type: "NUMBER",
          value: "8",
        },
      },
    ]);
  });
});
