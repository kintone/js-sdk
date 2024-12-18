import { RuleTester } from "@typescript-eslint/rule-tester";
import { rule } from "../../src/rules/only-allowed-js-api.js";
import type { ManifestV2JsonObject } from "../../src/utils/manifest.js";

const manifest: ManifestV2JsonObject = {
  manifest_version: 2,
  version: "1",
  name: {
    en: "my-plugin",
  },
  description: {
    en: "Just another plugin",
  },
  icon: "./icon.svg",
  permissions: {
    js_api: ["kintone.api"],
  },
};

const ruleTester = new RuleTester({
  settings: {
    "@kintone/eslint-plugin": {
      manifest: manifest,
    },
  },
});

ruleTester.run("permissions", rule, {
  valid: [
    // not function call
    "const x = 1;",
    "const fn = ()=> {};",
    "function fn (){}",

    // not function call (kintone api)
    "kintone.api",
    "kintone.app.getId",

    // function call but not kintone js api
    "fn(123)",
    "fetch(123)",
    "obj.child.fn(123)",

    "kintone(123)",
    "kintone.foo.bar(123)",

    // allowed kintone js api
    "kintone.api(123)",
  ],
  invalid: [
    // kintone js api not listed in permissions.js_api in manifest
    {
      code: "kintone.app.getId(123)",
      errors: [
        {
          messageId: "onlyUseAllowedJsApi",
        },
      ],
    },
  ],
});
