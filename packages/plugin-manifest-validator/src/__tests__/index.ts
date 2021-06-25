"use strict";

import assert from "assert";
import validator from "../index";

// 20MB
const MAX_FILE_SIZE = 20 * 1024 * 1024;

describe("validator", () => {
  it("is a function", () => {
    assert(typeof validator === "function");
  });

  it("minimal valid JSON", () => {
    assert.deepStrictEqual(validator(json({})), { valid: true, errors: null });
  });

  it("missing property", () => {
    const manifestJson = json({});
    delete manifestJson.version;
    assert.deepStrictEqual(validator(manifestJson), {
      valid: false,
      errors: [
        {
          dataPath: "",
          keyword: "required",
          message: "should have required property 'version'",
          params: {
            missingProperty: "version",
          },
          schemaPath: "#/required",
        },
      ],
    });
  });

  it.each([
    [
      "0.1.2",
      {
        valid: true,
        errors: null,
      },
    ],
    [
      "0.1",
      {
        valid: true,
        errors: null,
      },
    ],
    [
      "0",
      {
        valid: true,
        errors: null,
      },
    ],
    [
      0,
      {
        valid: true,
        errors: null,
      },
    ],
    [
      0.1,
      {
        valid: false,
        errors: [
          {
            dataPath: "/version",
            keyword: "type",
            message: "should be integer",
            params: { type: "integer" },
            schemaPath: "#/properties/version/oneOf/0/type",
          },
          {
            dataPath: "/version",
            keyword: "type",
            message: "should be string",
            params: { type: "string" },
            schemaPath: "#/properties/version/oneOf/1/type",
          },
          {
            dataPath: "/version",
            keyword: "oneOf",
            message: "should match exactly one schema in oneOf",
            params: { passingSchemas: null },
            schemaPath: "#/properties/version/oneOf",
          },
        ],
      },
    ],
    [
      -1,
      {
        valid: false,
        errors: [
          {
            dataPath: "/version",
            keyword: "minimum",
            message: "should be >= 0",
            params: { comparison: ">=", limit: 0 },
            schemaPath: "#/properties/version/oneOf/0/minimum",
          },
          {
            dataPath: "/version",
            keyword: "type",
            message: "should be string",
            params: { type: "string" },
            schemaPath: "#/properties/version/oneOf/1/type",
          },
          {
            dataPath: "/version",
            keyword: "oneOf",
            message: "should match exactly one schema in oneOf",
            params: { passingSchemas: null },
            schemaPath: "#/properties/version/oneOf",
          },
        ],
      },
    ],
  ])("version string: %s", (version, expected) => {
    assert.deepStrictEqual(validator(json({ version })), expected);
  });

  it("valid version string 0.1.2", () => {
    assert.deepStrictEqual(validator(json({ version: "0.1.2" })), {
      valid: true,
      errors: null,
    });
  });

  it("valid version string: omit minor version", () => {
    assert.deepStrictEqual(validator(json({ version: "0.1" })), {
      valid: true,
      errors: null,
    });
  });

  it("valid version string: omit patch version", () => {
    assert.deepStrictEqual(validator(json({ version: "0" })), {
      valid: true,
      errors: null,
    });
  });

  it("invalid enum value", () => {
    assert.deepStrictEqual(validator(json({ type: "FOO" })), {
      valid: false,
      errors: [
        {
          dataPath: "/type",
          keyword: "enum",
          message: "should be equal to one of the allowed values",
          params: {
            allowedValues: ["APP"],
          },
          schemaPath: "#/properties/type/enum",
        },
      ],
    });
  });

  it("no English description", () => {
    assert.deepStrictEqual(validator(json({ description: {} })), {
      valid: false,
      errors: [
        {
          dataPath: "/description",
          keyword: "required",
          message: "should have required property 'en'",
          params: {
            missingProperty: "en",
          },
          schemaPath: "#/properties/description/required",
        },
      ],
    });
  });

  it("returns combined errors", () => {
    const actual = validator(
      json({
        manifest_version: "a",
        version: -1,
      })
    );
    const invalidManifestVersion = validator(
      json({
        manifest_version: "a",
      })
    );
    const invalidVersion = validator(
      json({
        version: -1,
      })
    );
    expect(actual.valid).toBe(false);
    expect(actual.errors).toStrictEqual(
      expect.arrayContaining([
        ...(invalidManifestVersion.errors ?? []),
        ...(invalidVersion.errors ?? []),
      ])
    );
  });

  it("relative path is invalid for `http-url`", () => {
    const actual = validator(json({ homepage_url: { en: "foo/bar.html" } }));
    assert(actual.valid === false);
    assert(actual.errors?.length === 1);
    assert.deepStrictEqual(actual.errors[0].params, { format: "http-url" });
  });

  it('"http:" is invalid for `https-url`', () => {
    const actual = validator(
      json({
        desktop: {
          js: ["http://example.com/icon.png"],
        },
      }),
      {
        relativePath: (str) => !/^https?:/.test(str),
      }
    );
    assert(actual.valid === false);
    assert(actual.errors?.length === 3);
    assert(actual.errors[0].keyword === "format");
    assert(actual.errors[1].keyword === "format");
    assert(actual.errors[2].keyword === "anyOf");
  });

  describe("maxFileSize", () => {
    it("valid file size", () => {
      let called = 0;
      const actual = validator(json({}), {
        maxFileSize(maxFileSizeInBytes, path) {
          assert(maxFileSizeInBytes === MAX_FILE_SIZE);
          assert(path === "image/icon.png");
          called++;
          return true;
        },
      });
      assert(called === 1);
      assert(actual.valid === true);
    });

    it("invalid icon file size", () => {
      const actual = validator(json({}), {
        maxFileSize(maxFileSizeInBytes, path) {
          return false;
        },
      });
      assert(actual.valid === false);
      assert(actual.errors?.length === 1);
      assert.deepStrictEqual(actual.errors[0], {
        dataPath: "/icon",
        keyword: "maxFileSize",
        message: "file size should be <= 20MB",
        params: {
          limit: MAX_FILE_SIZE,
        },
        schemaPath: "#/properties/icon/maxFileSize",
      });
    });

    it("invalid js file size", () => {
      const actual = validator(
        json({
          desktop: {
            js: ["./foo.js"],
          },
        }),
        {
          maxFileSize(maxFileSizeInBytes, path) {
            return path.indexOf("foo.js") === -1;
          },
        }
      );
      assert(actual.valid === false);
      assert(actual.errors?.length === 3);
      assert.deepStrictEqual(actual.errors[1], {
        dataPath: "/desktop/js/0",
        keyword: "maxFileSize",
        message: "file size should be <= 20MB",
        params: {
          limit: MAX_FILE_SIZE,
        },
        schemaPath: "#/definitions/resources/items/anyOf/1/maxFileSize",
      });
    });

    it("invalid css file size", () => {
      const actual = validator(
        json({
          desktop: {
            css: ["./foo.css"],
          },
        }),
        {
          maxFileSize(maxFileSizeInBytes, path) {
            return path.indexOf("foo.css") === -1;
          },
        }
      );
      assert(actual.valid === false);
      assert(actual.errors?.length === 3);
      assert.deepStrictEqual(actual.errors[1], {
        dataPath: "/desktop/css/0",
        keyword: "maxFileSize",
        message: "file size should be <= 20MB",
        params: {
          limit: MAX_FILE_SIZE,
        },
        schemaPath: "#/definitions/resources/items/anyOf/1/maxFileSize",
      });
    });

    it("mobile", () => {
      const actual = validator(
        json({
          mobile: {
            js: ["https://example.com/foo.js"],
            css: ["https://example.com/foo.css"],
          },
        })
      );
      assert(actual.valid === true);
      assert(actual.errors === null);
    });
  });
  describe("maxItems", () => {
    it("exceed the max item counts", () => {
      const urls = [...new Array(100)].map(
        (_, i) => `https://example.com/${i}.js`
      );
      const actual = validator(
        json({
          desktop: {
            js: urls,
          },
        })
      );
      assert.strictEqual(actual.valid, false);
      assert.strictEqual(actual.errors?.length, 1);
      assert.deepStrictEqual(actual.errors[0], {
        dataPath: "/desktop/js",
        keyword: "maxItems",
        message: "should NOT have more than 30 items",
        params: {
          limit: 30,
        },
        schemaPath: "#/definitions/resources/maxItems",
      });
    });
  });
});

/**
 * Generate minimum valid manifest.json and overwrite with source
 *
 * @param {Object=} source
 * @return {!Object}
 */
function json(source: Record<string, any>): { [s: string]: any } {
  return Object.assign(
    {
      manifest_version: 1,
      version: 1,
      type: "APP",
      name: {
        en: "sample plugin",
      },
      icon: "image/icon.png",
    },
    source
  );
}
