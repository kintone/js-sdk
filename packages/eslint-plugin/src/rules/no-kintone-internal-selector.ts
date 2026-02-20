import type { TSESLint, TSESTree } from "@typescript-eslint/utils";
import { createRule } from "../utils/create-rule.js";

type MessageIds = "forbiddenClassname" | "suspiciousClassnameLiteral";
type Options = [];
type Context = TSESLint.RuleContext<MessageIds, Options>;

/**
 * Disallow using internal kintone UI class names in selectors.
 */
export const rule = createRule<Options, MessageIds>({
  name: "no-kintone-internal-selector",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Prevents the use of internal kintone UI class names (e.g., `gaia-argoui-`, `-gaia`, `ocean-`, and `kintone-`)",
      recommended: true,
      requiresTypeChecking: false,
    },
    messages: {
      forbiddenClassname:
        "Using internal kintone UI class name `{{className}}` is not allowed.",
      suspiciousClassnameLiteral:
        "Possible use of internal kintone UI class name `{{className}}`.",
    },
    schema: [],
  },
  defaultOptions: [],
  create: (context) => {
    const checked = new WeakSet<TSESTree.Literal>();
    return {
      'CallExpression[callee.property.name="querySelector"]': (
        callExp: TSESTree.CallExpression,
      ) => reportForbiddenSelectorCall(context, callExp, checked),
      'CallExpression[callee.property.name="querySelectorAll"]': (
        callExp: TSESTree.CallExpression,
      ) => reportForbiddenSelectorCall(context, callExp, checked),
      'CallExpression[callee.property.name="matches"]': (
        callExp: TSESTree.CallExpression,
      ) => reportForbiddenSelectorCall(context, callExp, checked),
      'CallExpression[callee.property.name="closest"]': (
        callExp: TSESTree.CallExpression,
      ) => reportForbiddenSelectorCall(context, callExp, checked),
      'CallExpression[callee.property.name="getElementsByClassName"]': (
        callExp: TSESTree.CallExpression,
      ) => reportForbiddenSelectorCall(context, callExp, checked),

      // NOTE: jQuery 等を含む「怪しい文字列リテラル」検知
      Literal: (literal: TSESTree.Literal) => {
        if (checked.has(literal)) {
          return;
        }
        if (typeof literal.value !== "string") {
          return;
        }
        for (const pattern of FORBIDDEN_CLASSNAME_PATTERNS) {
          const match = literal.value.match(pattern);
          if (match) {
            context.report({
              node: literal,
              messageId: "suspiciousClassnameLiteral",
              data: { className: match[0] },
            });
            break;
          }
        }
      },
    };
  },
});

const FORBIDDEN_CLASSNAME_PATTERNS = [
  /gaia-argoui-[A-Za-z0-9_-]*/,
  /[A-Za-z0-9_-]*-gaia/,
  /ocean-[A-Za-z0-9_-]*/,
  /kintone-[A-Za-z0-9_-]*/,
];

const reportForbiddenSelectorCall = (
  context: Context,
  node: TSESTree.CallExpression,
  checked: WeakSet<TSESTree.Literal>,
) => {
  for (const arg of node.arguments) {
    if (arg.type === "Literal" && typeof arg.value === "string") {
      for (const pattern of FORBIDDEN_CLASSNAME_PATTERNS) {
        const match = arg.value.match(pattern);
        if (match) {
          checked.add(arg);
          context.report({
            node: arg,
            messageId: "forbiddenClassname",
            data: { className: match[0] },
          });
          break;
        }
      }
    }
  }
};
