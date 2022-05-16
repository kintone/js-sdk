import { OneOf } from "./field";

export type RecordForExport = {
  [fieldCode: string]: OneOf;
};
