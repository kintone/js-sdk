import {
  KintoneRestAPIClient,
  KintoneFormProperty,
} from "@kintone/rest-api-client"; // eslint-disable-line node/no-extraneous-import

const client = new KintoneRestAPIClient({
  /* ... */
});

type MyAppProperty = {
  CreatedBy: KintoneFormProperty.Creator;
  EmployeeNo: KintoneFormProperty.Number;
  Authorizer: KintoneFormProperty.UserSelect;
  Title: KintoneFormProperty.SingleLineText;
  Details: KintoneFormProperty.Subtable<{
    Date: KintoneFormProperty.Date;
    Destination: KintoneFormProperty.SingleLineText;
    ModeOfTransportation: KintoneFormProperty.Dropdown;
    Cost: KintoneFormProperty.Number;
  }>;
  TotalExpenses: KintoneFormProperty.Number;
  Notes: KintoneFormProperty.MultiLineText;
};

async function exampleGetAndUpdateProperties() {
  const APP_ID = 1;
  const response = await client.app.getFormFields<MyAppProperty>({
    app: APP_ID,
  });

  const properties = response.properties;
  properties.Title.noLabel = true;
  if (properties.Details.fields.Destination.defaultValue === "") {
    properties.Details.fields.Destination.defaultValue =
      "No description provided.";
  }

  await client.app.updateFormFields({
    app: APP_ID,
    properties,
  });
}
