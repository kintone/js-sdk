export const patterns: Array<{
  description: string;
  updateKey: string;
  errorMessage: string;
}> = [
  {
    description: "should throw error when update key field is not unique",
    updateKey: "singleLineText_nonUnique",
    errorMessage: "update key field should set to unique",
  },
  {
    description:
      "should throw error when unsupported field is passed as update key",
    updateKey: "date",
    errorMessage: "unsupported field type for update key",
  },
  {
    description:
      "should throw error when unexisted field is passed as update key",
    updateKey: "unexistedField",
    errorMessage: "no such update key",
  },
];
