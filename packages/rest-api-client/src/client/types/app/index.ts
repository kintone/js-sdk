type Lang = "ja" | "en" | "zh";
export type AppLang = Lang | "default" | "user";
export type PluginLocale = Lang;
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
export * from "./action";
export * from "./adminNotes";
