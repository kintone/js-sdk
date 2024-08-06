import assert from "assert";
import * as prompt from "../qa/prompt";
import { validateForDescription, validateForName } from "../qa/validator";
import { getDefaultName, runPrompt } from "../qa";
import type { BoundMessage } from "../messages";
import { getBoundMessage } from "../messages";

describe("qa", () => {
  describe("prompt", () => {
    describe("name.en", () => {
      it("should be set the default value of name.en based on the passed directory", () => {
        assert.equal(getDefaultName("foo/bar/dist"), "dist");
      });
      it("should be able to validate name.en", () => {
        assert(validateForName("hoge"));
        assert(validateForName("a".repeat(64)));
        assert(!validateForName(""));
        assert(!validateForName("a".repeat(65)));
      });
    });
    describe("description.en", () => {
      it("should be able to validate description.en", () => {
        assert(validateForDescription("hoge"));
        assert(validateForDescription("a".repeat(200)));
        assert(!validateForDescription(""));
        assert(!validateForDescription("a".repeat(201)));
      });
    });
    describe("name.ja", () => {
      beforeEach(() => {
        jest.spyOn(prompt, "promptForName").mockResolvedValue("pass");
        jest.spyOn(prompt, "promptForDescription").mockResolvedValue("pass");
        jest.spyOn(prompt, "promptForOptionalName").mockResolvedValue("pass");
        jest
          .spyOn(prompt, "promptForOptionalDescription")
          .mockResolvedValue("pass");
        jest.spyOn(prompt, "promptForHomepage").mockResolvedValue("pass");
        jest.spyOn(prompt, "promptForSupportLang").mockResolvedValue(true);
        jest.spyOn(prompt, "promptForSupportMobile").mockResolvedValue(true);
        jest
          .spyOn(prompt, "promptForEnablePluginUploader")
          .mockResolvedValue(true);
      });
      it("should be enabled only in answer.ja is true", async () => {
        jest
          .spyOn(prompt, "promptForSupportLang")
          .mockImplementation(
            async (m: BoundMessage, supportLang: prompt.SupportLang) => {
              return supportLang === "Ja";
            },
          );
        const result1 = await runPrompt(
          getBoundMessage("ja"),
          "foo/bar/dist",
          "ja",
        );
        assert.notEqual(result1.name.ja, undefined);
        assert.notEqual(result1.description.ja, undefined);
        assert.notEqual(result1.homepage_url, undefined);
        assert.notEqual(result1.homepage_url?.ja, undefined);

        jest
          .spyOn(prompt, "promptForSupportLang")
          .mockImplementation(
            async (m: BoundMessage, supportLang: prompt.SupportLang) => {
              return !(supportLang === "Ja");
            },
          );
        const result2 = await runPrompt(
          getBoundMessage("en"),
          "foo/bar/dist",
          "en",
        );
        assert.equal(result2.name.ja, undefined);
        assert.equal(result2.description.ja, undefined);
      });

      it("should be enabled only in answer.zh is true", async () => {
        jest
          .spyOn(prompt, "promptForSupportLang")
          .mockImplementation(
            async (m: BoundMessage, supportLang: prompt.SupportLang) => {
              return supportLang === "Zh";
            },
          );
        const result1 = await runPrompt(
          getBoundMessage("ja"),
          "foo/bar/dist",
          "ja",
        );
        assert.notEqual(result1.name.zh, undefined);
        assert.notEqual(result1.description.zh, undefined);

        jest
          .spyOn(prompt, "promptForSupportLang")
          .mockImplementation(
            async (m: BoundMessage, supportLang: prompt.SupportLang) => {
              return !(supportLang === "Zh");
            },
          );
        const result2 = await runPrompt(
          getBoundMessage("en"),
          "foo/bar/dist",
          "en",
        );
        assert.equal(result2.name.zh, undefined);
        assert.equal(result2.description.zh, undefined);
      });

      it("should be enabled only in answer.es is true", async () => {
        jest
          .spyOn(prompt, "promptForSupportLang")
          .mockImplementation(
            async (m: BoundMessage, supportLang: prompt.SupportLang) => {
              return supportLang === "Es";
            },
          );
        const result1 = await runPrompt(
          getBoundMessage("ja"),
          "foo/bar/dist",
          "ja",
        );
        assert.notEqual(result1.name.es, undefined);
        assert.notEqual(result1.description.es, undefined);

        jest
          .spyOn(prompt, "promptForSupportLang")
          .mockImplementation(
            async (m: BoundMessage, supportLang: prompt.SupportLang) => {
              return !(supportLang === "Es");
            },
          );
        const result2 = await runPrompt(
          getBoundMessage("en"),
          "foo/bar/dist",
          "en",
        );
        assert.equal(result2.name.es, undefined);
        assert.equal(result2.description.es, undefined);
      });
    });
  });
});
