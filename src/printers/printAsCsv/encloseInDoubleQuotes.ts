export const encloseInDoubleQuotes: (fieldValue: string) => string = (
  fieldValue
) => `"${fieldValue ? fieldValue : ""}"`;
