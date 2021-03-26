import { PRIMARY_MARK } from "../../../printers/printAsCsv/constants";
import { groupByIndex } from "../groupByIndex";

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
    const groups = groupByIndex(records);
    expect(groups["1"]).toHaveLength(3);
    expect(groups["2"]).toHaveLength(2);
  });
});
