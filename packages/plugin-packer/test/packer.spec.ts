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
  "invalid-maxFileSize-contents.zip"
);

describe("packer", () => {
  it("is a function", () => {
    expect(typeof packer).toBe("function");
  });

  describe("without privateKey", () => {
    let output;
    beforeEach(() => {
      const contentsZip = fs.readFileSync(contentsZipPath);
      return packer(contentsZip).then((o) => {
        output = o;
      });
    });

    it("the id is generated", () => {
      expect(typeof output.id).toBe("string");
      expect(output.id.length).toBe(32);
    });

    it("the privateKey is generated", () => {
      expect(typeof output.privateKey).toBe("string");
      expect(/^-----BEGIN RSA PRIVATE KEY-----/.test(output.privateKey)).toBe(
        true
      );
    });

    it("the zip contains 3 files", (done) => {
      readZipContentsNames(output.plugin).then((files) => {
        expect(files.sort()).toStrictEqual(
          ["contents.zip", "PUBKEY", "SIGNATURE"].sort()
        );
        done();
      });
    });

    it("the zip passes signature verification", () => {
      return verifyPlugin(output.plugin);
    });
  });

  describe("with privateKey", () => {
    let privateKey;
    let output;
    beforeEach(() => {
      const contentsZip = fs.readFileSync(contentsZipPath);
      privateKey = fs.readFileSync(privateKeyPath, "utf8");
      return packer(contentsZip, privateKey).then((o) => {
        output = o;
      });
    });

    it("the id is expected", () => {
      expect(output.id).toBe("ldmhlgpmfpfhpgimbjlblmfkmcnbjnnj");
    });

    it("the privateKey is same", () => {
      expect(output.privateKey).toBe(privateKey);
    });

    it("the zip passes signature verification", () => {
      return verifyPlugin(output.plugin);
    });
  });

  describe("invalid contents.zip", () => {
    it("throws an error if the contents.zip is invalid", (done) => {
      const contentsZip = fs.readFileSync(invalidMaxFileSizeContentsZipPath);
      packer(contentsZip).catch((error) => {
        expect(error.message).toBe('"/icon" file size should be <= 20MB');
        done();
      });
    });
  });
});

const streamToBuffer = (stream) => {
  return new Promise((resolve, reject) => {
    const buffers = [];
    stream.on("data", (data) => buffers.push(data));
    stream.on("end", () => resolve(Buffer.concat(buffers)));
    stream.on("error", reject);
  });
};

const readZipContents = (zipEntry): Promise<Map<any, Buffer>> => {
  const zipContentsMap = new Map();
  const streamToBufferPromises = [];
  return new Promise((resolve, reject) => {
    zipEntry.on("entry", (entry) => {
      zipEntry.openReadStream(entry, (err, stream) => {
        if (err) {
          reject(err);
        }
        streamToBufferPromises.push(
          streamToBuffer(stream).then((buffer) => {
            zipContentsMap.set(entry.fileName, buffer);
          })
        );
      });
    });
    zipEntry.on("end", () => {
      Promise.all(streamToBufferPromises).then(() => resolve(zipContentsMap));
    });
  });
};

const verifyPlugin = (plugin): Promise<void> => {
  return new Promise((resolve, reject) => {
    yauzl.fromBuffer(plugin, (err, zipEntry) => {
      if (err) {
        reject(err);
      }
      readZipContents(zipEntry).then((zipContentsMap) => {
        const verifier = crypto.createVerify("RSA-SHA1");
        verifier.update(zipContentsMap.get("contents.zip"));
        const publicKey = zipContentsMap.get("PUBKEY");
        const signature = zipContentsMap.get("SIGNATURE");
        expect(verifier.verify(derToPem(publicKey), signature)).toBe(true);
        resolve();
      });
    });
  });
};

const derToPem = (der) => {
  const key = new RSA(der, "pkcs8-public-der");
  return key.exportKey("pkcs1-public-pem");
};
