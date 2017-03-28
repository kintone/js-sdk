'use strict';

const crypto = require('crypto');
const hex2a = require('./hex2a');

function uuid(publicKey) {
  const hash = crypto.createHash('sha256');
  hash.update(publicKey);
  const hexId = hash.digest().toString('hex').slice(0, 32);
  return hex2a(hexId);
}

module.exports = uuid;
