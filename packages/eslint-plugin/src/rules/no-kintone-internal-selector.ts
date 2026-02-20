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
    const checkedLiterals = new WeakSet<TSESTree.Literal>();
    const checkedTemplateLiterals = new WeakSet<TSESTree.TemplateLiteral>();
    return {
      'CallExpression[callee.property.name="querySelector"]': (
        callExp: TSESTree.CallExpression,
      ) =>
        reportForbiddenSelectorCall(
          context,
          callExp,
          checkedLiterals,
          checkedTemplateLiterals,
        ),
      'CallExpression[callee.property.name="querySelectorAll"]': (
        callExp: TSESTree.CallExpression,
      ) =>
        reportForbiddenSelectorCall(
          context,
          callExp,
          checkedLiterals,
          checkedTemplateLiterals,
        ),
      'CallExpression[callee.property.name="matches"]': (
        callExp: TSESTree.CallExpression,
      ) =>
        reportForbiddenSelectorCall(
          context,
          callExp,
          checkedLiterals,
          checkedTemplateLiterals,
        ),
      'CallExpression[callee.property.name="closest"]': (
        callExp: TSESTree.CallExpression,
      ) =>
        reportForbiddenSelectorCall(
          context,
          callExp,
          checkedLiterals,
          checkedTemplateLiterals,
        ),
      'CallExpression[callee.property.name="getElementsByClassName"]': (
        callExp: TSESTree.CallExpression,
      ) =>
        reportForbiddenSelectorCall(
          context,
          callExp,
          checkedLiterals,
          checkedTemplateLiterals,
        ),

      // NOTE: Detects suspicious string literals including those used with jQuery
      Literal: (literal: TSESTree.Literal) => {
        if (checkedLiterals.has(literal)) {
          return;
        }
        if (typeof literal.value !== "string") {
          return;
        }
        const className = findForbiddenClassName(literal.value);
        if (className) {
          context.report({
            node: literal,
            messageId: "suspiciousClassnameLiteral",
            data: { className },
          });
        }
      },

      // NOTE: Detects suspicious template literals including those used with jQuery
      TemplateLiteral: (templateLiteral: TSESTree.TemplateLiteral) => {
        if (checkedTemplateLiterals.has(templateLiteral)) {
          return;
        }
        for (const quasi of templateLiteral.quasis) {
          const className = findForbiddenClassName(quasi.value.raw);
          if (className) {
            context.report({
              node: templateLiteral,
              messageId: "suspiciousClassnameLiteral",
              data: { className },
            });
            return;
          }
        }
      },
    };
  },
});

const FORBIDDEN_CLASSNAME_PATTERNS = [
  /gaia-argoui-[A-Za-z0-9_-]*/,
  /[A-Za-z0-9_-]*-gaia(?![A-Za-z0-9_-])/,
  /ocean-[A-Za-z0-9_-]*/,
  /kintone-[A-Za-z0-9_-]*/,
];

const findForbiddenClassName = (value: string): string | null => {
  for (const pattern of FORBIDDEN_CLASSNAME_PATTERNS) {
    const match = value.match(pattern);
    if (match) {
      return match[0];
    }
  }
  return null;
};

const reportForbiddenSelectorCall = (
  context: Context,
  node: TSESTree.CallExpression,
  checkedLiterals: WeakSet<TSESTree.Literal>,
  checkedTemplateLiterals: WeakSet<TSESTree.TemplateLiteral>,
) => {
  for (const arg of node.arguments) {
    if (arg.type === "Literal" && typeof arg.value === "string") {
      const className = findForbiddenClassName(arg.value);
      if (className) {
        checkedLiterals.add(arg);
        context.report({
          node: arg,
          messageId: "forbiddenClassname",
          data: { className },
        });
      }
    } else if (arg.type === "TemplateLiteral") {
      reportForbiddenTemplateLiteral(context, arg, checkedTemplateLiterals);
    }
  }
};

const reportForbiddenTemplateLiteral = (
  context: Context,
  templateLiteral: TSESTree.TemplateLiteral,
  checkedTemplateLiterals: WeakSet<TSESTree.TemplateLiteral>,
) => {
  for (const quasi of templateLiteral.quasis) {
    const className = findForbiddenClassName(quasi.value.raw);
    if (className) {
      checkedTemplateLiterals.add(templateLiteral);
      context.report({
        node: templateLiteral,
        messageId: "forbiddenClassname",
        data: { className },
      });
      return;
    }
  }
};
