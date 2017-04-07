'use strict';

const assert = require('assert');
const validator = require('../');

describe('validator', () => {
  it('is a function', () => {
    assert(typeof validator === 'function');
  });

  it('minimal valid JSON', () => {
    assert.deepEqual(validator(json()), {valid: true, errors: null});
  });

  it('missing property', () => {
    const manifestJson = json();
    delete manifestJson.version;
    assert.deepEqual(validator(manifestJson), {
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
    assert.deepEqual(validator(json({version: '1'})), {
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
    assert.deepEqual(validator(json({version: 0})), {
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
    assert.deepEqual(validator(json({type: 'FOO'})), {
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
    assert.deepEqual(validator(json({description: {}})), {
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
    const actual = validator(json({
      manifest_version: 'a',
      version: 0,
    }));
    assert(actual.valid === false);
    assert(actual.errors.length === 2);
  });

  it('relative path is invalid for `url`', () => {
    const actual = validator(json({homepage_url: {en: 'foo/bar.html'}}));
    assert(actual.valid === false);
    assert(actual.errors.length === 1);
    assert(actual.errors[0].params.format === 'url');
  });

  it('"http:" is invalid for `https-url`', () => {
    const actual = validator(json({
      desktop: {
        js: [
          'http://example.com/icon.png'
        ]
      }
    }), {
      relativePath: str => !/^https?:/.test(str),
    });
    assert(actual.valid === false);
    assert(actual.errors.length === 3);
    assert(actual.errors[0].keyword === 'format');
    assert(actual.errors[1].keyword === 'format');
    assert(actual.errors[2].keyword === 'anyOf');
  });
});

/**
 * Generate minimum valid manifest.json and overwrite with source
 *
 * @param {Object=} source
 * @return {!Object}
 */
function json(source) {
  return Object.assign({
    manifest_version: 1,
    version: 1,
    type: 'APP',
    name: {
      en: 'sample plugin',
    },
    icon: 'image/icon.png',
  }, source);
}
