import { ZipFile } from "yazl";
import RSA from "node-rsa";
import streamBuffers from "stream-buffers";
import _debug from "debug";
import { sign } from "./sign";
import { uuid } from "./uuid";
import { validateContentsZip } from "./zip";

const debug = _debug("packer");

export = function packer(
  contentsZip: Buffer,
  privateKey_?: string
): Promise<{
  plugin: Buffer;
  privateKey: string;
  id: string;
}> {
  let privateKey = privateKey_;
  let key;
  if (privateKey) {
    key = new RSA(privateKey);
  } else {
    debug("generating a new key");
    key = new RSA({ b: 1024 });
    privateKey = key.exportKey("pkcs1-private");
  }

  const signature = sign(contentsZip, privateKey);
  const publicKey = key.exportKey("pkcs8-public-der");
  const id = uuid(publicKey);
  debug(`id : ${id}`);
  return validateContentsZip(contentsZip)
    .then(() => zip(contentsZip, publicKey, signature))
    .then((plugin) => ({
      plugin,
      privateKey,
      id,
    })) as any;
};

/**
 * Create plugin.zip
 */
function zip(
  contentsZip: Buffer,
  publicKey: Buffer,
  signature: Buffer
): Promise<Buffer> {
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
    zipFile.end(undefined, ((finalSize: any) => {
      debug(`zip(): ZipFile end event: finalSize ${finalSize} bytes`);
    }) as any);
  });
}
