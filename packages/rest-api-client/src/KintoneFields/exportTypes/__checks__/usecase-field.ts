import { KintoneRestAPIClient, KintoneRecordField as Record } from "../../../";

const client = new KintoneRestAPIClient({
  /* ... */
});

type MyAppRecord = {
  CreatedBy: Record.Creator;
  EmployeeNo: Record.Number;
  Authorizer: Record.UserSelect;
  Title: Record.SingleLineText;
  Details: Record.Subtable<{
    Date: Record.Date;
    Destination: Record.SingleLineText;
    ModeOfTransportation: Record.Dropdown;
    Cost: Record.Number;
  }>;
  TotalExpenses: Record.Number;
  Notes: Record.MultiLineText;
};

async function exampleGetRecords() {
  const APP_ID = 1;
  const response = await client.record.getRecords<MyAppRecord>({ app: APP_ID });

  response.records.forEach((record) => {
    // iterates over fields in subtable field
    record.Details.value.forEach((fieldInSubtable) => {
      // It will be inferred to be one of
      // `Date`, `Destination`, `ModeOfTransportation`, `Cost` fields
      console.log(fieldInSubtable.value);
    });

    // raises an error when refering to the undefined field
    // @ts-expect-error
    console.log(record.NotExistField.value);
  });
}
