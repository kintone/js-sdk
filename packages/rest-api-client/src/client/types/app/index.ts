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

export * from "./form.js";
export * from "./view.js";
export * from "./right.js";
export * from "./processManagement.js";
export * from "./customize.js";
export * from "./notification.js";
export * from "./report.js";
export * from "./action.js";
export * from "./adminNotes.js";
export * from "./statistics.js";
