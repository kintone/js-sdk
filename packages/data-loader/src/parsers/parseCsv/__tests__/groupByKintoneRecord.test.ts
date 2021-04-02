import { PRIMARY_MARK } from "../../../printers/printAsCsv/constants";
import { groupByKintoneRecord } from "../groupByKintoneRecord";

describe("groupByIndex", () => {
  it("should grouping by record index correctly", () => {
    const records = [
      {
        [PRIMARY_MARK]: "*",
      },
      {
        [PRIMARY_MARK]: "",
      },
      {
        [PRIMARY_MARK]: "",
      },
      {
        [PRIMARY_MARK]: "*",
      },
      {
        [PRIMARY_MARK]: "",
      },
    ];
    const groups = groupByKintoneRecord(records);
    expect(groups["1"]).toHaveLength(3);
    expect(groups["2"]).toHaveLength(2);
  });
});
