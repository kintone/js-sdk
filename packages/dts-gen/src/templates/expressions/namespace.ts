import type { TypeDefinition, SavedTypeDefinition } from "./typedefinitions";
import type { TsExpression } from "./expression";

export class Namespace implements TsExpression {
  private namespace: string;
  private typeDefinition: TypeDefinition;
  private savedTypeDefinition: SavedTypeDefinition;

  constructor(
    namespace: string,
    typeDefinition: TypeDefinition,
    savedTypeDefinition: SavedTypeDefinition,
  ) {
    this.namespace = namespace;
    this.typeDefinition = typeDefinition;
    this.savedTypeDefinition = savedTypeDefinition;
  }
  tsExpression(): string {
    return `
declare namespace ${this.namespace} {
    ${this.typeDefinition.tsExpression()}
    ${this.savedTypeDefinition.tsExpression()}
}`.trim();
  }
}
