import { OneOf } from "./field";

export type RecordForImport = {
  [fieldCode: string]: OneOf;
};
