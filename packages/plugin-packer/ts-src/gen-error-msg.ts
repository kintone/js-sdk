import type Ajv from "ajv";

export function generateErrorMessages(
  errors: Array<Ajv.ErrorObject>
): Array<string> {
  return errors.map((e) => {
    if (e.keyword === "enum") {
      return `"${e.dataPath}" ${
        e.message
      } (${(e.params as Ajv.EnumParams).allowedValues
        .map((v) => `"${v}"`)
        .join(", ")})`;
    }
    return `"${e.dataPath}" ${e.message}`;
  });
}
