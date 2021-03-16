import type { ErrorObject } from "ajv";

export function generateErrorMessages(errors: ErrorObject[]): string[] {
  return errors.map((e) => {
    if (e.keyword === "enum") {
      return `"${e.dataPath}" ${e.message} (${e.params.allowedValues
        .map((v: any) => `"${v}"`)
        .join(", ")})`;
    }
    return `"${e.dataPath}" ${e.message}`;
  });
}
