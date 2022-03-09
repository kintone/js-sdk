import { OneOf } from "./field";

export type RecordForResponse = {
  [fieldCode: string]: OneOf;
};

export type RecordForParameter = {
  [fieldCode: string]: { value: unknown };
};
