import type { AppID, AppLang, Revision } from "..";
type Theme =
  | "WHITE"
  | "CLIPBOARD"
  | "BINDER"
  | "PENCIL"
  | "CLIPS"
  | "RED"
  | "BLUE"
  | "GREEN"
  | "YELLOW"
  | "BLACK";

export type GetAppSettingsForRequest = {
  app: AppID;
  lang?: AppLang;
  preview?: boolean;
};

export type GetAppSettingsForResponse = {
  name: string;
  description: string;
  icon:
    | {
        type: "FILE";
        file: {
          contentType: string;
          fileKey: string;
          name: string;
          size: string;
        };
      }
    | { type: "PRESET"; key: string };
  theme: Theme;
  titleField: {
    selectionMode: "AUTO" | "MANUAL";
    code: string;
  };
  enableThumbnails: boolean;
  enableBulkDeletion: boolean;
  enableComments: boolean;
  enableDuplicateRecord: boolean;
  numberPrecision: {
    digits: string;
    decimalPlaces: string;
    roundingMode: "HALF_EVEN" | "UP" | "DOWN";
  };
  firstMonthOfFiscalYear: string;
  revision: string;
};

export type UpdateAppSettingsForRequest = {
  app: AppID;
  name?: string;
  description?: string;
  icon?:
    | {
        type: "FILE";
        file: {
          fileKey: string;
        };
      }
    | { type: "PRESET"; key: string };
  theme?: Theme;
  titleField?:
    | { selectionMode: "AUTO" }
    | { selectionMode: "MANUAL"; code: string };
  enableThumbnails?: boolean;
  enableBulkDeletion?: boolean;
  enableComments?: boolean;
  enableDuplicateRecord?: boolean;
  numberPrecision?: {
    digits?: string | number;
    decimalPlaces?: string | number;
    roundingMode?: "HALF_EVEN" | "UP" | "DOWN";
  };
  firstMonthOfFiscalYear?: string | number;
  revision?: Revision;
};

export type UpdateAppSettingsForResponse = {
  revision: string;
};
