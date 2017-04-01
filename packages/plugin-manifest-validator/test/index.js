'use strict';

const assert = require('assert');
const validator = require('../');

describe('validator', () => {
  it('is a function', () => {
    assert(typeof validator === 'function');
  });
});
