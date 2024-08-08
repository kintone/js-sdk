import { input, select } from "@inquirer/prompts";
import type { BoundMessage } from "../../messages";

const validateForAppId = (v: string) => !!v;

export const promptForAppId = async (m: BoundMessage) => {
  return input({
    message: m("Q_AppId"),
    validate: validateForAppId,
  });
};

export const promptForScope = async (m: BoundMessage) => {
  return select({
    message: m("Q_Scope"),
    choices: [
      { name: "ALL", value: "ALL" },
      { name: "ADMIN", value: "ADMIN" },
      { name: "NONE", value: "NONE" },
    ],
  });
};
