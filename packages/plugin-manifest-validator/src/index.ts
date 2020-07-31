"use strict";

import Ajv from "ajv";
import v4metaSchema from "ajv/lib/refs/json-schema-draft-04.json";
import bytes from "bytes";
import jsonSchema from "./manifest-schema.json";
import validateUrl from "./validate-https-url";

/**
 * @param {Object} json
 * @param {Object=} options
 * @return {{valid: boolean, errors: Array<!Object>}} errors is null if valid
 */
type ValidateResult = {
  valid: boolean | PromiseLike<any>,
  errors: null | Array<Ajv.ErrorObject>,
}

export default function (json: Object, options: {[s: string]: (...args: any) => boolean} = {}): ValidateResult {
  let relativePath = (...args: any) => true;
  let maxFileSize = (...args: any) => true;
  if (typeof options.relativePath === "function") {
    relativePath = options.relativePath;
  }
  if (typeof options.maxFileSize === "function") {
    maxFileSize = options.maxFileSize;
  }
  const ajv = new Ajv({
    schemaId: "auto", // for draft-04
    meta: false, // don't load draft-07 meta schema
    allErrors: true,
    unknownFormats: true,
    errorDataPath: "property",
    formats: {
      "http-url": (str: string) => validateUrl(str, true),
      "https-url": (str: string) => validateUrl(str),
      "relative-path": relativePath,
    },
  });

  // Using draft-04 schemas
  // https://github.com/epoberezkin/ajv/releases/tag/5.0.0
  const fixedMetaShema = {
    ...v4metaSchema,
    $id: v4metaSchema.id,
  }
  ajv.addMetaSchema(fixedMetaShema);
  // @ts-expect-error TODO: capture ajv-validator/ajv issue(https://github.com/ajv-validator/ajv/issues/1253)
  ajv._opts.defaultMeta = v4metaSchema.id;
  ajv.removeKeyword("propertyNames");
  ajv.removeKeyword("contains");
  ajv.removeKeyword("const");
  ajv.removeKeyword("if");
  ajv.removeKeyword("then");
  ajv.removeKeyword("else");

  let validateMaxFileSize: Ajv.SchemaValidateFunction = (schema: string, data: string) => {
    // schema: max file size like "512KB" or 123 (in bytes)
    // data: path to the file
    const maxBytes = bytes.parse(schema);
    const valid = maxFileSize(maxBytes, data);
    if (!valid) {
      validateMaxFileSize.errors = [
        // @ts-expect-error TODO: need refact to not procedural code.
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
  }

  ajv.addKeyword("maxFileSize", {
    validate: validateMaxFileSize,
  });

  const validate = ajv.compile(jsonSchema);
  const valid = validate(json);
  return { valid, errors: transformErrors(validate.errors) };
};

type ValidateError = {
  keyword: string;
  message: string;
  params: {
    limit: number;
  };
};

/**
 * @param {null|Array<Object>} errors
 * @return {null|Array<Object>} shallow copy of the input or null
 */
function transformErrors(errors: undefined | null | Array<Ajv.ErrorObject>): null | Array<Ajv.ErrorObject> {
  if (!errors) {
    return null;
  }
  // shallow copy
  return errors.slice();
}
