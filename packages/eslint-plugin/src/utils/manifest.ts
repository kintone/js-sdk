import type { TSESLint } from "@typescript-eslint/utils";
import { getSettings } from "./settings.js";
import fs from "node:fs";

export const loadPluginManifest = <
  MessageIds extends string,
  Options extends readonly unknown[],
>(
  context: Readonly<TSESLint.RuleContext<MessageIds, Options>>,
): ManifestV2JsonObject => {
  const settings = getSettings(context);
  if (settings.manifest) {
    return settings.manifest as ManifestV2JsonObject;
  }
  const json = fs.readFileSync(settings.manifestFilePath, "utf-8");
  return JSON.parse(json);
};

// TODO: Unify with plugin/core module of cli-kintone
export type ManifestV2JsonObject = {
  $schema?: string;
  manifest_version: 2;
  version: number | string;
  type?: "APP";
  name: {
    ja?: string;
    en: string;
    zh?: string;
  };
  description?: {
    ja?: string;
    en: string;
    zh?: string;
  };
  icon: string;
  homepage_url?: {
    ja: string;
    en: string;
    zh: string;
  };
  components?: [
    {
      type: "APP_INDEX_HEADER_SPACE" | "APP_INDEX_HEADLESS";
      js?: string[];
      css?: string[];
      html?: string;
    },
  ];
  config?: {
    html?: string;
    js?: string[];
    css?: string[];
    required_params?: string[];
  };
  allowed_hosts?: string[];
  permissions?: {
    js_api?: string[];
    rest_api?: string[];
  };
};
