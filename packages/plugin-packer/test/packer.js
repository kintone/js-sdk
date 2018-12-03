"use strict";

const assert = require("assert");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const RSA = require("node-rsa");
const yauzl = require("yauzl");

const { readZipContentsNames } = require("./helper/zip");

const packer = require("../src/");

const privateKeyPath = path.join(__dirname, "fixtures", "private.ppk");
const contentsZipPath = path.join(__dirname, "fixtures", "contents.zip");
const invalidMaxFileSizeContentsZipPath = path.join(
  __dirname,
  "fixtures",
  "invalid-maxFileSize-contents.zip"
);

describe("packer", () => {
  it("is a function", () => {
    assert(typeof packer === "function");
  });

  context("without privateKey", () => {
    let output;
    beforeEach(() => {
      const contentsZip = fs.readFileSync(contentsZipPath);
      return packer(contentsZip).then(o => {
        output = o;
      });
    });

    it("the id is generated", () => {
      assert(typeof output.id === "string");
      assert(output.id.length === 32);
    });

    it("the privateKey is generated", () => {
      assert(typeof output.privateKey === "string");
      assert(/^-----BEGIN RSA PRIVATE KEY-----/.test(output.privateKey));
    });

    it("the zip contains 3 files", done => {
      readZipContentsNames(output.plugin).then(files => {
        assert.deepStrictEqual(
          files.sort(),
          ["contents.zip", "PUBKEY", "SIGNATURE"].sort()
        );
        done();
      });
    });

    it("the zip passes signature verification", () => {
      return verifyPlugin(output.plugin);
    });
  });

  context("with privateKey", () => {
    let privateKey;
    let output;
    beforeEach(() => {
      const contentsZip = fs.readFileSync(contentsZipPath);
      privateKey = fs.readFileSync(privateKeyPath, "utf8");
      return packer(contentsZip, privateKey).then(o => {
        output = o;
      });
    });

    it("the id is expected", () => {
      assert(output.id === "ldmhlgpmfpfhpgimbjlblmfkmcnbjnnj");
    });

    it("the privateKey is same", () => {
      assert(output.privateKey === privateKey);
    });

    it("the zip passes signature verification", () => {
      return verifyPlugin(output.plugin);
    });
  });

  context("invalid contents.zip", () => {
    it("throws an error if the contents.zip is invalid", done => {
      const contentsZip = fs.readFileSync(invalidMaxFileSizeContentsZipPath);
      packer(contentsZip).catch(error => {
        assert(
          error.message.indexOf('".icon" file size should be <= 512KB') !== -1
        );
        done();
      });
    });
  });
});

function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const buffers = [];
    stream.on("data", data => buffers.push(data));
    stream.on("end", () => resolve(Buffer.concat(buffers)));
    stream.on("error", reject);
  });
}

function readZipContents(zipEntry) {
  const zipContentsMap = new Map();
  const streamToBufferPromises = [];
  return new Promise((resolve, reject) => {
    zipEntry.on("entry", entry => {
      zipEntry.openReadStream(entry, (err, stream) => {
        if (err) reject(err);
        streamToBufferPromises.push(
          streamToBuffer(stream).then(buffer => {
            zipContentsMap.set(entry.fileName, buffer);
          })
        );
      });
    });
    zipEntry.on("end", () => {
      Promise.all(streamToBufferPromises).then(() => resolve(zipContentsMap));
    });
  });
}

function verifyPlugin(plugin) {
  return new Promise((resolve, reject) => {
    yauzl.fromBuffer(plugin, (err, zipEntry) => {
      if (err) reject(err);
      readZipContents(zipEntry).then(zipContentsMap => {
        const verifier = crypto.createVerify("RSA-SHA1");
        verifier.update(zipContentsMap.get("contents.zip"));
        const publicKey = zipContentsMap.get("PUBKEY");
        const signature = zipContentsMap.get("SIGNATURE");
        assert(verifier.verify(derToPem(publicKey), signature));
        resolve();
      });
    });
  });
}

function derToPem(der) {
  const key = new RSA(der, "pkcs8-public-der");
  return key.exportKey("pkcs1-public-pem");
}
