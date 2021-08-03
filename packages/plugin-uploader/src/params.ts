import * as inquirer from "inquirer";
import { Lang } from "./lang";
import { getBoundMessage } from "./messages";

interface Params {
  username?: string;
  password?: string;
  baseUrl?: string;
  lang: Lang;
}

export const inquireParams = ({
  username,
  password,
  baseUrl,
  lang,
}: Params) => {
  const m = getBoundMessage(lang);
  const questions: inquirer.Question[] = [
    {
      type: "input",
      message: m("Q_BaseUrl"),
      name: "baseUrl",
      default: baseUrl,
      when: () => !baseUrl,
      validate: (v: string) => !!v,
    },
    {
      type: "input",
      name: "username",
      message: m("Q_UserName"),
      default: username,
      when: () => !username,
      validate: (v: string) => !!v,
    },
    {
      type: "password",
      name: "password",
      message: m("Q_Password"),
      default: password,
      when: () => !password,
      validate: (v: string) => !!v,
    },
  ];

  return inquirer
    .prompt(questions)
    .then((answers) => Object.assign({ username, password, baseUrl }, answers));
};
