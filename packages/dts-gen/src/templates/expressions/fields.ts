import {
    TsExpression,
    toTsExpressions,
} from "./expression";

export class FieldGroup implements TsExpression {
    constructor(
        private stringFields: StringField[],
        private calculatedFields: CalculatedField[],
        private stringListFields: StringListField[],
        private entityListFields: EntityListField[],
        private fileFields: FileField[]
    ) {}

    tsExpression(): string {
        return `
${toTsExpressions(this.stringFields)}
${toTsExpressions(this.calculatedFields)}
${toTsExpressions(this.stringListFields)}
${toTsExpressions(this.entityListFields)}
${toTsExpressions(this.fileFields)}
`.trim();
    }
}

export class StringField implements TsExpression {
    constructor(
        private fieldName: string,
        private fieldType: string
    ) {}

    tsExpression(): string {
        return `
"${this.fieldName}" : {
    type: "${this.fieldType}";
    value: string;
    disabled?: boolean;
    error?: string;
};`.trim();
    }
}

export class CalculatedField implements TsExpression {
    constructor(
        private fieldName: string,
        private fieldType: string
    ) {}

    tsExpression(): string {
        return `
"${this.fieldName}" : {
    type: "${this.fieldType}";
    value: string;
    error?: string;
};`.trim();
    }
}

export class StringListField implements TsExpression {
    constructor(
        private fieldName: string,
        private fieldType: string
    ) {}
    tsExpression(): string {
        return `
"${this.fieldName}" : {
    type: "${this.fieldType}";
    value: string[];
    disabled?: boolean;
    error?: string;
};`.trim();
    }
}

export class StringFieldInSavedRecord
    implements TsExpression {
    constructor(
        private fieldName: string,
        private fieldType: string
    ) {}

    tsExpression(): string {
        return `
"${this.fieldName}" : {
    type: "${this.fieldType}";
    value: string;
    error?: string;
};`.trim();
    }
}

export class UserField implements TsExpression {
    constructor(
        private fieldName: string,
        private fieldType: string
    ) {}
    /**
     * field type of UserField is CREATOR,MODIFIER.
     * So error property not exists.
     */
    tsExpression(): string {
        return `
"${this.fieldName}" : {
    type: "${this.fieldType}";
    value: {code: string, name: string}; 
};`.trim();
    }
}

export class EntityListField implements TsExpression {
    constructor(
        private fieldName: string,
        private fieldType: string
    ) {}
    tsExpression(): string {
        return `
"${this.fieldName}" : {
    type: "${this.fieldType}";
    value: {code: string, name: string}[];
    disabled?: boolean;
    error?: string;
};`.trim();
    }
}

export class FileField implements TsExpression {
    constructor(
        private fieldName: string,
        private fieldType: string
    ) {}
    tsExpression(): string {
        return `
"${this.fieldName}" : {
    type: "${this.fieldType}";
    value: {
        contentType: string;
        fileKey: string;
        name: string;
        size: string;
    }[];
    disabled?: boolean;
    error?: string;
};`.trim();
    }
}

export class SubTableField implements TsExpression {
    constructor(
        private fieldName: string,
        private fieldType: string,
        private fieldGroup: FieldGroup
    ) {}
    tsExpression(): string {
        return `
"${this.fieldName}" : {
    type: "${this.fieldType}";
    value: {
        id: string;
        value: {
            ${this.fieldGroup.tsExpression()}
        }
    }[];
};`.trim();
    }
}
