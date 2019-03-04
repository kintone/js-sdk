import {
    TypeDefinition,
    SavedTypeDefinition,
} from "./typedefinitions";
import {
    FieldGroup,
    StringField,
    SubTableField,
    StringListField,
    EntityListField,
    FileField,
    UserField,
} from "./fields";

describe("TypeDefinition", () => {
    class TestFieldGroup extends FieldGroup {
        constructor() {
            super(null, null, null, null);
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
            new TypeDefinition(
                "TestType",
                new TestFieldGroup(),
                [
                    new TestSubTableField(),
                    new TestSubTableField(),
                ]
            )
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
    class TestStringField extends StringField {
        constructor() {
            super(null, null);
        }
        tsExpression(): string {
            return "// StringField";
        }
    }
    class TestUserField extends UserField {
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
                [new TestStringField()]
            )
                .tsExpression()
                .trim()
        ).toEqual(
            `
interface SavedTestType extends TestType {
    $id : {
        type: \"__ID__\";
        value: string;
    };
    $revision: {
        type: \"__REVISION__\";
        value: string;
    };
    // UserField
    // StringField
}`.trim()
        );
    });
});
