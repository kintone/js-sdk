/*
  When you use this package, you can import them from package root like this:
  import { KintoneRestAPIClient, KintoneFormFieldProperty } from "@kintone/rest-api-client";
*/
import { KintoneRestAPIClient, KintoneFormFieldProperty } from "../../../..";

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

declare function displayTitleFieldProperty(
  property: KintoneFormFieldProperty.SingleLineText
): void;

declare function modifyDetailsProperty(
  property: MyAppProperty["Details"]
): MyAppProperty["Details"];

async function exampleGetAndUpdateProperties() {
  const APP_ID = 1;
  const response = await client.app.getFormFields<MyAppProperty>({
    app: APP_ID,
  });

  displayTitleFieldProperty(response.properties.Title);

  const newDetailsProperty = modifyDetailsProperty(response.properties.Details);

  await client.app.updateFormFields({
    app: APP_ID,
    properties: { Details: newDetailsProperty },
  });
}
