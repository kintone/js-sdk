import { formatToRecordValue } from "../formatToRecordValue";

describe("formatToRecordValue", () => {
  it("formatToRecordValue", () => {
    expect(
      formatToRecordValue({ fieldType: "SINGLE_LINE_TEXT", value: "text" })
    ).toEqual({ type: "SINGLE_LINE_TEXT", value: "text" });

    expect(
      formatToRecordValue({
        fieldType: "MULTI_SELECT",
        value: "select1\nselect2",
      })
    ).toEqual({ type: "MULTI_SELECT", value: ["select1", "select2"] });
    expect(
      formatToRecordValue({
        fieldType: "CREATOR",
        value: "creator",
      })
    ).toEqual({
      type: "CREATOR",
      value: {
        code: "creator",
      },
    });
  });
});
