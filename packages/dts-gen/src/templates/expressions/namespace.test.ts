import { Namespace } from "./namespace";
import {
    TypeDefinition,
    SavedTypeDefinition,
} from "./typedefinitions";

describe("Namespace", () => {
    class TestTypeDefinition extends TypeDefinition {
        constructor() {
            super(null, null, []);
        }
        tsExpression(): string {
            return "interface TestType {}";
        }
    }

    class TestSavedTypeDefinition extends SavedTypeDefinition {
        constructor() {
            super(null, [], []);
        }
        tsExpression(): string {
            return "interface SavedTestType extends TestType {}";
        }
    }
    test("tsExpression()", () => {
        const typeName = "TestField";
        expect(
            new Namespace(
                "test.types",
                new TestTypeDefinition(),
                new TestSavedTypeDefinition()
            )
                .tsExpression()
                .trim()
        ).toEqual(
            `
declare namespace test.types {
    interface TestType {}
    interface SavedTestType extends TestType {}
}`.trim()
        );
    });
});
