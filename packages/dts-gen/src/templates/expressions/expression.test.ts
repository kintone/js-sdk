import {
    TsExpression,
    toTsExpressions,
} from "./expression";

describe("toTsExpressions", () => {
    class TestExpression implements TsExpression {
        constructor(private expression: string) {}
        tsExpression(): string {
            return this.expression;
        }
    }
    test("join all TsExpression after call tsExpression()", () => {
        expect(
            toTsExpressions([
                new TestExpression("1"),
                new TestExpression("2"),
                new TestExpression("3"),
            ])
        ).toEqual(
            `
1
2
3
`.trim()
        );
    });
});
