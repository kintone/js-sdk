"use strict";

const assert = require("assert");
const validate = require("../src/validate-https-url");

describe("validate-https-url", () => {
  context("valid", () => {
    [
      "https://example.com/path/to?foo=bar&baz=piyo#hash",
      "https://localhost:8080",
      "https://127.0.0.1:8000",
      "https://user:pass@example.com/"
    ].forEach(url => {
      it(url, () => {
        assert(validate(url));
      });
    });
  });

  context("invalid", () => {
    [
      "http://example.com",
      "ftp://example.com",
      "://example.com",
      "//example.com",
      "/path/to/foo",
      "./path/to/foo",
      "path/to/foo"
    ].forEach(url => {
      it(url, () => {
        assert(!validate(url));
      });
    });
  });

  context("`allowHttp`", () => {
    context("valid", () => {
      ["https://example.com", "http://example.com"].forEach(url => {
        it(url, () => {
          assert(validate(url, true));
        });
      });
    });

    context("invalid", () => {
      [
        "ftp://example.com",
        "://example.com",
        "//example.com",
        "/path/to/foo",
        "./path/to/foo",
        "path/to/foo"
      ].forEach(url => {
        it(url, () => {
          assert(!validate(url));
        });
      });
    });
  });
});
