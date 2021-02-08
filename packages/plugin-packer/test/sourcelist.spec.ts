import { sourceList } from "../dist/sourcelist";

describe("sourcelist", () => {
  let manifest;
  beforeEach(() => {
    manifest = {
      icon: "image/icon.png",
      desktop: {
        js: ["js/desktop.js", "js/lib.js"],
        css: ["css/desktop.css", "css/lib.css"],
      },
      mobile: {
        js: ["js/mobile.js"],
      },
      config: {
        js: ["js/config.js"],
        css: ["css/config.css"],
        html: "html/config.html",
      },
    };
  });
  it("should return a file list including the manifest", () => {
    expect(sourceList(manifest)).toStrictEqual([
      "js/desktop.js",
      "js/lib.js",
      "css/desktop.css",
      "css/lib.css",
      "js/mobile.js",
      "js/config.js",
      "css/config.css",
      "html/config.html",
      "manifest.json",
      "image/icon.png",
    ]);
  });
  it("should filter http(s) path", () => {
    manifest.desktop.js.push("https://example.com/foo.js");
    manifest.desktop.css.push("https://example.com/foo.css");
    manifest.mobile.js.push("https://example.com/foo.js");
    manifest.config.js.push("https://example.com/foo.js");
    manifest.config.css.push("https://example.com/foo.css");
    // This file should be added the list.
    manifest.desktop.js.push("js/external.js");
    expect(sourceList(manifest)).toStrictEqual([
      "js/desktop.js",
      "js/lib.js",
      "js/external.js",
      "css/desktop.css",
      "css/lib.css",
      "js/mobile.js",
      "js/config.js",
      "css/config.css",
      "html/config.html",
      "manifest.json",
      "image/icon.png",
    ]);
  });
  it("should make the file list unique", () => {
    manifest.desktop.js.push("js/desktop.js");
    manifest.desktop.css.push("css/desktop.css");
    manifest.mobile.js.push("js/mobile.js");
    manifest.config.js.push("js/config.js");
    manifest.config.css.push("css/config.css");
    // This file should be added the list.
    manifest.desktop.js.push("js/external.js");
    expect(sourceList(manifest)).toStrictEqual([
      "js/desktop.js",
      "js/lib.js",
      "js/external.js",
      "css/desktop.css",
      "css/lib.css",
      "js/mobile.js",
      "js/config.js",
      "css/config.css",
      "html/config.html",
      "manifest.json",
      "image/icon.png",
    ]);
  });
});
