'use strict';

const Ajv = require('ajv');
const v4metaSchema = require('ajv/lib/refs/json-schema-draft-04.json');
const bytes = require('bytes');
const jsonSchema = require('./manifest-schema.json');
const validateUrl = require('./src/validate-https-url');

/**
 * @param {Object} json
 * @param {Object=} options
 * @return {{valid: boolean, errors: Array<!Object>}} errors is null if valid
 */
module.exports = function(json, options) {
  options = options || {};
  let relativePath = () => true;
  let maxFileSize = () => true;
  if (typeof options.relativePath === 'function') {
    relativePath = options.relativePath;
  }
  if (typeof options.maxFileSize === 'function') {
    maxFileSize = options.maxFileSize;
  }
  const ajv = new Ajv({
    allErrors: true,
    unknownFormats: true,
    errorDataPath: 'property',
    formats: {
      'http-url': str => validateUrl(str, true),
      'https-url': str => validateUrl(str),
      'relative-path': relativePath,
    },
  });

  // Using draft-04 schemas
  // https://github.com/epoberezkin/ajv/releases/tag/5.0.0
  ajv.addMetaSchema(v4metaSchema);
  ajv._opts.defaultMeta = v4metaSchema.id;
  ajv.removeKeyword('propertyNames');
  ajv.removeKeyword('contains');
  ajv.removeKeyword('const');

  ajv.addKeyword('maxFileSize', {
    validate: function validateMaxFileSize(schema, data) {
      // schema: max file size like "512KB" or 123 (in bytes)
      // data: path to the file
      const maxBytes = bytes.parse(schema);
      const valid = maxFileSize(maxBytes, data);
      if (!valid) {
        validateMaxFileSize.errors = [{
          keyword: 'maxFileSize',
          message: `file size should be <= ${schema}`,
          params: {
            limit: maxBytes,
          },
        }];
      }
      return valid;
    },
  });

  const validate = ajv.compile(jsonSchema);
  const valid = validate(json);
  return {valid: valid, errors: transformErrors(validate.errors)};
};

/**
 * @param {null|Array<Object>} errors
 * @return {null|Array<Object>} shallow copy of the input or null
 */
function transformErrors(errors) {
  if (!errors) {
    return null;
  }
  // shallow copy
  return errors.slice();
}
