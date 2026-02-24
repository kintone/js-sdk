import { RuleTester } from "@typescript-eslint/rule-tester";
import { rule } from "../../src/rules/no-cybozu-data.js";

const ruleTester = new RuleTester();
ruleTester.run("no-cybozu-data", rule, {
  valid: [`const foo = 123;`, `const foo = foo.bar;`],
  invalid: [
    // cybozu.data
    {
      code: `const foo = cybozu.data`,
      errors: [{ messageId: "forbiddenCybozuDataAccess" }],
    },
    {
      code: `const foo = cybozu.data.abc`,
      errors: [{ messageId: "forbiddenCybozuDataAccess" }],
    },
    {
      code: `const foo = cybozu.data['abc']`,
      errors: [{ messageId: "forbiddenCybozuDataAccess" }],
    },
    {
      code: `cybozu.data = 123`,
      errors: [{ messageId: "forbiddenCybozuDataAccess" }],
    },
    {
      code: `cybozu.data.abc = 123`,
      errors: [{ messageId: "forbiddenCybozuDataAccess" }],
    },
    // cybozu["data"]
    {
      code: `const foo = cybozu["data"]`,
      errors: [{ messageId: "forbiddenCybozuDataAccess" }],
    },
    {
      code: `const foo = cybozu["data"].abc`,
      errors: [{ messageId: "forbiddenCybozuDataAccess" }],
    },
    // cybozu?.data (optional chaining)
    {
      code: `const foo = cybozu?.data`,
      errors: [{ messageId: "forbiddenCybozuDataAccess" }],
    },
    {
      code: `const foo = cybozu?.data?.abc`,
      errors: [{ messageId: "forbiddenCybozuDataAccess" }],
    },
    // cybozu?.["data"] (optional chaining with computed property)
    {
      code: `const foo = cybozu?.["data"]`,
      errors: [{ messageId: "forbiddenCybozuDataAccess" }],
    },
    // window.cybozu.data
    {
      code: `const foo = window.cybozu.data`,
      errors: [{ messageId: "forbiddenCybozuDataAccess" }],
    },
    {
      code: `const foo = window.cybozu.data.abc`,
      errors: [{ messageId: "forbiddenCybozuDataAccess" }],
    },
    // window["cybozu"]["data"]
    {
      code: `const foo = window["cybozu"]["data"]`,
      errors: [{ messageId: "forbiddenCybozuDataAccess" }],
    },
    // window.cybozu["data"]
    {
      code: `const foo = window.cybozu["data"]`,
      errors: [{ messageId: "forbiddenCybozuDataAccess" }],
    },
    // globalThis.cybozu.data
    {
      code: `const foo = globalThis.cybozu.data`,
      errors: [{ messageId: "forbiddenCybozuDataAccess" }],
    },
    {
      code: `const foo = globalThis.cybozu.data.abc`,
      errors: [{ messageId: "forbiddenCybozuDataAccess" }],
    },
    // globalThis["cybozu"]["data"]
    {
      code: `const foo = globalThis["cybozu"]["data"]`,
      errors: [{ messageId: "forbiddenCybozuDataAccess" }],
    },
    // globalThis.cybozu["data"]
    {
      code: `const foo = globalThis.cybozu["data"]`,
      errors: [{ messageId: "forbiddenCybozuDataAccess" }],
    },
    // globalThis.window.cybozu.data
    {
      code: `const foo = globalThis.window.cybozu.data`,
      errors: [{ messageId: "forbiddenCybozuDataAccess" }],
    },
    {
      code: `const foo = globalThis.window.cybozu.data.abc`,
      errors: [{ messageId: "forbiddenCybozuDataAccess" }],
    },
    // globalThis["window"]["cybozu"]["data"]
    {
      code: `const foo = globalThis["window"]["cybozu"]["data"]`,
      errors: [{ messageId: "forbiddenCybozuDataAccess" }],
    },
    // globalThis.window.cybozu["data"]
    {
      code: `const foo = globalThis.window.cybozu["data"]`,
      errors: [{ messageId: "forbiddenCybozuDataAccess" }],
    },
  ],
});
