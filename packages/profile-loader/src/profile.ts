export const getProfile = (profile: string | undefined): string => {
  if (profile) {
    return profile;
  }
  if (process.env.KINTONE_PROFILE) {
    return process.env.KINTONE_PROFILE;
  }
  return "default";
};
