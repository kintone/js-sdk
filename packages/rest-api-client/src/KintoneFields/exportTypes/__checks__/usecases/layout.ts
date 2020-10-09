/*
  When you use this package, you can import them from package root like this:
  import { KintoneRestAPIClient, KintoneFormLayout } from "@kintone/rest-api-client";
*/
import { KintoneRestAPIClient, KintoneFormLayout } from "../../../..";

const client = new KintoneRestAPIClient({
  /* ... */
});

type MyAppFormLayout = [
  KintoneFormLayout.Row<[KintoneFormLayout.Field.Creator]>,
  KintoneFormLayout.Row<
    [KintoneFormLayout.Field.Number, KintoneFormLayout.Field.UserSelect]
  >,
  KintoneFormLayout.Row<[KintoneFormLayout.Field.SingleLineText]>,
  KintoneFormLayout.Subtable<
    [
      KintoneFormLayout.Field.Date,
      KintoneFormLayout.Field.SingleLineText,
      KintoneFormLayout.Field.Dropdown,
      KintoneFormLayout.Field.Number
    ]
  >,
  KintoneFormLayout.Row<[KintoneFormLayout.Field.Number]>,
  KintoneFormLayout.Row<[KintoneFormLayout.Field.MultiLineText]>
];

declare function displayMultiLineTextLayout(
  field: KintoneFormLayout.Field.MultiLineText
): void;

declare function modifyRowLayout<T extends KintoneFormLayout.Field.OneOf[]>(
  row: KintoneFormLayout.Row<T>
): KintoneFormLayout.Row<T>;

declare function modifySubtableLayout<
  T extends KintoneFormLayout.Field.InSubtable[]
>(subtable: KintoneFormLayout.Subtable<T>): KintoneFormLayout.Subtable<T>;

declare function modifyGroupLayout<
  T extends Array<KintoneFormLayout.Row<KintoneFormLayout.Field.OneOf[]>>
>(group: KintoneFormLayout.Group<T>): KintoneFormLayout.Group<T>;

function modifyRow(row: KintoneFormLayout.OneOf) {
  switch (row.type) {
    case "ROW": {
      return modifyRowLayout(row);
    }
    case "SUBTABLE": {
      return modifySubtableLayout(row);
    }
    case "GROUP": {
      return modifyGroupLayout(row);
    }
  }
  const _check: never = row;
  return _check;
}

async function exampleGetAndUpdateLayout() {
  const APP_ID = 1;
  const response = await client.app.getFormLayout<MyAppFormLayout>({
    app: APP_ID,
  });

  displayMultiLineTextLayout(response.layout[5].fields[0]);

  const newLayout = response.layout.map(modifyRow);
  client.app.updateFormLayout({ app: APP_ID, layout: newLayout });
}
