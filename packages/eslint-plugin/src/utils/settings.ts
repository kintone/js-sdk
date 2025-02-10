import type { TSESLint } from "@typescript-eslint/utils";
type Settings = {
  manifest?: object;
  // TODO: Reading a manifest file from manifestFilePath may degrade rule performance
  manifestFilePath: string;
};
const defaultSettings: Settings = {
  manifestFilePath: "manifest.json",
};

export const getSettings = <
  MessageIds extends string,
  Options extends readonly unknown[],
>(
  context: Readonly<TSESLint.RuleContext<MessageIds, Options>>,
): Settings => {
  let settings = defaultSettings;

  const sharedSettings = context.settings["@kintone/eslint-plugin"];
  if (!sharedSettings) {
    return settings;
  }
  if (typeof sharedSettings !== "object") {
    throw new Error("settings must be an object");
  }

  if ("manifest" in sharedSettings) {
    if (
      typeof sharedSettings.manifest !== "object" ||
      sharedSettings.manifest == null
    ) {
      throw new Error("manifestFilePath must be an object");
    }
    settings = {
      ...settings,
      manifest: sharedSettings.manifest,
    };
  }

  if ("manifestFilePath" in sharedSettings) {
    if (typeof sharedSettings.manifestFilePath !== "string") {
      throw new Error("manifestFilePath must be a string");
    }
    settings = {
      ...settings,
      manifestFilePath: sharedSettings.manifestFilePath,
    };
  }

  return settings;
};
