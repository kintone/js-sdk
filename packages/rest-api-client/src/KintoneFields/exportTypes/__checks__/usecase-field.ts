import { KintoneRestAPIClient, KintoneRecord as Record } from "../../../";

const client = new KintoneRestAPIClient({
  /* ... */
});

type MyAppRecord = {
  CreatedBy: Record.CreatorField;
  EmployeeNo: Record.NumberField;
  Authorizer: Record.UserSelectField;
  Title: Record.SingleLineTextField;
  Details: Record.SubtableField<{
    Date: Record.DateField;
    Destination: Record.SingleLineTextField;
    ModeOfTransportation: Record.DropdownField;
    Cost: Record.NumberField;
  }>;
  TotalExpenses: Record.NumberField;
  Notes: Record.MultiLineTextField;
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
