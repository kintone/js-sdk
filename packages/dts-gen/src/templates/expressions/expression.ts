export interface TsExpression {
  tsExpression(): string;
}

export const toTsExpressions = (expressions: TsExpression[]): string => {
  return expressions.map((e) => e.tsExpression()).join("\n");
};
