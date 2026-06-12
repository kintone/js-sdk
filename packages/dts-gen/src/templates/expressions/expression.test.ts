import type { TsExpression } from "./expression.js";
import { toTsExpressions } from "./expression.js";

describe("toTsExpressions", () => {
  class TestExpression implements TsExpression {
    expression: string;
    constructor(expression: string) {
      this.expression = expression;
    }
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
      ]),
    ).toEqual(
      `
1
2
3
`.trim(),
    );
  });
});
