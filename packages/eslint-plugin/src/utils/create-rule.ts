import { ESLintUtils } from "@typescript-eslint/utils";
const { RuleCreator: ruleCreator } = ESLintUtils;

export interface PluginDocs {
  description: string;
  recommended: boolean;
  requiresTypeChecking: boolean;
}

export const createRule = ruleCreator<PluginDocs>(
  (name) =>
    `https://github.com/kintone/js-sdk/tree/main/packages/eslint-plugin/docs/rules/${name}.md`,
);
