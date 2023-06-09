import type { ParsedArgs } from "../cli-parser";

export const validateArgs = (args: ParsedArgs) => {
  if (args.baseUrl === null) {
    throw new Error("--base-url (KINTONE_BASE_URL) must be specified");
  }

  const identifierConventionMsg = `The namespace and type-name convention:
- Starts with a letter (\`a-z\` or \`A-Z\`), underscore (\`_\`), or dollar sign (\`$\`).
- Can be followed by any alphanumeric, underscores, or dollar signs.`;

  if (args.namespace && !isValidIdentifier(args.namespace)) {
    throw new Error(`Invalid namespace option!\n${identifierConventionMsg}`);
  }

  if (args.typeName && !isValidIdentifier(args.typeName)) {
    throw new Error(`Invalid type-name option!\n${identifierConventionMsg}`);
  }
};

/**
 * https://developer.mozilla.org/en-US/docs/Glossary/Identifier
 * @param targetIdentifier
 */
const isValidIdentifier = (targetIdentifier: string): boolean => {
  const identifiers = targetIdentifier.split(".");
  const identifierRegex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
  return identifiers.every((identifier) => identifierRegex.test(identifier));
};
