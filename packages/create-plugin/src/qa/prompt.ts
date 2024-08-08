import { confirm, input } from "@inquirer/prompts";
import type { BoundMessage } from "../messages";
import {
  validateForDescription,
  validateForName,
  validateForOptionalDescription,
  validateForOptionalName,
} from "./validator";

export type SupportLang = "En" | "Ja" | "Zh" | "Es";

export const promptForName = async (
  m: BoundMessage,
  supportLang: SupportLang,
  defaultAnswer: string,
) => {
  return input({
    message: m(`Q_Name${supportLang}`),
    default: defaultAnswer,
    validate: (value) =>
      validateForName(value) ? true : m(`Q_Name${supportLang}Error`),
  });
};

export const promptForDescription = async (
  m: BoundMessage,
  supportLang: SupportLang,
  defaultAnswer: string,
) => {
  return input({
    message: m(`Q_Description${supportLang}`),
    default: defaultAnswer,
    validate: (value) =>
      validateForDescription(value)
        ? true
        : m(`Q_Description${supportLang}Error`),
  });
};

export const promptForOptionalName = async (
  m: BoundMessage,
  supportLang: SupportLang,
) => {
  return input({
    message: m(`Q_Name${supportLang}`),
    validate: (value) =>
      validateForOptionalName(value) ? true : m(`Q_Name${supportLang}Error`),
  });
};

export const promptForOptionalDescription = async (
  m: BoundMessage,
  supportLang: SupportLang,
) => {
  return input({
    message: m(`Q_Description${supportLang}`),
    validate: (value) =>
      validateForOptionalDescription(value)
        ? true
        : m(`Q_Description${supportLang}Error`),
  });
};

export const promptForSupportLang = async (
  m: BoundMessage,
  supportLang: Exclude<SupportLang, "En">,
  defaultAnswer: boolean = false,
) => {
  return confirm({
    default: defaultAnswer,
    message: m(`Q_Support${supportLang}`),
  });
};

export const promptForHomepage = async (
  m: BoundMessage,
  supportLang: SupportLang,
) => {
  return input({
    message: m(`Q_WebsiteUrl${supportLang}`),
  });
};

export const promptForSupportMobile = async (m: BoundMessage) => {
  return confirm({
    default: true,
    message: m("Q_MobileSupport"),
  });
};

export const promptForEnablePluginUploader = async (m: BoundMessage) => {
  return confirm({
    default: true,
    message: m("Q_EnablePluginUploader"),
  });
};
