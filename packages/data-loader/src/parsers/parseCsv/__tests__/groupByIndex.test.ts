import { RECORD_INDEX } from "../../../printers/printAsCsv/constants";
import { groupByIndex } from "../groupByIndex";

describe("groupByIndex", () => {
  it("should grouping by record index correctly", () => {
    const records = [
      {
        [RECORD_INDEX]: "1",
      },
      {
        [RECORD_INDEX]: "1",
      },
      {
        [RECORD_INDEX]: "1",
      },
      {
        [RECORD_INDEX]: "2",
      },
      {
        [RECORD_INDEX]: "2",
      },
    ];
    const groups = groupByIndex(records);
    expect(groups["1"]).toHaveLength(3);
    expect(groups["2"]).toHaveLength(2);
  });
});
