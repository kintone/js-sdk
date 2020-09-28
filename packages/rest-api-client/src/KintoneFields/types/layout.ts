import * as Field from "./fieldLayout";

export { Field };

export type InSubtable = Exclude<
  Field.OneOf,
  | Field.RecordNumber
  | Field.Creator
  | Field.CreatedTime
  | Field.Modifier
  | Field.UpdatedTime
  | Field.ReferenceTable
  | Field.Label
  | Field.HR
  | Field.Spacer
>;

export type RowLayout<T extends Field.OneOf[]> = {
  type: "ROW";
  fields: T;
};

export type SubtableLayout<T extends InSubtable[]> = {
  type: "SUBTABLE";
  code: string;
  fields: T;
};
export type GroupLayout<T extends Array<RowLayout<Field.OneOf[]>>> = {
  type: "GROUP";
  code: string;
  layout: T;
};

export type Layout = Array<
  | RowLayout<Field.OneOf[]>
  | SubtableLayout<InSubtable[]>
  | GroupLayout<Array<RowLayout<Field.OneOf[]>>>
>;

export type OneOf =
  | RowLayout<Field.OneOf[]>
  | SubtableLayout<InSubtable[]>
  | GroupLayout<Array<RowLayout<Field.OneOf[]>>>;
