'use strict';

/* eslint-disable global-require */

const assert = require('assert');
const validator = require('../');

describe('validator', () => {
  it('is a function', () => {
    assert(typeof validator === 'function');
  });

  it('minimal valid JSON', () => {
    assert.deepEqual(validator(require('./fixtures/minimal.json')), {valid: true, errors: null});
  });

  it('missing property', () => {
    assert.deepEqual(validator(require('./fixtures/no-version.json')), {
      valid: false,
      errors: [{
        dataPath: '.version',
        keyword: 'required',
        message: 'is a required property',
        params: {
          missingProperty: 'version',
        },
        schemaPath: '#/required',
      }]
    });
  });

  it('invalid type', () => {
    assert.deepEqual(validator(require('./fixtures/version-is-string.json')), {
      valid: false,
      errors: [{
        dataPath: '.version',
        keyword: 'type',
        message: 'should be integer',
        params: {
          type: 'integer',
        },
        schemaPath: '#/properties/version/type',
      }]
    });
  });

  it('integer is out of range', () => {
    assert.deepEqual(validator(require('./fixtures/version-is-zero.json')), {
      valid: false,
      errors: [{
        dataPath: '.version',
        keyword: 'minimum',
        message: 'should be >= 1',
        params: {
          comparison: '>=',
          exclusive: false,
          limit: 1,
        },
        schemaPath: '#/properties/version/minimum',
      }]
    });
  });

  it('invalid enum value', () => {
    assert.deepEqual(validator(require('./fixtures/type-is-not-app.json')), {
      valid: false,
      errors: [{
        dataPath: '.type',
        keyword: 'enum',
        message: 'should be equal to one of the allowed values',
        params: {
          allowedValues: [
            'APP',
          ],
        },
        schemaPath: '#/properties/type/enum',
      }]
    });
  });

  it('no English description', () => {
    assert.deepEqual(validator(require('./fixtures/no-english-description.json')), {
      valid: false,
      errors: [{
        dataPath: '.description.en',
        keyword: 'required',
        message: 'is a required property',
        params: {
          missingProperty: 'en',
        },
        schemaPath: '#/properties/description/required',
      }]
    });
  });

  it('2 errors', () => {
    const actual = validator(require('./fixtures/2-errors.json'));
    assert(actual.valid === false);
    assert(actual.errors.length === 2);
  });
});
