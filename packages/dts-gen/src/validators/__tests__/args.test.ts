import { validateArgs } from "../args";

const invalidNamespaceMessage = "Invalid namespace option!";
const invalidTypeNameMessage = "Invalid type-name option!";
const baseInput = {
  baseUrl: "",
  preview: false,
  demo: false,
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
];

describe("validateInput", () => {
  test.each(patterns)("$description", (pattern) => {
    if (pattern.expected.failure !== undefined) {
      return expect(() => {
        validateArgs(pattern.input);
      }).toThrow(pattern.expected.failure.errorMessage);
    }

    return expect(() => {
      validateArgs(pattern.input);
    }).not.toThrow();
  });
});
