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
    assert.deepStrictEqual(validator(json({})), {
      valid: true,
      errors: null,
      warnings: null,
    });
  });

  it("missing property", () => {
    const manifestJson = json({});
    delete manifestJson.version;
    assert.deepStrictEqual(validator(manifestJson), {
      valid: false,
      errors: [
        {
          instancePath: "",
          keyword: "required",
          message: "must have required property 'version'",
          params: {
            missingProperty: "version",
          },
          schemaPath: "#/required",
        },
      ],
      warnings: null,
    });
  });

  describe("$schema", () => {
    it("valid", () => {
      assert.deepStrictEqual(
        validator(json({ $schema: "https://secure-url.com/schema.json" })),
        { valid: true, errors: null },
      );
      assert.deepStrictEqual(
        validator(json({ $schema: "http://unsecure-url.com/schema.json" })),
        { valid: true, errors: null },
      );
    });

    it("invalid", () => {
      assert.deepStrictEqual(
        validator(json({ $schema: "./local-file-path.ext" })),
        {
          valid: false,
          errors: [
            {
              instancePath: "/$schema",
              keyword: "format",
              message: `must match format "uri"`,
              params: {
                format: "uri",
              },
              schemaPath: "#/properties/%24schema/format",
            },
          ],
        },
      );
    });
  });

  describe("version", () => {
    it.each(
      // prettier-ignore
      [
        "0",
        "0.1",
        "0.1.2",
        "1.0.0",
        "2.0.3",
        0,
        10
      ],
    )("valid version: %s", (version) => {
      expect(validator(json({ version }))).toStrictEqual({
        valid: true,
        errors: null,
        warnings: null,
      });
    });

    it.each([
      {
        description: "number is float",
        version: 0.1,
        expected: {
          valid: false,
          errors: [
            {
              instancePath: "/version",
              keyword: "type",
              message: "must be integer",
              params: { type: "integer" },
              schemaPath: "#/properties/version/oneOf/0/type",
            },
            {
              instancePath: "/version",
              keyword: "type",
              message: "must be string",
              params: { type: "string" },
              schemaPath: "#/properties/version/oneOf/1/type",
            },
            {
              instancePath: "/version",
              keyword: "oneOf",
              message: "must match exactly one schema in oneOf",
              params: { passingSchemas: null },
              schemaPath: "#/properties/version/oneOf",
            },
          ],
          warnings: null,
        },
      },
      {
        description: "number is out of range",
        version: -1,
        expected: {
          valid: false,
          errors: [
            {
              instancePath: "/version",
              keyword: "minimum",
              message: "must be >= 0",
              params: { comparison: ">=", limit: 0 },
              schemaPath: "#/properties/version/oneOf/0/minimum",
            },
            {
              instancePath: "/version",
              keyword: "type",
              message: "must be string",
              params: { type: "string" },
              schemaPath: "#/properties/version/oneOf/1/type",
            },
            {
              instancePath: "/version",
              keyword: "oneOf",
              message: "must match exactly one schema in oneOf",
              params: { passingSchemas: null },
              schemaPath: "#/properties/version/oneOf",
            },
          ],
          warnings: null,
        },
      },
    ])("invalid version: $description", ({ version, expected }) => {
      expect(validator(json({ version }))).toStrictEqual(expected);
    });
  });

  it("invalid enum value", () => {
    assert.deepStrictEqual(validator(json({ type: "FOO" })), {
      valid: false,
      errors: [
        {
          instancePath: "/type",
          keyword: "enum",
          message: "must be equal to one of the allowed values",
          params: {
            allowedValues: ["APP"],
          },
          schemaPath: "#/properties/type/enum",
        },
      ],
      warnings: null,
    });
  });

  it("no English description", () => {
    assert.deepStrictEqual(validator(json({ description: {} })), {
      valid: false,
      errors: [
        {
          instancePath: "/description",
          keyword: "required",
          message: "must have required property 'en'",
          params: {
            missingProperty: "en",
          },
          schemaPath: "#/properties/description/required",
        },
      ],
      warnings: null,
    });
  });

  it("returns combined errors", () => {
    const actual = validator(
      json({
        manifest_version: "a",
        version: -1,
      }),
    );
    const invalidManifestVersion = validator(
      json({
        manifest_version: "a",
      }),
    );
    const invalidVersion = validator(
      json({
        version: -1,
      }),
    );
    expect(actual.valid).toBe(false);
    expect(actual.errors).toStrictEqual(
      expect.arrayContaining([
        ...(invalidManifestVersion.errors ?? []),
        ...(invalidVersion.errors ?? []),
      ]),
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
      },
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
        maxFileSize: (maxFileSizeInBytes, path) => {
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
        maxFileSize: (maxFileSizeInBytes, path) => {
          return false;
        },
      });
      assert(actual.valid === false);
      assert(actual.errors?.length === 1);
      assert.deepStrictEqual(actual.errors[0], {
        instancePath: "/icon",
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
          maxFileSize: (maxFileSizeInBytes, path) => {
            return path.indexOf("foo.js") === -1;
          },
        },
      );
      assert(actual.valid === false);
      assert(actual.errors?.length === 3);
      assert.deepStrictEqual(actual.errors[1], {
        instancePath: "/desktop/js/0",
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
          maxFileSize: (maxFileSizeInBytes, path) => {
            return path.indexOf("foo.css") === -1;
          },
        },
      );
      assert(actual.valid === false);
      assert(actual.errors?.length === 3);
      assert.deepStrictEqual(actual.errors[1], {
        instancePath: "/desktop/css/0",
        keyword: "maxFileSize",
        message: "file size should be <= 20MB",
        params: {
          limit: MAX_FILE_SIZE,
        },
        schemaPath: "#/definitions/resources/items/anyOf/1/maxFileSize",
      });
    });

    it("should throw the custom message when there is one invalid file size and the custom message is specified", () => {
      const customMessage = "A custom message: invalid file size";
      const actual = validator(json({}), {
        maxFileSize: (maxFileSizeInBytes, path) => {
          return {
            valid: false,
            message: customMessage,
          };
        },
      });

      assert(actual.valid === false);
      assert(actual.errors?.length === 1);
      assert.deepStrictEqual(actual.errors[0], {
        instancePath: "/icon",
        keyword: "maxFileSize",
        message: customMessage,
        params: {
          limit: MAX_FILE_SIZE,
        },
        schemaPath: "#/properties/icon/maxFileSize",
      });
    });

    it("mobile", () => {
      const actual = validator(
        json({
          mobile: {
            js: ["https://example.com/foo.js"],
            css: ["https://example.com/foo.css"],
          },
        }),
      );
      assert(actual.valid === true);
      assert(actual.errors === null);
    });
  });

  describe("fileExists", () => {
    it("should return no error when all files exist", () => {
      const actual = validator(json({}), {
        fileExists: (path) => {
          return true;
        },
      });
      assert(actual.valid === true);
      assert(actual.errors?.length === undefined);
    });

    it.each`
      filePath                   | instancePath        | schemaPath
      ${"icon.png"}              | ${"/icon"}          | ${"#/properties/icon/fileExists"}
      ${"desktop/js/desktop.js"} | ${"/desktop/js/0"}  | ${"#/definitions/resources/items/anyOf/1/fileExists"}
      ${"desktop/css/style.css"} | ${"/desktop/css/0"} | ${"#/definitions/resources/items/anyOf/1/fileExists"}
      ${"config/config.html"}    | ${"/config/html"}   | ${"#/properties/config/properties/html/fileExists"}
      ${"config/js/config.js"}   | ${"/config/js/0"}   | ${"#/definitions/resources/items/anyOf/1/fileExists"}
      ${"config/css/style.css"}  | ${"/config/css/0"}  | ${"#/definitions/resources/items/anyOf/1/fileExists"}
      ${"mobile/js/mobile.js"}   | ${"/mobile/js/0"}   | ${"#/definitions/resources/items/anyOf/1/fileExists"}
      ${"mobile/css/style.css"}  | ${"/mobile/css/0"}  | ${"#/definitions/resources/items/anyOf/1/fileExists"}
    `(
      "should throw the default message when there is non-existent file at $instancePath",
      ({ filePath, instancePath, schemaPath }) => {
        const properties = instancePath.split("/");
        const path1 = properties[1];
        const path2 = properties[2];

        let source = {};
        switch (path2) {
          case undefined:
            // "icon" config
            source = { [path1]: filePath };
            break;
          case "html":
            source = { [path1]: { [path2]: filePath } };
            break;
          default:
            source = { [path1]: { [path2]: [filePath] } };
        }

        const actual = validator(json(source), {
          fileExists: (path) => {
            return path.indexOf(filePath) === -1;
          },
        });
        const error = actual.errors?.[1] ?? actual.errors?.[0];

        assert(actual.valid === false);
        assert.deepStrictEqual(error, {
          instancePath,
          keyword: "fileExists",
          message: `file should exist ("${filePath}")`,
          schemaPath,
        });
      },
    );

    it.each`
      filePath                   | instancePath        | schemaPath
      ${"icon.png"}              | ${"/icon"}          | ${"#/properties/icon/fileExists"}
      ${"desktop/js/desktop.js"} | ${"/desktop/js/0"}  | ${"#/definitions/resources/items/anyOf/1/fileExists"}
      ${"desktop/css/style.css"} | ${"/desktop/css/0"} | ${"#/definitions/resources/items/anyOf/1/fileExists"}
      ${"config/config.html"}    | ${"/config/html"}   | ${"#/properties/config/properties/html/fileExists"}
      ${"config/js/config.js"}   | ${"/config/js/0"}   | ${"#/definitions/resources/items/anyOf/1/fileExists"}
      ${"config/css/style.css"}  | ${"/config/css/0"}  | ${"#/definitions/resources/items/anyOf/1/fileExists"}
      ${"mobile/js/mobile.js"}   | ${"/mobile/js/0"}   | ${"#/definitions/resources/items/anyOf/1/fileExists"}
      ${"mobile/css/style.css"}  | ${"/mobile/css/0"}  | ${"#/definitions/resources/items/anyOf/1/fileExists"}
    `(
      `should throw the custom message when there is non-existent file at $instancePath and the custom message is specified`,
      ({ filePath, instancePath, schemaPath }) => {
        const properties = instancePath.split("/");
        const path1 = properties[1];
        const path2 = properties[2];

        let source = {};
        let errorIndex = 0;
        switch (path2) {
          case undefined:
            // "icon" config
            source = { [path1]: filePath };
            errorIndex = 0;
            break;
          case "html":
            source = { [path1]: { [path2]: filePath } };
            errorIndex = 0;
            break;
          default:
            source = { [path1]: { [path2]: [filePath] } };
            errorIndex = 1;
        }

        const customMessage = `Custom message: file should exist ("config/not_exist.js")`;
        const actual = validator(json(source), {
          fileExists: (path) => {
            return {
              valid: path.indexOf(filePath) === -1,
              message: customMessage,
            };
          },
        });

        const error = actual.errors?.[errorIndex];

        assert(actual.valid === false);
        assert.deepStrictEqual(error, {
          instancePath,
          keyword: "fileExists",
          message: customMessage,
          schemaPath,
        });
      },
    );
  });

  describe("maxItems", () => {
    it("exceed the max item counts", () => {
      const urls = [...new Array(100)].map(
        (_, i) => `https://example.com/${i}.js`,
      );
      const actual = validator(
        json({
          desktop: {
            js: urls,
          },
        }),
      );
      assert.strictEqual(actual.valid, false);
      assert.strictEqual(actual.errors?.length, 1);
      assert.deepStrictEqual(actual.errors[0], {
        instancePath: "/desktop/js",
        keyword: "maxItems",
        message: "must NOT have more than 30 items",
        params: {
          limit: 30,
        },
        schemaPath: "#/definitions/resources/maxItems",
      });
    });
  });

  describe("supported language", () => {
    it.each`
      languageCode | name        | description | homepage_url
      ${"ja"}      | ${"名前"}   | ${"説明"}   | ${"https://example.com/ja"}
      ${"en"}      | ${"name"}   | ${"desc"}   | ${"https://example.com/en"}
      ${"zh"}      | ${"名称"}   | ${"描述"}   | ${"https://example.com/zh"}
      ${"es"}      | ${"nombre"} | ${"desc"}   | ${"https://example.com/es"}
    `(
      `should return no error when the supported language is specified: $languageCode`,
      ({ languageCode, name, description, homepage_url }) => {
        const source: Record<string, any> = {
          name: {
            [languageCode]: name,
          },
          description: {
            [languageCode]: description,
          },
          homepage_url: {
            [languageCode]: homepage_url,
          },
        };
        if (languageCode !== "en") {
          source.name.en = "name";
          source.description.en = "desc";
          source.homepage_url.en = homepage_url;
        }

        assert.deepStrictEqual(validator(json(source)), {
          valid: true,
          errors: null,
          warnings: null,
        });
      },
    );
  });

  describe("validate required properties", () => {
    it.each`
      languageCode | name
      ${"ja"}      | ${"名前"}
      ${"en"}      | ${"name"}
      ${"zh"}      | ${"名称"}
      ${"es"}      | ${"nombre"}
    `(
      `should return warnings when the name of the language "$languageCode" is specified and homepage_url is missing`,
      ({ languageCode, name }) => {
        const source: Record<string, any> = {
          name: {
            [languageCode]: name,
          },
          description: {
            en: "desc",
          },
          homepage_url: {},
        };
        if (languageCode !== "en") {
          source.name.en = "name";
          source.homepage_url.en = "https://example.com";
        }

        assert.deepStrictEqual(validator(json(source)), {
          valid: true,
          errors: null,
          warnings: [
            { message: `Property "homepage_url.${languageCode}" is missing.` },
          ],
        });
      },
    );

    it.each`
      languageCode | homepage_url
      ${"ja"}      | ${"https://example.com/ja"}
      ${"zh"}      | ${"https://example.com/zh"}
      ${"es"}      | ${"https://example.com/es"}
    `(
      `should return errors when the homepage_url of the language "$languageCode" is specified and name is missing`,
      ({ languageCode, homepage_url }) => {
        const source: Record<string, any> = {
          name: {
            en: "name", // name.en is required property
          },
          description: {
            en: "desc",
          },
          homepage_url: {
            en: "https://example.com",
            [languageCode]: homepage_url,
          },
        };

        assert.deepStrictEqual(validator(json(source)), {
          valid: false,
          errors: [
            {
              instancePath: `/homepage_url/${languageCode}`,
              keyword: "requiredProperties",
              message: `Property "name.${languageCode}" is required.`,
              schemaPath: `#/properties/homepage_url/properties/${languageCode}/requiredProperties`,
            },
          ],
          warnings: null,
        });
      },
    );
  });
});

/**
 * Generate minimum valid manifest.json and overwrite with source
 *
 * @param {Object=} source
 * @return {!Object}
 */
const json = (source: Record<string, any>): { [s: string]: any } => {
  return Object.assign(
    {
      manifest_version: 1,
      version: 1,
      type: "APP",
      name: {
        en: "sample plugin",
      },
      icon: "image/icon.png",
      homepage_url: {
        en: "https://example.com",
      },
    },
    source,
  );
};
