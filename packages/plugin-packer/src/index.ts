import { ZipFile } from "yazl";
// import RSA from "node-rsa";
import streamBuffers from "stream-buffers";
import _debug from "debug";
import crypto from "crypto";
import jose from "node-jose";
// import { sign } from "./sign";
import { uuid } from "./uuid";
import { validateContentsZip } from "./zip";

const debug = _debug("packer");

const packer = async (
  contentsZip: Buffer,
  privateKey_?: string,
): Promise<{
  plugin: Buffer;
  privateKey: string;
  id: string;
}> => {
  // let privateKey = privateKey_;
  // let key;
  // if (privateKey) {
  //   key = new RSA(privateKey);
  // } else {
  //   debug("generating a new key");
  //   key = new RSA({ b: 1024 });
  //   privateKey = key.exportKey("pkcs1-private");
  // }
  //
  // const signature = sign(contentsZip, privateKey);
  // const publicKey = key.exportKey("pkcs8-public-der");
  // // const publicKey = Buffer.from("MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDRG0letFHTpCAJrxy8fTP3R3+K0LMAe4c2YykDNELzi2ndUGXMMM8T4mhG5k5FW+sMjW8+XDmzXR7bbquEtSmqSdH9WouPSn6SJ1");
  // const id = uuid(publicKey);
  // debug(`id : ${id}`);
  // console.log("publicKey", Buffer.from(publicKey).toString("base64"));
  // return validateContentsZip(contentsZip)
  //   .then(() => zip(contentsZip, publicKey, signature))
  //   .then((plugin) => ({
  //     plugin,
  //     privateKey,
  //     id,
  //   })) as any;

  let privateKey;
  let privateCryptoKey: crypto.webcrypto.CryptoKey;
  let publicKey: ArrayBuffer;
  let publicCryptoKey: crypto.webcrypto.CryptoKey;
  if (privateKey_) {
    // Use existing private key
    privateKey = privateKey_;
    privateCryptoKey = await importPrivateKey(privateKey);
    publicCryptoKey = await exportPublicKeyFromPrivateKey(privateCryptoKey);
    publicKey = await crypto.subtle.exportKey("spki", publicCryptoKey);
  } else {
    debug("generating a new key");
    const cryptoKeyPair = await generateKey();
    privateCryptoKey = cryptoKeyPair.privateKey;
    publicCryptoKey = cryptoKeyPair.publicKey;
    const privateKeyBuf = await exportPrivateKey(privateCryptoKey);
    privateKey = `-----BEGIN PRIVATE KEY-----\n${arrayBufferToBase64(privateKeyBuf)}\n-----END PRIVATE KEY-----`;
    publicKey = await exportPublicKey(publicCryptoKey);
  }

  const signature = await sign(contentsZip, privateCryptoKey);
  const id = await uuid(Buffer.from(publicKey));

  debug("id : %s", id);
  debug(
    "Verify signature: %s",
    await verify(contentsZip, publicCryptoKey, signature),
  );

  await validateContentsZip(contentsZip);
  const plugin = await zip(
    contentsZip,
    Buffer.from(publicKey),
    Buffer.from(signature),
  );

  return {
    plugin,
    privateKey,
    id,
  };
};

export = packer;

const hasKeysProperty = (obj: any): obj is { keys: crypto.JsonWebKey[] } => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "keys" in obj &&
    Array.isArray(obj.keys) &&
    obj.keys.length > 0
  );
};

const convertToJWK = async (
  key: string,
  isPrivateKey = false,
): Promise<crypto.JsonWebKey> => {
  const keyStore = jose.JWK.createKeyStore();

  await keyStore.add(key, "pem");
  const jwkKey = keyStore.toJSON(isPrivateKey);
  if (hasKeysProperty(jwkKey)) {
    return jwkKey.keys[0] as crypto.JsonWebKey;
  }

  throw new Error("Invalid JWK key");
};

const btoa = (text: string) => Buffer.from(text, "binary").toString("base64");

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const binaryString = String.fromCharCode(...new Uint8Array(buffer));
  return btoa(binaryString);
};

const generateKey = async (): Promise<crypto.webcrypto.CryptoKeyPair> => {
  return crypto.subtle.generateKey(
    {
      name: "RSASSA-PKCS1-v1_5",
      modulusLength: 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
      hash: { name: "SHA-256" },
    },
    true, // extractable
    ["sign", "verify"],
  );
};

const importPrivateKey = async (
  privateKey: string,
): Promise<crypto.webcrypto.CryptoKey> => {
  const jwkKey = await convertToJWK(privateKey, true);

  return crypto.subtle.importKey(
    "jwk",
    jwkKey,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    true, // not extractable
    ["sign"],
  );
};

const exportPrivateKey = async (
  key: crypto.webcrypto.CryptoKey,
): Promise<ArrayBuffer> => {
  return crypto.subtle.exportKey("pkcs8", key);
};

const exportPublicKeyFromPrivateKey = async (
  privateKey: crypto.webcrypto.CryptoKey,
): Promise<crypto.webcrypto.CryptoKey> => {
  const jwk = await crypto.subtle.exportKey("jwk", privateKey);

  // remove private data from JWK
  delete jwk.d;
  delete jwk.dp;
  delete jwk.dq;
  delete jwk.q;
  delete jwk.qi;
  jwk.key_ops = ["verify"];

  // import public key
  return crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    true,
    ["verify"],
  );
};

const exportPublicKey = async (
  key: crypto.webcrypto.CryptoKey,
): Promise<ArrayBuffer> => {
  return crypto.subtle.exportKey("spki", key);
};

const sign = async (
  data: Buffer,
  key: crypto.webcrypto.CryptoKey,
): Promise<ArrayBuffer> => {
  return crypto.subtle.sign(
    {
      name: "RSASSA-PKCS1-v1_5",
    },
    key,
    data,
  );
};

const verify = async (
  data: Buffer,
  publicKey: crypto.webcrypto.CryptoKey,
  signature: ArrayBuffer,
): Promise<boolean> => {
  return crypto.subtle.verify(
    {
      name: "RSASSA-PKCS1-v1_5",
    },
    publicKey,
    signature,
    data,
  );
};

/**
 * Create plugin.zip
 */
const zip = (
  contentsZip: Buffer,
  publicKey: Buffer,
  signature: Buffer,
): Promise<Buffer> => {
  debug(`zip(): start`);
  return new Promise((res, rej) => {
    const output = new streamBuffers.WritableStreamBuffer();
    const zipFile = new ZipFile();
    output.on("finish", () => {
      debug(`zip(): output finish event`);
      res(output.getContents() as any);
    });
    zipFile.outputStream.pipe(output);
    zipFile.addBuffer(contentsZip, "contents.zip");
    zipFile.addBuffer(publicKey, "PUBKEY");
    zipFile.addBuffer(signature, "SIGNATURE");
    zipFile.end(undefined, ((finalSize: number) => {
      debug(`zip(): ZipFile end event: finalSize ${finalSize} bytes`);
    }) as any);
  });
};
