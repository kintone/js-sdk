export const escapeQuotation = (fieldValue?: string | null) =>
  fieldValue ? fieldValue.replace(/"/g, '""') : "";
