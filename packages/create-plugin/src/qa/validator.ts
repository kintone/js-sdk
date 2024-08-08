const NAME_MAX_LENGTH = 64;
const DESCRIPTION_MAX_LENGTH = 200;

export const validateForName = (value: string) =>
  value.length > 0 && value.length <= NAME_MAX_LENGTH;

export const validateForDescription = (value: string) =>
  value.length > 0 && value.length <= DESCRIPTION_MAX_LENGTH;

export const validateForOptionalName = (value: string) =>
  value.length === 0 || value.length <= NAME_MAX_LENGTH;

export const validateForOptionalDescription = (value: string) =>
  value.length === 0 || value.length <= DESCRIPTION_MAX_LENGTH;
