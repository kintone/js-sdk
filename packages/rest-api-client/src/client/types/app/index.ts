export type Lang = "ja" | "en" | "zh" | "user" | "default";
export type DeployStatus = "PROCESSING" | "SUCCESS" | "FAIL" | "CANCEL";

export type App = {
  appId: string;
  code: string;
  name: string;
  description: string;
  spaceId: string | null;
  threadId: string | null;
  createdAt: string;
  creator: { code: string; name: string };
  modifiedAt: string;
  modifier: {
    code: string;
    name: string;
  };
};

export * from "./form";
export * from "./view";
export * from "./right";
export * from "./processManagement";
export * from "./customize";
export * from "./notification";
export * from "./report";
