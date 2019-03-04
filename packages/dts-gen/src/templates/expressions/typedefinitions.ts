import {
    FieldGroup,
    SubTableField,
    UserField,
    StringField,
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
        private userFields: UserField[],
        private stringFields: StringField[]
    ) {}

    tsExpression(): string {
        return `
interface Saved${this.typeName} extends ${this.typeName} {
    $id : {
        type: "__ID__";
        value: string;
    };
    $revision: {
        type: "__REVISION__";
        value: string;
    };
    ${toTsExpressions(this.userFields)}
    ${toTsExpressions(this.stringFields)}
}`.trim();
    }
}
