import { Appearance, ConditionalExist, ConditionalStrict } from "./utilityType";

export type AppCustomizeScope = "ALL" | "ADMIN" | "NONE";

type AppCustomizeResource<T extends Appearance> =
  | {
      type: "URL";
      url: string;
    }
  | {
      type: "FILE";
      file: {
        fileKey: string;
      } & ConditionalExist<
        T,
        "response",
        { name: string; contentType: string; size: string }
      >;
    };

export type AppCustomize<T extends Appearance> = ConditionalStrict<
  T,
  "response",
  {
    js: Array<AppCustomizeResource<T>>;
    css: Array<AppCustomizeResource<T>>;
  }
>;
