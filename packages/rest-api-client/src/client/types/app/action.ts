import { Entity } from "../entity";
import { AppID } from "../index";

// --- Types for request ---

export type AppActionsForParameter = {
  [actionName: string]: ActionPropertyForParameter;
};

type ActionProps = {
  name?: string;
  index: string | number;
  entities?: Entity[];
};

type ActionPropertyForParameter = (
  | {
      destApp: DestAppForParameter;
      mappings: Mapping[];
    }
  | {
      mappings?: Mapping[];
    }
) &
  ActionProps;

type DestAppForParameter =
  | {
      app: AppID;
      code?: string;
    }
  | { app?: AppID; code: string };

// --- Types for response ---

export type AppActionsForResponse = {
  [actionName: string]: ActionPropertyForResponse;
};

type ActionPropertyForResponse = {
  name: string;
  id: string;
  index: string;
  destApp: DestAppForResponse;
  mappings: Mapping[];
  entities: Entity[];
};

type DestAppForResponse = {
  app: string;
  code: string;
};

// --- Common types for both request and response ---

type Mapping =
  | {
      srcType: "FIELD";
      srcField: string;
      destField: string;
    }
  | {
      srcType: "RECORD_URL";
      destField: string;
    };
