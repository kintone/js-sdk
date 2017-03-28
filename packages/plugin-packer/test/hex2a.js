'use strict';

const assert = require('assert');
const hex2a = require('../src/hex2a');

describe('hex2a', () => {
  it('empty string', () => {
    assert(hex2a('') === '');
  });

  it('number', () => {
    assert(hex2a('0') === 'a');
    assert(hex2a('1') === 'b');
    assert(hex2a('9') === 'j');
  });

  it('alphabet', () => {
    assert(hex2a('a') === 'k');
    assert(hex2a('b') === 'l');
    assert(hex2a('f') === 'p');
  });

  it('string', () => {
    assert(hex2a('012abc') === 'abcklm');
  });

  it('throws for out of range', () => {
    assert.throws(() => hex2a('/'));
    assert.throws(() => hex2a(':'));
    assert.throws(() => hex2a('`'));
    assert.throws(() => hex2a('g'));
  });

  it('upper case is out of range', () => {
    assert.throws(() => hex2a('A'));
  });
});
