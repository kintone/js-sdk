import { parseCsv } from "../index";

import { pattern as withoutSubtable } from "./fixtures/withoutSubtable";
import { pattern as withSubtable } from "./fixtures/withSubtable";

describe("parseCsv", () => {
  it.each([withoutSubtable, withSubtable])("$description", (pattern) => {
    expect(parseCsv(pattern.input, pattern.fieldsJson)).toEqual(
      pattern.expected
    );
  });
});
