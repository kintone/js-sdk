import * as Field from "./fieldLayout";

export { Field };

export type Row<T extends Field.OneOf[]> = {
  type: "ROW";
  fields: T;
};

export type Subtable<T extends Field.InSubtable[]> = {
  type: "SUBTABLE";
  code: string;
  fields: T;
};
export type Group<T extends Array<Row<Field.OneOf[]>>> = {
  type: "GROUP";
  code: string;
  layout: T;
};

export type OneOf =
  | Row<Field.OneOf[]>
  | Subtable<Field.InSubtable[]>
  | Group<Array<Row<Field.OneOf[]>>>;
