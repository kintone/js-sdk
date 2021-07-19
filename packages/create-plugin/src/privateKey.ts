"use strict";

import RSA from "node-rsa";

/**
 * Create a private key for a kintone plugin
 */
export function generatePrivateKey() {
  const key = new RSA({ b: 1024 });
  return key.exportKey("pkcs1-private");
}
