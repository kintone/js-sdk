"use strict";

import RSA from "node-rsa";

/**
 * Create a private key for a kintone plugin
 */
export const generatePrivateKey = () => {
  const key = new RSA({ b: 2048 });
  return key.exportKey("pkcs1-private");
};
