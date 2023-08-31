"use strict";

import type { ErrorObject, SchemaValidateFunction } from "ajv";
import Ajv from "ajv";
import bytes from "bytes";
import jsonSchema from "../manifest-schema.json";
import validateUrl from "./validate-https-url";

type ValidateResult = {
  valid: boolean | PromiseLike<any>;
  errors: null | ErrorObject[];
};

// https://ajv.js.org/docs/keywords.html#define-keyword-with-validation-function
// FIXME: use the type definition that Ajv provides if https://github.com/ajv-validator/ajv/pull/1460 has been merged

type ValidatorResult =
  | boolean
  | { valid: true }
  | { valid: false; message?: string };

type Options = {
  relativePath?: (filePath: string) => boolean;
  maxFileSize?: (maxBytes: number, filePath: string) => ValidatorResult;
  fileExists?: (filePath: string) => ValidatorResult;
};

/**
 * @param {Object} json
 * @param {Object=} options
 * @return {{valid: boolean, errors: Array<!Object>}} errors is null if valid
 */
export default (
  json: Record<string, any>,
  options: Options = {}
): ValidateResult => {
  let relativePath: Options["relativePath"] = () => true;
  let maxFileSize: Options["maxFileSize"];
  let fileExists: Options["fileExists"];

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
      "relative-path": relativePath,
    },
  });

  const validateMaxFileSize: SchemaValidateFunction = (
    schema: string,
    filePath: string
  ) => {
    // schema: max file size like "512KB" or 123 (in bytes)
    // data: path to the file
    if (maxFileSize === undefined) {
      return true;
    }

    const maxBytes = bytes.parse(schema);
    const result = maxFileSize(maxBytes, filePath);
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

  const validateFileExists: SchemaValidateFunction = (
    schema: boolean,
    filePath: string
  ) => {
    if (fileExists === undefined || !schema) {
      return true;
    }

    const result = fileExists(filePath);
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

  ajv.addKeyword({
    keyword: "maxFileSize",
    validate: validateMaxFileSize,
  });

  ajv.addKeyword({
    keyword: "fileExists",
    validate: validateFileExists,
  });

  const validate = ajv.compile(jsonSchema);
  const valid = validate(json);
  return { valid, errors: transformErrors(validate.errors) };
};

/**
 * @param {undefined|null|Array<Object>} errors
 * @return {null|Array<Object>} shallow copy of the input or null
 */
const transformErrors = (
  errors: undefined | null | ErrorObject[]
): null | ErrorObject[] => {
  if (!errors) {
    return null;
  }
  // shallow copy
  return errors.slice();
};
