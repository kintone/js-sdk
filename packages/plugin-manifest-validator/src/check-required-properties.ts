import type { RequiredProperties } from "./index";

const checkRequiredProperties = (
  json: Record<string, any>,
  schema: RequiredProperties,
): string[] => {
  if (!schema.items || schema.items.length === 0) {
    return [];
  }

  const errors: string[] = [];
  for (let i = 0; i < schema.items.length; i++) {
    const item = schema.items[i];
    if (typeof item === "object") {
      for (const property in item) {
        if (
          !item[property].properties ||
          item[property].properties.length === 0
        ) {
          continue;
        }

        item[property].properties.forEach((prop: string) => {
          if (!json[property] || !json[property][prop]) {
            errors.push(
              generateErrorMessage(`${property}.${prop}`, schema.warn),
            );
          }
        });
      }
    } else if (!json[item]) {
      errors.push(generateErrorMessage(item, schema.warn));
    }
  }

  return errors;
};

const generateErrorMessage = (
  property: string,
  warning: boolean = false,
): string => `Property "${property}" is ${warning ? "missing" : "required"}.`;

export default checkRequiredProperties;
