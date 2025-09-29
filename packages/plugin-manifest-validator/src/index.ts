"use strict";

import type { ErrorObject, SchemaValidateFunction } from "ajv";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import bytes from "bytes";
import jsonSchema from "../manifest-schema.json";
import validateUrl from "./validate-https-url";
import { checkRequiredProperties } from "./check-required-properties";

type WarningObject = {
  message: string;
};

type ValidateResult = {
  valid: boolean | PromiseLike<any>;
  errors: null | ErrorObject[];
  warnings: null | WarningObject[];
};

export type RequiredObjectProperty = {
  [key: string]: { properties: string[] };
};

export type RequiredProperties = {
  items: Array<RequiredObjectProperty | string>;
  warn?: boolean;
};

// https://ajv.js.org/docs/keywords.html#define-keyword-with-validation-function
// FIXME: use the type definition that Ajv provides if https://github.com/ajv-validator/ajv/pull/1460 has been merged

export type ValidatorResult =
  | boolean
  | { valid: true }
  | { valid: false; message?: string };

export type Options = {
  relativePath?: (filePath: string) => boolean | Promise<boolean>;
  maxFileSize?: (
    maxBytes: number,
    filePath: string,
  ) => ValidatorResult | Promise<ValidatorResult>;
  fileExists?: (filePath: string) => ValidatorResult | Promise<ValidatorResult>;
};

/**
 * @param {Object} json
 * @param {Object=} options
 * @return {{valid: boolean, errors: Array<!Object>}} errors is null if valid
 */
export default (
  json: Record<string, any>,
  options: Options = {},
): ValidateResult => {
  let relativePath: Options["relativePath"] = () => true;
  let maxFileSize: Options["maxFileSize"];
  let fileExists: Options["fileExists"];
  const warnings: WarningObject[] = [];

  if (typeof options.relativePath === "function") {
    relativePath = options.relativePath;
  }
  if (typeof options.maxFileSize === "function") {
    maxFileSize = options.maxFileSize;
  }
  if (typeof options.fileExists === "function") {
    fileExists = options.fileExists;
  }

  const ajv = new Ajv({
    allErrors: true,
    formats: {
      "http-url": (str: string) => validateUrl(str, true),
      "https-url": (str: string) => validateUrl(str),
      "relative-path": {
        validate: async (filePath: string) => relativePath(filePath),
        async: true,
      },
    },
  });
  addFormats(ajv, { mode: "fast", formats: ["uri"] });

  const validateMaxFileSize: SchemaValidateFunction = async (
    schema: string,
    filePath: string,
  ) => {
    // schema: max file size like "512KB" or 123 (in bytes)
    // data: path to the file
    if (maxFileSize === undefined) {
      return true;
    }

    const maxBytes = bytes.parse(schema);
    const result = await maxFileSize(maxBytes, filePath);
    const defaultMessage = `file size should be <= ${schema}`;

    if (result === false) {
      validateMaxFileSize.errors = [
        {
          keyword: "maxFileSize",
          params: {
            limit: maxBytes,
          },
          message: defaultMessage,
        },
      ];
      return false;
    }

    if (typeof result === "object" && !result.valid) {
      validateMaxFileSize.errors = [
        {
          keyword: "maxFileSize",
          params: {
            limit: maxBytes,
          },
          message: result.message ?? defaultMessage,
        },
      ];
      return false;
    }

    return true;
  };

  const validateFileExists: SchemaValidateFunction = async (
    schema: boolean,
    filePath: string,
  ) => {
    if (fileExists === undefined || !schema) {
      return true;
    }

    const result = await fileExists(filePath);
    const defaultMessage = `file should exist ("${filePath}")`;

    if (result === false) {
      validateFileExists.errors = [
        {
          keyword: "fileExists",
          message: defaultMessage,
        },
      ];
      return false;
    }

    if (typeof result === "object" && !result.valid) {
      validateFileExists.errors = [
        {
          keyword: "fileExists",
          message: result.message ?? defaultMessage,
        },
      ];
      return false;
    }

    return true;
  };

  const validateRequiredProperties: SchemaValidateFunction = (
    schema: RequiredProperties,
    data: string,
  ) => {
    if (!data || data.length === 0) {
      return true;
    }

    const errors = checkRequiredProperties(json, schema);
    if (errors.length === 0) {
      return true;
    }

    if (schema.warn) {
      warnings.push(
        ...errors.map((error) => {
          return { message: error };
        }),
      );
      return true;
    }

    validateRequiredProperties.errors = errors.map((error) => ({
      keyword: "requiredProperties",
      message: error,
    }));

    return false;
  };

  ajv.addKeyword({
    keyword: "maxFileSize",
    validate: validateMaxFileSize,
  });

  ajv.addKeyword({
    keyword: "fileExists",
    validate: validateFileExists,
  });

  ajv.addKeyword({
    keyword: "requiredProperties",
    validate: validateRequiredProperties,
  });

  const validate = ajv.compile(jsonSchema);
  const valid = validate(json);
  return {
    valid,
    errors: transformErrors(validate.errors),
    warnings: warnings.length === 0 ? null : warnings,
  };
};

/**
 * @param {undefined|null|Array<Object>} errors
 * @return {null|Array<Object>} shallow copy of the input or null
 */
const transformErrors = (
  errors: undefined | null | ErrorObject[],
): null | ErrorObject[] => {
  if (!errors) {
    return null;
  }
  // shallow copy
  return errors.slice();
};
