import { OneOf } from "./field";

export type Record = {
  [fieldCode: string]: OneOf;
};
