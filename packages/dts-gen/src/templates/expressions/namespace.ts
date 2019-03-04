import {
    TypeDefinition,
    SavedTypeDefinition,
} from "./typedefinitions";
import { TsExpression } from "./expression";

export class Namespace implements TsExpression {
    constructor(
        private namespace: string,
        private typeDefenition: TypeDefinition,
        private savedTypeDefenition: SavedTypeDefinition
    ) {}
    tsExpression(): string {
        return `
declare namespace ${this.namespace} {
    ${this.typeDefenition.tsExpression()}
    ${this.savedTypeDefenition.tsExpression()}
}`.trim();
    }
}
