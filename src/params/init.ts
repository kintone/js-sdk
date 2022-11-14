import * as inquirer from "inquirer";
import type { Lang } from "../lang";
import { getBoundMessage } from "../messages";

export const inquireInitParams = (lang: Lang) => {
  const appId: string = "";
  const scope: string = "";
  const m = getBoundMessage(lang);
  const questions = [
    {
      type: "input",
      message: m("Q_AppId"),
      name: "appId",
      validate: (v: string) => !!v,
    },
    {
      type: "list",
      message: m("Q_Scope"),
      name: "scope",
      choices: ["ALL", "ADMIN", "NONE"],
    },
  ];

  return inquirer
    .prompt(questions)
    .then((answers) => Object.assign({ appId, scope, lang }, answers));
};
