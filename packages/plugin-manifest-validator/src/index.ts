"use strict";

import Ajv, { ErrorObject } from "ajv";
import bytes from "bytes";
import jsonSchema from "../manifest-schema.json";
import validateUrl from "./validate-https-url";

type ValidateResult = {
  valid: boolean | PromiseLike<any>;
  errors: null | ErrorObject[];
};

// https://ajv.js.org/docs/keywords.html#define-keyword-with-validation-function
// FIXME: use the type definition that Ajv provides if https://github.com/ajv-validator/ajv/pull/1460 has been merged
interface SchemaValidateFunction {
  (schema: string, data: string): boolean;
  errors?: Array<Partial<ErrorObject>>;
}

/**
 * @param {Object} json
 * @param {Object=} options
 * @return {{valid: boolean, errors: Array<!Object>}} errors is null if valid
 */
export default (
  json: Record<string, any>,
  options: { [s: string]: (...args: any) => boolean } = {}
): ValidateResult => {
  let relativePath = (...args: any) => true;
  let maxFileSize = (...args: any) => true;
  if (typeof options.relativePath === "function") {
    relativePath = options.relativePath;
  }
  if (typeof options.maxFileSize === "function") {
    maxFileSize = options.maxFileSize;
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
    data: string
  ) => {
    // schema: max file size like "512KB" or 123 (in bytes)
    // data: path to the file
    const maxBytes = bytes.parse(schema);
    const valid = maxFileSize(maxBytes, data);
    if (!valid) {
      validateMaxFileSize.errors = [
        {
          keyword: "maxFileSize",
          params: {
            limit: maxBytes,
          },
          message: `file size should be <= ${schema}`,
        },
      ];
    }
    return valid;
  };

  ajv.addKeyword({
    keyword: "maxFileSize",
    validate: validateMaxFileSize,
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
