import { validateArgs } from "../args";

const identifierConventionMsg = `In the ECMA262 specification, this is an invalid string as IdentifierName.`;
const invalidNamespaceMessage = `Invalid namespace option!\n${identifierConventionMsg}`;
const invalidTypeNameMessage = `Invalid type-name option!\n${identifierConventionMsg}`;
const baseInput = {
  baseUrl: "",
  preview: false,
  output: "",
  username: null,
  password: null,
  oAuthToken: null,
  apiToken: null,
  proxy: null,
  basicAuthPassword: null,
  basicAuthUsername: null,
  appId: null,
  guestSpaceId: null,
  typeName: "",
  namespace: "",
};
const patterns = [
  {
    description: "should error when do not specify base-url",
    input: {
      ...baseInput,
      baseUrl: null,
    },
    expected: {
      failure: {
        errorMessage: "--base-url (KINTONE_BASE_URL) must be specified",
      },
    },
  },
  {
    description:
      "should not error when specifying valid namespace and type-name",
    input: {
      ...baseInput,
      namespace: "com.cybozu.kintone",
      typeName: "AwesomeFields",
    },
    expected: {
      failure: undefined,
    },
  },
  {
    description: "should error when namespace starts with a digit",
    input: { ...baseInput, namespace: "1test" },
    expected: {
      failure: {
        errorMessage: invalidNamespaceMessage,
      },
    },
  },
  {
    description: "should error when namespace contains invalid characters",
    input: { ...baseInput, namespace: "te-st" },
    expected: {
      failure: {
        errorMessage: invalidNamespaceMessage,
      },
    },
  },
  {
    description: "should error when type-name starts with a digit",
    input: { ...baseInput, typeName: "1test" },
    expected: {
      failure: {
        errorMessage: invalidTypeNameMessage,
      },
    },
  },
  {
    description: "should error when type-name contains invalid characters",
    input: { ...baseInput, typeName: "te-st" },
    expected: {
      failure: {
        errorMessage: invalidTypeNameMessage,
      },
    },
  },
  {
    description: "should not error when type-name contains japanese characters",
    input: {
      ...baseInput,
      typeName: "案件管理",
    },
    expected: {
      failure: undefined,
    },
  },
  {
    description: "should not error when type-name is only symbols",
    input: {
      ...baseInput,
      typeName: "$$$",
    },
    expected: {
      failure: undefined,
    },
  },
  {
    description: "should error when type-name starts with a space",
    input: { ...baseInput, typeName: " test" },
    expected: {
      failure: {
        errorMessage: invalidTypeNameMessage,
      },
    },
  },
];

describe("validateInput", () => {
  test.each(patterns)("$description", (pattern) => {
    if (pattern.expected.failure !== undefined) {
      return expect(() => {
        validateArgs(pattern.input);
      }).toThrow(new Error(pattern.expected.failure.errorMessage));
    }

    return expect(() => {
      validateArgs(pattern.input);
    }).not.toThrow();
  });
});
