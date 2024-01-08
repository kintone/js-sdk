import crypto from "crypto";
import path from "path";
import fs from "fs";
import RSA from "node-rsa";
import yauzl from "yauzl";

import { readZipContentsNames } from "./helper/zip";

import packer from "../src";

const privateKeyPath = path.join(__dirname, "fixtures", "private.ppk");
const contentsZipPath = path.join(__dirname, "fixtures", "contents.zip");
const invalidMaxFileSizeContentsZipPath = path.join(
  __dirname,
  "fixtures",
  "invalid-maxFileSize-contents.zip",
);

describe("packer", () => {
  it("is a function", () => {
    expect(typeof packer).toBe("function");
  });

  describe("without privateKey", () => {
    let output: Awaited<ReturnType<typeof packer>>;
    beforeEach(async () => {
      const contentsZip = fs.readFileSync(contentsZipPath);
      output = await packer(contentsZip);
    });

    it("the id is generated", () => {
      expect(typeof output.id).toBe("string");
      expect(output.id.length).toBe(32);
    });

    it("the privateKey is generated", () => {
      expect(typeof output.privateKey).toBe("string");
      expect(/^-----BEGIN RSA PRIVATE KEY-----/.test(output.privateKey)).toBe(
        true,
      );
    });

    it("the zip contains 3 files", async () => {
      const files = await readZipContentsNames(output.plugin);
      expect(files.sort()).toStrictEqual(
        ["contents.zip", "PUBKEY", "SIGNATURE"].sort(),
      );
    });

    it("the zip passes signature verification", async () => {
      await verifyPlugin(output.plugin);
    });
  });

  describe("with privateKey", () => {
    let privateKey: string;
    let output: Awaited<ReturnType<typeof packer>>;
    beforeEach(async () => {
      const contentsZip = fs.readFileSync(contentsZipPath);
      privateKey = fs.readFileSync(privateKeyPath, "utf8");
      output = await packer(contentsZip, privateKey);
    });

    it("the id is expected", () => {
      expect(output.id).toBe("ldmhlgpmfpfhpgimbjlblmfkmcnbjnnj");
    });

    it("the privateKey is same", () => {
      expect(output.privateKey).toBe(privateKey);
    });

    it("the zip passes signature verification", async () => {
      await verifyPlugin(output.plugin);
    });
  });

  describe("invalid contents.zip", () => {
    it("throws an error if the contents.zip is invalid", async () => {
      const contentsZip = fs.readFileSync(invalidMaxFileSizeContentsZipPath);
      await expect(packer(contentsZip)).rejects.toThrow(
        '"/icon" file size should be <= 20MB',
      );
    });
  });
});

const streamToBuffer = (stream: NodeJS.ReadableStream) => {
  return new Promise<Buffer>((resolve, reject) => {
    const buffers: Buffer[] = [];
    stream.on("data", (data) => buffers.push(data));
    stream.on("end", () => resolve(Buffer.concat(buffers)));
    stream.on("error", reject);
  });
};

const readZipContents = (
  zipEntry: yauzl.ZipFile,
): Promise<Map<any, Buffer>> => {
  const zipContentsMap = new Map();
  const streamToBufferPromises: Array<Promise<void>> = [];
  return new Promise((resolve, reject) => {
    zipEntry.on("entry", (entry) => {
      zipEntry.openReadStream(entry, (err, stream) => {
        if (err) {
          reject(err);
        }
        streamToBufferPromises.push(
          streamToBuffer(stream).then((buffer) => {
            zipContentsMap.set(entry.fileName, buffer);
          }),
        );
      });
    });
    zipEntry.on("end", () => {
      Promise.all(streamToBufferPromises).then(() => resolve(zipContentsMap));
    });
  });
};

const verifyPlugin = async (plugin: Buffer): Promise<void> => {
  const fromBuffer = (buffer: Buffer) =>
    new Promise<yauzl.ZipFile>((resolve, reject) => {
      yauzl.fromBuffer(buffer, (err, zipfile) => {
        if (err) {
          reject(err);
        }
        resolve(zipfile);
      });
    });
  const zipEntry = await fromBuffer(plugin);
  const zipContentsMap = await readZipContents(zipEntry);
  const contentZip = zipContentsMap.get("contents.zip");
  expect(contentZip).toBeDefined();
  if (contentZip === undefined) {
    throw new Error("contentZip is undefined");
  }
  const verifier = crypto.createVerify("RSA-SHA1");
  verifier.update(contentZip);

  const publicKey = zipContentsMap.get("PUBKEY");
  if (publicKey === undefined) {
    throw new Error("PUBKEY is undefined");
  }
  const signature = zipContentsMap.get("SIGNATURE");
  if (signature === undefined) {
    throw new Error("SIGNATURE is undefined");
  }
  expect(verifier.verify(derToPem(publicKey), signature)).toBe(true);
};

const derToPem = (der: Buffer) => {
  const key = new RSA(der, "pkcs8-public-der");
  return key.exportKey("pkcs1-public-pem");
};
