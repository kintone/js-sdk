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
      forbiddenCybozuDataAccess: "Accessing `cybozu.data` is not allowed.",
    },
    schema: [],
  },
  defaultOptions: [],
  create: (context) => ({
    // Matches:
    //   cybozu.data
    //   cybozu["data"]
    //   cybozu?.data
    //   cybozu?.["data"]
    'MemberExpression[object.type="Identifier"][object.name="cybozu"][property.name="data"]':
      (node: TSESTree.Node) => {
        context.report({
          node,
          messageId: "forbiddenCybozuDataAccess",
        });
      },
  }),
});
