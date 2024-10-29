import type { ParsedArgs } from "../cli-parser";

export const validateArgs = (args: ParsedArgs) => {
  if (args.baseUrl === null) {
    throw new Error("--base-url (KINTONE_BASE_URL) must be specified");
  }

  const identifierConventionMsg = `In the ECMA262 specification, this is an invalid string as IdentifierName.`;

  if (args.namespace && !isValidIdentifier(args.namespace)) {
    throw new Error(`Invalid namespace option!\n${identifierConventionMsg}`);
  }

  if (args.typeName && !isValidIdentifier(args.typeName)) {
    throw new Error(`Invalid type-name option!\n${identifierConventionMsg}`);
  }
};

/**
 * https://262.ecma-international.org/14.0/index.html#prod-IdentifierName
 * @param targetIdentifier
 */
const isValidIdentifier = (targetIdentifier: string): boolean => {
  const identifiers = targetIdentifier.split(".");
  const identifierRegex = /^[\p{ID_Start}_$][\p{ID_Continue}$\u200C\u200D]*$/u;
  return identifiers.every((identifier) => identifierRegex.test(identifier));
};
