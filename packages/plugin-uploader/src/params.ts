import * as inquirer from "inquirer";

interface Params {
  username?: string;
  password?: string;
  domain?: string;
}

export const inquireParams = ({ username, password, domain }: Params) => {
  const questions = [
    {
      type: "input",
      message: "Input your kintone's domain (example.cybozu.com):",
      name: "domain",
      default: domain,
      when: () => !domain,
      validate: (v: string) => !!v
    },
    {
      type: "input",
      name: "username",
      message: "Input your username:",
      default: username,
      when: () => !username,
      validate: (v: string) => !!v
    },
    {
      type: "password",
      name: "password",
      message: (answers: { username: string }) =>
        `Input ${answers.username}'s password:`,
      default: password,
      when: () => !password,
      validate: (v: string) => !!v
    }
  ];

  return inquirer
    .prompt(questions)
    .then(answers => Object.assign({ username, password, domain }, answers));
};
