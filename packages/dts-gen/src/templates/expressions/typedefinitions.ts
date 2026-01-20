import type { FieldGroup, SubTableField, TsDefinedField } from "./fields";
import type { TsExpression } from "./expression";
import { toTsExpressions } from "./expression";

export class TypeDefinition implements TsExpression {
  private typeName: string;
  private fieldGroup: FieldGroup;
  private subtableFields: SubTableField[];

  constructor(
    typeName: string,
    fieldGroup: FieldGroup,
    subtableFields: SubTableField[],
  ) {
    this.typeName = typeName;
    this.fieldGroup = fieldGroup;
    this.subtableFields = subtableFields;
  }
  tsExpression(): string {
    return `
interface ${this.typeName} {
    ${this.fieldGroup.tsExpression()}
    ${toTsExpressions(this.subtableFields)}
}`.trim();
  }
}

export class SavedTypeDefinition implements TsExpression {
  private typeName: string;
  private userFields: TsDefinedField[];
  private stringFieldsInSavedRecord: TsDefinedField[];

  constructor(
    typeName: string,
    userFields: TsDefinedField[],
    stringFieldsInSavedRecord: TsDefinedField[],
  ) {
    this.typeName = typeName;
    this.userFields = userFields;
    this.stringFieldsInSavedRecord = stringFieldsInSavedRecord;
  }

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
