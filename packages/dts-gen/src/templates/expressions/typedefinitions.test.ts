import { TypeDefinition, SavedTypeDefinition } from "./typedefinitions";
import { FieldGroup, SubTableField, TsDefinedField } from "./fields";

describe("TypeDefinition", () => {
  class TestFieldGroup extends FieldGroup {
    constructor() {
      super(null, null, null, null, null);
    }
    tsExpression(): string {
      return "// FieldGroup";
    }
  }

  class TestSubTableField extends SubTableField {
    constructor() {
      super(null, null, null);
    }
    tsExpression(): string {
      return "// SubTableField";
    }
  }

  test("tsExpression()", () => {
    expect(
      new TypeDefinition("TestType", new TestFieldGroup(), [
        new TestSubTableField(),
        new TestSubTableField(),
      ])
        .tsExpression()
        .trim()
    ).toEqual(
      `
interface TestType {
    // FieldGroup
    // SubTableField
// SubTableField
}`.trim()
    );
  });
});

describe("SavedTypeDefinition", () => {
  class TestStringFieldInSavedRecord extends TsDefinedField {
    constructor() {
      super(null, null);
    }
    tsExpression(): string {
      return "// StringFieldInSavedRecord";
    }
  }
  class TestUserField extends TsDefinedField {
    constructor() {
      super(null, null);
    }
    tsExpression(): string {
      return "// UserField";
    }
  }
  test("tsExpression()", () => {
    expect(
      new SavedTypeDefinition(
        "TestType",
        [new TestUserField()],
        [new TestStringFieldInSavedRecord()]
      )
        .tsExpression()
        .trim()
    ).toEqual(
      `
interface SavedTestType extends TestType {
    $id : kintone.fieldTypes.Id;
    $revision: kintone.fieldTypes.Revision;
    // UserField
    // StringFieldInSavedRecord
}`.trim()
    );
  });
});
