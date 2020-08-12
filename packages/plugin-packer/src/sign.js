"use strict";

const RSA = require("node-rsa");

/**
 * @param {!Buffer} contents
 * @param {string} privateKey
 * @return {!Buffer} signature
 */
function sign(contents, privateKey) {
  const key = new RSA(privateKey, "pkcs1-private-pem", {
    signingScheme: "pkcs1-sha1",
  });
  return key.sign(contents);
}

module.exports = sign;
