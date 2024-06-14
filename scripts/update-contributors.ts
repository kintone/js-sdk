// eslint-disable-next-line node/no-unpublished-import
import { Octokit } from "@octokit/rest";
import * as fs from "fs/promises";

const ignoredUsers = [
  "renovate[bot]",
  "github-actions[bot]",
  "trigger-github-actions-release[bot]",
  "renovate-bot",
];

const file = "README.md";

(async () => {
  const octokit = new Octokit();

  // We use stats because the response of octokit.repos.listContributors is missing some contributors.
  const resp = await octokit.repos.getContributorsStats({
    owner: "kintone",
    repo: "js-sdk",
  });

  const contributors = resp.data
    .filter(
      (c) =>
        c.author?.type === "User" && !ignoredUsers.includes(c.author.login),
    )
    .sort((c1, c2) => c2.total - c1.total)
    .map((c) => ({
      login: c.author?.login,
      avatar_url: c.author?.avatar_url,
      html_url: c.author?.html_url,
    }));

  const contributorIcons = contributors
    .map(
      (contributor) =>
        `[<img src="${contributor.avatar_url}" alt="${contributor.login} avatar" width="50" />](${contributor.html_url})`,
    )
    .join(" ");
  const newCredits = `<!-- credits-begin -->\n\n${contributorIcons}\n\n<!-- credits-end -->`;

  const content = await fs.readFile(file, { encoding: "utf-8" });
  const newContent = content.replace(
    /<!-- credits-begin -->.+<!-- credits-end -->/gs,
    newCredits,
  );

  await fs.writeFile(file, newContent);
})();
