import assert from "assert";
import checkRequiredProperties from "../check-required-properties";

describe("checkRequiredProperties", () => {
  it(`should return errors when missing the required properties`, () => {
    const source: Record<string, any> = {
      name: {
        en: "名前",
      },
      description: {
        en: "desc",
      },
      homepage_url: {},
      icon: "image/icon.png",
    };

    const jsonSchema = {
      items: [
        {
          homepage_url: {
            properties: ["en"],
          },
        },
        "icon",
        "none-exist-property",
      ],
      warn: true,
    };
    assert.deepStrictEqual(checkRequiredProperties(source, jsonSchema), [
      `Property "homepage_url.en" is missing.`,
      `Property "none-exist-property" is missing.`,
    ]);
  });

  it(`should return the correct error message when the "warn" setting is false`, () => {
    const source: Record<string, any> = {
      name: {
        en: "名前",
      },
      description: {
        en: "desc",
      },
      homepage_url: {},
    };

    const jsonSchema = {
      items: [
        {
          homepage_url: {
            properties: ["en"],
          },
        },
      ],
      warn: false,
    };
    assert.deepStrictEqual(checkRequiredProperties(source, jsonSchema), [
      `Property "homepage_url.en" is required.`,
    ]);
  });
});
