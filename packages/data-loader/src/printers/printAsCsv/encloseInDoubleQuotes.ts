export const encloseInDoubleQuotes = (fieldValue: string) =>
  `"${fieldValue ? fieldValue : ""}"`;
