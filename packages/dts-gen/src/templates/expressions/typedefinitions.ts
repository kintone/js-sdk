import {
    FieldGroup,
    SubTableField,
    TsDefinedField,
} from "./fields";
import {
    TsExpression,
    toTsExpressions,
} from "./expression";

export class TypeDefinition implements TsExpression {
    constructor(
        private typeName: string,
        private fieldGroup: FieldGroup,
        private subtableFields: SubTableField[]
    ) {}
    tsExpression(): string {
        return `
interface ${this.typeName} {
    ${this.fieldGroup.tsExpression()}
    ${toTsExpressions(this.subtableFields)}
}`.trim();
    }
}

export class SavedTypeDefinition implements TsExpression {
    constructor(
        private typeName: string,
        private userFields: TsDefinedField[],
        private stringFieldsInSavedRecord: TsDefinedField[]
    ) {}

    tsExpression(): string {
        return `
interface Saved${this.typeName} extends ${this.typeName} {
    $id : kintone.fieldTypes.Id;
    $revision: kintone.fieldTypes.Revision;
    ${toTsExpressions(this.userFields)}
    ${toTsExpressions(this.stringFieldsInSavedRecord)}
}`.trim();
    }
}
