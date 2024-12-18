import type { TSESTree } from "@typescript-eslint/utils";
import { createRule } from "../utils/create-rule.js";
import { loadPluginManifest } from "../utils/manifest.js";
import { kintoneJsApis } from "../utils/js-api.js";

type MessageIds = "onlyUseAllowedJsApi";

export const rule = createRule<[], MessageIds>({
  name: "only-allowed-js-api",
  meta: {
    type: "problem",
    docs: {
      description:
        "Only allow the kintone JS APIs listed in permissions.js_api in manifest.",
      recommended: true,
      requiresTypeChecking: false,
    },
    messages: {
      onlyUseAllowedJsApi:
        "Only the kintone JS APIs listed in permissions.js_api in manifest are allowed.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const manifest = loadPluginManifest(context);

    const allowedJsApis = manifest.permissions?.js_api || [];

    const checkCallExpression = (node: TSESTree.CallExpression) => {
      const calleeName = joinCalleeNames(node);

      if (kintoneJsApis.includes(calleeName)) {
        if (!allowedJsApis.includes(calleeName)) {
          context.report({ node, messageId: "onlyUseAllowedJsApi" });
        }
      }
    };

    return {
      CallExpression: checkCallExpression,
    };
  },
});

const joinCalleeNames = (node: TSESTree.CallExpression): string => {
  const recursive = (
    expression:
      | TSESTree.Expression
      | TSESTree.Identifier
      | TSESTree.PrivateIdentifier,
  ): string[] => {
    if (expression.type === "Identifier") {
      return [expression.name];
    }

    if (expression.type === "MemberExpression") {
      return [
        ...recursive(expression.object),
        ...recursive(expression.property),
      ];
    }
    return [];
  };

  return recursive(node.callee).join(".");
};
