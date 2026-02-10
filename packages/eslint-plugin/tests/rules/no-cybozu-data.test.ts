import { RuleTester } from "@typescript-eslint/rule-tester";
import { rule } from "../../src/rules/no-cybozu-data.js";

const ruleTester = new RuleTester();
ruleTester.run("no-cybozu-data", rule, {
  valid: [`const foo = 123;`, `const foo = foo.bar;`],
  invalid: [
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
  ],
});
