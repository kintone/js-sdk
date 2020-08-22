"use strict";

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'RSA'.
const RSA = require("node-rsa");

/**
 * @param {!Buffer} contents
 * @param {string} privateKey
 * @return {!Buffer} signature
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sign'.
function sign(contents: any, privateKey: any) {
  const key = new RSA(privateKey, "pkcs1-private-pem", {
    signingScheme: "pkcs1-sha1",
  });
  return key.sign(contents);
}

module.exports = sign;
