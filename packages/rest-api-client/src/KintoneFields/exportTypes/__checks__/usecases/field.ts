/*
  When you use this package, you can import them from package root like this:
  import { KintoneRestAPIClient, KintoneRecordField } from "@kintone/rest-api-client";
*/
import { KintoneRestAPIClient, KintoneRecordField } from "../../../..";

const client = new KintoneRestAPIClient({
  /* ... */
});

type MyAppRecord = {
  $id: KintoneRecordField.ID;
  CreatedBy: KintoneRecordField.Creator;
  EmployeeNo: KintoneRecordField.Number;
  Authorizer: KintoneRecordField.UserSelect;
  Title: KintoneRecordField.SingleLineText;
  Details: KintoneRecordField.Subtable<{
    Date: KintoneRecordField.Date;
    Destination: KintoneRecordField.SingleLineText;
    ModeOfTransportation: KintoneRecordField.Dropdown;
    Cost: KintoneRecordField.Number;
  }>;
  TotalExpenses: KintoneRecordField.Number;
  Notes: KintoneRecordField.MultiLineText;
};

declare function displayAuthorizers(
  authorizers: Array<{ code: string; name: string }>
): void;

declare function displaySubtableRow(subtableRow: {
  Date: KintoneRecordField.Date;
  Destination: KintoneRecordField.SingleLineText;
  ModeOfTransportation: KintoneRecordField.Dropdown;
  Cost: KintoneRecordField.Number;
}): void;

const exampleGetAndUpdateRecords = async () => {
  const APP_ID = 1;
  const response = await client.record.getRecords<MyAppRecord>({ app: APP_ID });

  response.records.forEach((record) => {
    displayAuthorizers(record.Authorizer.value);

    // iterates over fields in subtable field
    record.Details.value.forEach((fieldInSubtable) => {
      displaySubtableRow(fieldInSubtable.value);
    });

    // raises an error when refering to the undefined field
    // @ts-expect-error
    console.log(record.NotExistField.value);
  });

  await client.record.updateRecords({
    app: APP_ID,
    records: response.records.map((record) => ({
      id: record.$id.value,
      record: {
        Title: {
          value: `prefix-${record.Title.value}`,
        },
      },
    })),
  });
};
