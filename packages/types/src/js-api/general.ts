export type LoginUser = {
  id: string;
  code: string;
  name: string;
  email: string;
  url: string;
  employeeNumber: string;
  phone: string;
  mobilePhone: string;
  extensionNumber: string;
  timezone: string;
  isGuest: boolean;
  language: "ja" | "en" | "zh" | "zh-TW" | "es" | "pt-BR" | "th";
};
