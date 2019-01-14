
export interface FetchFormPropertiesInput {
    appId: string,
    preview?: boolean | false,
    guest?: boolean | false,
    guestSpaceId?: string | null
}

export interface FieldType {
    type: string,
    code: string,
}

export interface SubTableFieldType {
    type: "SUBTABLE",
    code: string,
    fields: {[key:string]: FieldType}
}

export interface FormsClient {
    fetchFormProperties(input: FetchFormPropertiesInput) : Promise<{[key:string]: FieldType|SubTableFieldType}>;
}