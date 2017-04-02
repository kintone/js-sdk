'use strict';

const Ajv = require('ajv');
const jsonSchema = require('./manifest-schema.json');

module.exports = function(json) {
  const ajv = new Ajv();
  const validate = ajv.compile(jsonSchema);
  const valid = validate(json);
  return {valid: valid, errors: validate.errors};
};
