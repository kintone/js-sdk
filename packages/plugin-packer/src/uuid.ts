"use strict";

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'crypto'.
const crypto = require("crypto");

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hex2a'.
const hex2a = require("./hex2a");

/**
 * @param {!Buffer} publicKey
 * @return {string}
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'uuid'.
function uuid(publicKey: any) {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'createHash' does not exist on type 'Cryp... Remove this comment to see the full error message
  const hash = crypto.createHash("sha256");
  hash.update(publicKey);
  const hexId = hash.digest().toString("hex").slice(0, 32);
  return hex2a(hexId);
}

module.exports = uuid;
