import { validateArgs } from "../args";

const invalidNamespaceMessage = "Invalid namespace option!";
const invalidTypeNameMessage = "Invalid type-name option!";
const patterns = [
  {
    description:
      "should not error when specifying valid namespace and type-name",
    input: { namespace: "com.cybozu.kintone", typeName: "AwesomeFields" },
    expected: {
      failure: undefined,
    },
  },
  {
    description: "should error when namespace starts with a digit",
    input: { namespace: "1test" },
    expected: {
      failure: {
        errorMessage: invalidNamespaceMessage,
      },
    },
  },
  {
    description: "should error when namespace contains invalid characters",
    input: { namespace: "te-st" },
    expected: {
      failure: {
        errorMessage: invalidNamespaceMessage,
      },
    },
  },
  {
    description: "should error when type-name starts with a digit",
    input: { typeName: "1test" },
    expected: {
      failure: {
        errorMessage: invalidTypeNameMessage,
      },
    },
  },
  {
    description: "should error when type-name contains invalid characters",
    input: { typeName: "te-st" },
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
