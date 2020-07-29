import { Appearance } from "./apperance";

export type AppCustomizeScope = "ALL" | "ADMIN" | "NONE";

type AppCustomizeResource<T extends Appearance> =
  | {
      type: "URL";
      url: string;
    }
  | (T extends "response"
      ? {
          type: "FILE";
          file: {
            fileKey: string;
            name: string;
            contentType: string;
            size: string;
          };
        }
      : {
          type: "FILE";
          file: {
            fileKey: string;
          };
        });

export type AppCustomize<T extends Appearance> = T extends "response"
  ? {
      js: Array<AppCustomizeResource<T>>;
      css: Array<AppCustomizeResource<T>>;
    }
  : {
      js?: Array<AppCustomizeResource<T>>;
      css?: Array<AppCustomizeResource<T>>;
    };
