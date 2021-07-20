import { TsExpression, toTsExpressions } from "./expression";
import { Converter as FieldTypeConverter } from "./typescriptfieldtypeconverter";

export class FieldGroup implements TsExpression {
  constructor(
    private stringFields: TsDefinedField[],
    private calculatedFields: TsDefinedField[],
    private stringListFields: TsDefinedField[],
    private entityListFields: TsDefinedField[],
    private fileFields: TsDefinedField[]
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

export class TsDefinedField implements TsExpression {
  private readonly fieldName: string;
  private readonly fieldType: string;

  constructor(fieldName: string, fieldType: string) {
    this.fieldName = fieldName;
    this.fieldType = fieldType;
  }

  tsExpression(): string {
    return `"${this.fieldName}" : ${FieldTypeConverter.convert(
      this.fieldType
    )};`.trim();
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
