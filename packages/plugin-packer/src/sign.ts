import RSA from "node-rsa";

export const sign = (contents: Buffer, privateKey: string): Buffer => {
  const key = new RSA(privateKey, "pkcs1-private-pem", {
    signingScheme: "pkcs1-sha1",
  });
  return key.sign(contents);
};
