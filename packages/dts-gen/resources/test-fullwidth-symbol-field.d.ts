declare namespace kintone.types {
  interface TestFields {
    "・": kintone.fieldTypes.SingleLineText;
    "＄": kintone.fieldTypes.SingleLineText;
    "￥": kintone.fieldTypes.SingleLineText;
    "＿": kintone.fieldTypes.SingleLineText;
  }
  interface SavedTestFields extends TestFields {
    $id: kintone.fieldTypes.Id;
    $revision: kintone.fieldTypes.Revision;
    Updated_by: kintone.fieldTypes.Modifier;
    Created_by: kintone.fieldTypes.Creator;
    Record_number: kintone.fieldTypes.RecordNumber;
    Updated_datetime: kintone.fieldTypes.UpdatedTime;
    Created_datetime: kintone.fieldTypes.CreatedTime;
  }
}
