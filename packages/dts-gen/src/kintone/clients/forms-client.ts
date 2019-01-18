export interface FetchFormPropertiesInput {
    appId: string;
    preview: boolean | false;
    guestSpaceId: string | null;
}

export interface FieldType {
    type: string;
    code: string;
}

export interface SubTableFieldType {
    code: string;
    type: string;
    fields: FieldType[];
}

export type FieldTypesOrSubTableFieldTypes =
    | FieldType[]
    | SubTableFieldType[];

export interface FormsClient {
    fetchFormProperties(
        input: FetchFormPropertiesInput
    ): Promise<FieldTypesOrSubTableFieldTypes>;
}
