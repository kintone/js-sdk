import type { TSESTree } from "@typescript-eslint/utils";
import { createRule } from "../utils/create-rule.js";

type MessageIds = "forbiddenCybozuDataAccess";
type Options = [];

/**
 * Disallow cybozu.data access
 */
export const rule = createRule<Options, MessageIds>({
  name: "no-cybozu-data",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Prevents access to `cybozu.data`, an internal and unsupported API that may change without notice.",
      recommended: true,
      requiresTypeChecking: false,
    },
    messages: {
      forbiddenCybozuDataAccess:
        "Accessing `cybozu.data` may cause unexpected behavior on kintone updates.",
    },
    schema: [],
  },
  defaultOptions: [],
  create: (context) => {
    // Check if a MemberExpression's property matches a name.
    // - `obj.data`    -> property is Identifier { name: "data" }
    // - `obj["data"]` -> property is Literal { value: "data" }
    const hasPropertyName = (
      node: TSESTree.MemberExpression,
      name: string,
    ): boolean => {
      return (
        (node.property.type === "Identifier" && node.property.name === name) ||
        (node.property.type === "Literal" && node.property.value === name)
      );
    };

    // Check if a node represents `window` or `globalThis.window`
    const isWindowObject = (node: TSESTree.Node): boolean => {
      if (node.type === "Identifier" && node.name === "window") {
        return true;
      }
      // globalThis.window or globalThis["window"]
      if (
        node.type === "MemberExpression" &&
        node.object.type === "Identifier" &&
        node.object.name === "globalThis" &&
        hasPropertyName(node, "window")
      ) {
        return true;
      }
      return false;
    };

    // Check if a node represents `cybozu`, `window.cybozu`, `globalThis.cybozu`, or `globalThis.window.cybozu`
    const isCybozuObject = (node: TSESTree.Node): boolean => {
      if (node.type === "Identifier" && node.name === "cybozu") {
        return true;
      }
      // globalThis.cybozu
      if (
        node.type === "MemberExpression" &&
        node.object.type === "Identifier" &&
        node.object.name === "globalThis" &&
        hasPropertyName(node, "cybozu")
      ) {
        return true;
      }
      // window.cybozu or globalThis.window.cybozu
      if (
        node.type === "MemberExpression" &&
        isWindowObject(node.object) &&
        hasPropertyName(node, "cybozu")
      ) {
        return true;
      }
      return false;
    };

    // Using MemberExpression visitor (instead of specific AST selector) to handle:
    // - Dot notation:      cybozu.data
    // - Bracket notation:  cybozu["data"]
    // - Optional chaining: cybozu?.data, cybozu?.["data"]
    // - Window prefix:     window.cybozu.data, window["cybozu"]["data"]
    return {
      MemberExpression: (node: TSESTree.MemberExpression) => {
        if (hasPropertyName(node, "data") && isCybozuObject(node.object)) {
          context.report({
            node,
            messageId: "forbiddenCybozuDataAccess",
          });
        }
      },
    };
  },
});
