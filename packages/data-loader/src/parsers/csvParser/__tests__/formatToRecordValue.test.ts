import { formatToRecordValue } from "../formatToRecordValue";

describe("formatToRecordValue", () => {
  it("formatToRecordValue", () => {
    expect(
      formatToRecordValue({ fieldType: "SINGLE_LINE_TEXT", value: "text" })
    ).toEqual({ value: "text" });

    expect(
      formatToRecordValue({
        fieldType: "MULTI_SELECT",
        value: "select1\nselect2",
      })
    ).toEqual({ value: ["select1", "select2"] });
    expect(
      formatToRecordValue({
        fieldType: "CREATOR",
        value: "creator",
      })
    ).toEqual({
      value: {
        code: "creator",
      },
    });
  });
});
