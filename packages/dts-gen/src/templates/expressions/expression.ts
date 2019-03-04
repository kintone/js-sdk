export interface TsExpression {
    tsExpression(): string;
}

export function toTsExpressions(
    expressions: TsExpression[]
): string {
    return expressions
        .map(e => e.tsExpression())
        .join("\n");
}
