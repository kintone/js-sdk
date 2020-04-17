export type ConditionalStrict<T, U, V extends object> = T extends U
  ? V
  : Partial<V>;
export type ConditionalExist<T, U, V extends object> = T extends U ? V : {};

export type Appearance = "response" | "parameter";
