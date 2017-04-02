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
});
