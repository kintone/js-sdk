export const encloseInQuotation = (fieldValue: string) =>
  `"${fieldValue ? fieldValue : ""}"`;
