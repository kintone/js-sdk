import * as inquirer from "inquirer";
import { Lang } from "./lang";
import { getBoundMessage } from "./messages";

interface Params {
  username?: string;
  password?: string;
  domain?: string;
  baseUrl?: string;
  lang: Lang;
}

export const inquireParams = ({
  username,
  password,
  domain,
  baseUrl,
  lang,
}: Params) => {
  const m = getBoundMessage(lang);
  const questions: inquirer.Question[] = [
    // TODO: remove an object of domain when `domain` option is deprecated
    {
      type: "input",
      message: m("Q_Domain"),
      name: "domain",
      default: domain,
      when: () => !baseUrl && !domain,
      validate: (v: string) => !!v,
    },
    {
      type: "input",
      message: m("Q_BaseUrl"),
      name: "baseUrl",
      default: baseUrl,
      when: (v: inquirer.Answers) => !baseUrl && !v.domain,
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
    .then((answers) =>
      Object.assign({ username, password, domain, baseUrl }, answers)
    );
};
