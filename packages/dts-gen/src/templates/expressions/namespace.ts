import type { TypeDefinition, SavedTypeDefinition } from "./typedefinitions";
import type { TsExpression } from "./expression";

export class Namespace implements TsExpression {
  constructor(
    private namespace: string,
    private typeDefinition: TypeDefinition,
    private savedTypeDefinition: SavedTypeDefinition,
  ) {}
  tsExpression(): string {
    return `
declare namespace ${this.namespace} {
    ${this.typeDefinition.tsExpression()}
    ${this.savedTypeDefinition.tsExpression()}
}`.trim();
  }
}
