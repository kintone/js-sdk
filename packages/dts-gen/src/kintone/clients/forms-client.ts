export interface FetchFormPropertiesInput {
  appId: string;
  preview: boolean | false;
  guestSpaceId: string | null;
}

export interface FieldType {
  type: string;
  code: string;
  relatedApp?: string;
}

export interface SubTableFieldType {
  code: string;
  type: string;
  fields: FieldNameAndFieldOrSubTableField;
}

export type FieldTypeOrSubTableFieldType = FieldType | SubTableFieldType;

export type FieldNameAndFieldOrSubTableField = {
  [key: string]: FieldTypeOrSubTableFieldType;
};

export interface FormsClient {
  fetchFormProperties(
    input: FetchFormPropertiesInput
  ): Promise<FieldNameAndFieldOrSubTableField>;
}
