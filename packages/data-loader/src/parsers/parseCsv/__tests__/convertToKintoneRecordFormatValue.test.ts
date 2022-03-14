import { convertToKintoneRecordFormatValue } from "../convertToKintoneRecordFormatValue";

describe("convertToKintoneRecordFormatValue", () => {
  it("should format correctly", () => {
    expect(
      convertToKintoneRecordFormatValue({
        fieldType: "SINGLE_LINE_TEXT",
        value: "text",
      })
    ).toEqual({ value: "text" });

    expect(
      convertToKintoneRecordFormatValue({
        fieldType: "MULTI_SELECT",
        value: "select1\nselect2",
      })
    ).toEqual({ value: ["select1", "select2"] });
    expect(
      convertToKintoneRecordFormatValue({
        fieldType: "CREATOR",
        value: "creator",
      })
    ).toEqual({
      value: {
        code: "creator",
      },
    });
    expect(
      convertToKintoneRecordFormatValue({
        fieldType: "USER_SELECT",
        value: "sato",
      })
    ).toEqual({
      value: [
        {
          code: "sato",
        },
      ],
    });
    expect(
      convertToKintoneRecordFormatValue({
        fieldType: "FILE",
        value: "AttachmentFolder/1.png\nAttachmentFolder/2.png",
      })
    ).toEqual({
      value: [
        {
          localFilePath: "AttachmentFolder/1.png",
        },
        {
          localFilePath: "AttachmentFolder/2.png",
        },
      ],
    });
  });
});
