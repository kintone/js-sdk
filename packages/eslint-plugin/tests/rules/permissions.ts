import { RuleTester } from "@typescript-eslint/rule-tester";
import { rule } from "../../src/rules/permissions.js";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ["*.ts*"],
      },
      tsconfigRootDir: path.join(__dirname, "../", "../"),
    },
  },
});

ruleTester.run("permissions", rule, {
  valid: [
    // not functions
    "const x = 1;",

    // functions without parameters (inferred)
    "const fn = ()=> {};",
    "const fn = ()=> undefined;",
    "const fn = ()=> null;",

    // receive object
    "const fn = (params: {param1: string, param2: string})=> {};",
    "const fn = ({param1, param2}: {param1: string, param2: string})=> {};",
    "const fn = ({param1, ...rest}: {param1: string, param2: string})=> {};",

    // receive object (Generics)
    "const fn = <T extends number>(params: T | number) => {}",

    // receive implicit any parameters
    "const fn = (params)=> {};",
    // "const fn = ({param1, param2}: {param1: string, param2: string})=> {};",
    // "const fn = ({param1, ...rest}: {param1: string, param2: string})=> {};",
  ],
  invalid: [
    // Receive Object
    {
      code: "const fn = (param1: string)=> {};",
      // invalid tests must always specify the expected errors
      errors: [
        {
          messageId: "shouldReceiveSingleObject",
          // If applicable - it's recommended that you also assert the data in
          // addition to the messageId so that you can ensure the correct message
          // is generated
          data: {
            placeholder1: "a",
          },
        },
      ],
    },
    {
      code: "const fn = (param1: object, param2: object)=> {};",
      // invalid tests must always specify the expected errors
      errors: [
        {
          messageId: "shouldReceiveSingleObject",
        },
      ],
    },

    // JSX
    {
      code: "const z = (input: string) => <div />;",
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
      errors: [
        {
          messageId: "shouldReceiveSingleObject",
        },
      ],
    },

    // suggestions can be tested via errors
    // {
    //   code: "const d = 1;",
    //   output: null,
    //   errors: [
    //     {
    //       messageId: "suggestionError",
    //       suggestions: [
    //         {
    //           messageId: "suggestionOne",
    //           output: "const e = 1;",
    //         },
    //       ],
    //     },
    //   ],
    // },
  ],
});
