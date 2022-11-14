import type { OneOf as FieldProperty } from "../../../KintoneFields/types/property";
import type {
  Row,
  Subtable,
  Group,
  Field,
} from "../../../KintoneFields/types/layout";

export type Properties = {
  [fieldCode: string]: FieldProperty;
};

export type Layout = Array<
  | Row<Field.OneOf[]>
  | Subtable<Field.InSubtable[]>
  | Group<Array<Row<Field.OneOf[]>>>
>;
