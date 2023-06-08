type Args = {
  namespace?: string;
  typeName?: string;
};

export const validateArgs = (args: Args) => {
  if (args.namespace && !isValidIdentifier(args.namespace)) {
    throw new Error("Invalid namespace option!");
  }

  if (args.typeName && !isValidIdentifier(args.typeName)) {
    throw new Error("Invalid type-name option!");
  }
};

const isValidIdentifier = (targetIdentifier: string): boolean => {
  const identifiers = targetIdentifier.split(".");
  const identifierRegex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
  return identifiers.every((identifier) => identifierRegex.test(identifier));
};
