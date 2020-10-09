import {
  KintoneRestAPIClient,
  KintoneFormFieldProperty,
} from "@kintone/rest-api-client"; // eslint-disable-line node/no-extraneous-import

const client = new KintoneRestAPIClient({
  /* ... */
});

type MyAppProperty = {
  CreatedBy: KintoneFormFieldProperty.Creator;
  EmployeeNo: KintoneFormFieldProperty.Number;
  Authorizer: KintoneFormFieldProperty.UserSelect;
  Title: KintoneFormFieldProperty.SingleLineText;
  Details: KintoneFormFieldProperty.Subtable<{
    Date: KintoneFormFieldProperty.Date;
    Destination: KintoneFormFieldProperty.SingleLineText;
    ModeOfTransportation: KintoneFormFieldProperty.Dropdown;
    Cost: KintoneFormFieldProperty.Number;
  }>;
  TotalExpenses: KintoneFormFieldProperty.Number;
  Notes: KintoneFormFieldProperty.MultiLineText;
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
