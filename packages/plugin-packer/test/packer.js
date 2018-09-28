"use strict";

const assert = require("assert");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const AdmZip = require("adm-zip");
const RSA = require("node-rsa");

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

    it("the zip contains 3 files", () => {
      const zip = new AdmZip(output.plugin);
      const fileNames = zip
        .getEntries()
        .map(entry => entry.entryName)
        .sort();
      assert.deepStrictEqual(
        fileNames,
        ["contents.zip", "PUBKEY", "SIGNATURE"].sort()
      );
    });

    it("the zip passes signature verification", () => {
      verifyPlugin(output.plugin);
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
      verifyPlugin(output.plugin);
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

function verifyPlugin(plugin) {
  const zip = new AdmZip(plugin);
  const verifier = crypto.createVerify("RSA-SHA1");
  verifier.update(zip.readFile(zip.getEntry("contents.zip")));
  const publicKey = zip.readFile(zip.getEntry("PUBKEY"));
  const signature = zip.readFile(zip.getEntry("SIGNATURE"));
  assert(verifier.verify(derToPem(publicKey), signature));
}

function derToPem(der) {
  const key = new RSA(der, "pkcs8-public-der");
  return key.exportKey("pkcs1-public-pem");
}
