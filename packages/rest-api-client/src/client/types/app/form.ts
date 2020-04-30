import { Field } from "./properties";

export type Properties = {
  [fieldCode: string]: Field;
};

// TODO: Make this type more specific
export type Layout = Array<{
  [k: string]: any;
}>;
