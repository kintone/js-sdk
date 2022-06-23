import assert from "assert";
import { generatePrivateKey } from "../privateKey";

describe("privateKey", () => {
  describe("generatePrivateKey", () => {
    it("should be able to create a private key", () => {
      const key = generatePrivateKey();
      assert(key.startsWith("-----BEGIN RSA PRIVATE KEY-----"));
    });
  });
});
