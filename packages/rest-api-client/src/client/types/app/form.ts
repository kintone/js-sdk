import { FieldProperty } from "./properties";

export type Properties = {
  [fieldCode: string]: FieldProperty;
};

// TODO: Make this type more specific
export type Layout = Array<{
  [k: string]: any;
}>;
