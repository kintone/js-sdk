export const escapeDoubleQuotes = (fieldValue?: string | null) =>
  fieldValue ? fieldValue.replace(/"/g, '""') : "";
