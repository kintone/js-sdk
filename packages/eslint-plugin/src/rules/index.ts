import { rule as permissions } from "./permissions.js";
import type { Rule } from "eslint";

export const rules = {
  permissions: permissions as unknown as Rule.RuleModule,
};
