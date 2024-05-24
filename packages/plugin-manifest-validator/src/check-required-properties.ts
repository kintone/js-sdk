import type { RequiredObjectProperty, RequiredProperties } from "./index";

export const checkRequiredProperties = (
  json: Record<string, any>,
  schema: RequiredProperties,
): string[] => {
  if (!schema.items || schema.items.length === 0) {
    return [];
  }

  const missingProperties: string[] = [];
  schema.items.forEach((item) => {
    if (typeof item === "object") {
      missingProperties.push(...getMissingPropertiesInObjectItem(json, item));
    } else if (isMissingProperty(json, item)) {
      missingProperties.push(item);
    }
  });

  return missingProperties.map((property) =>
    generateErrorMessage(property, schema.warn),
  );
};

const getMissingPropertiesInObjectItem = (
  json: Record<string, any>,
  items: RequiredObjectProperty,
): string[] => {
  const missingProperties: string[] = [];
  Object.keys(items).forEach((key) => {
    const properties = items[key].properties;
    if (!properties || properties.length === 0) {
      return;
    }

    properties.forEach((prop: string) => {
      if (isMissingProperty(json, key) || isMissingProperty(json[key], prop)) {
        missingProperties.push(`${key}.${prop}`);
      }
    });
  });

  return missingProperties;
};

const isMissingProperty = (json: Record<string, any>, property: string) => {
  return !json[property];
};

const generateErrorMessage = (
  property: string,
  warning: boolean = false,
): string => `Property "${property}" is ${warning ? "missing" : "required"}.`;
