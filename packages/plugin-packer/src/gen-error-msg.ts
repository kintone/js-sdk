import type * as Ajv from "ajv";

export const generateErrorMessages = (errors: Ajv.ErrorObject[]): string[] => {
  return errors.map((e) => {
    if (e.keyword === "enum") {
      return `"${e.instancePath}" ${e.message} (${(
        e.params.allowedValues as any[]
      )
        .map((v) => `"${v}"`)
        .join(", ")})`;
    }
    return `"${e.instancePath}" ${e.message}`;
  });
};
