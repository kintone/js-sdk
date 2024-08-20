import { input } from "@inquirer/prompts";
import type { BoundMessage } from "../../messages";

const validateForString = (v: string) => !!v;

export const promptForBaseUrl = async (
  m: BoundMessage,
  defaultAnswer?: string,
) => {
  return input({
    message: m("Q_BaseUrl"),
    default: defaultAnswer,
    validate: validateForString,
  });
};

export const promptForUsername = async (
  m: BoundMessage,
  defaultAnswer?: string,
) => {
  return input({
    message: m("Q_UserName"),
    default: defaultAnswer,
    validate: validateForString,
  });
};

export const promptForPassword = async (
  m: BoundMessage,
  defaultAnswer?: string,
) => {
  return input({
    message: m("Q_UserName"),
    default: defaultAnswer,
    validate: validateForString,
  });
};
