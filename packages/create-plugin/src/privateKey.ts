"use strict";

import * as RSA from "node-rsa";

/**
 * Create a private key for a kintone plugin
 */
export function generatePrivateKey(): RSA.Key {
  const key = new RSA({ b: 1024 });
  return key.exportKey("pkcs1-private");
}
