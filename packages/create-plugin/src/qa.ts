"use strict";

import type { Lang } from "./lang";
import type { BoundMessage } from "./messages";
import {
  promptForDescription,
  promptForEnablePluginUploader,
  promptForHomepage,
  promptForName,
  promptForOptionalDescription,
  promptForOptionalName,
  promptForSupportLang,
  promptForSupportMobile,
} from "./qa/prompt";

export type Answers = {
  name: {
    ja?: string;
    en: string;
    zh?: string;
    es?: string;
  };
  description: {
    ja?: string;
    en: string;
    zh?: string;
    es?: string;
  };
  homepage_url?: {
    ja?: string;
    en?: string;
    zh?: string;
    es?: string;
  };
  supportMobile: boolean;
  enablePluginUploader: boolean;
  [key: string]: unknown;
};

export const getDefaultName = (outputDir: string) =>
  outputDir.replace(/.*\//, "");

export const runPrompt = async (
  m: BoundMessage,
  outputDir: string,
  lang: Lang,
): Promise<Answers> => {
  const enName = await promptForName(m, "En", getDefaultName(outputDir));
  const enDescription = await promptForDescription(m, "En", enName);

  const supportJa = await promptForSupportLang(m, "Ja", lang === "ja");
  const jaName = supportJa ? await promptForOptionalName(m, "Ja") : undefined;
  const jaDescription = supportJa
    ? await promptForOptionalDescription(m, "Ja")
    : undefined;

  const supportZh = await promptForSupportLang(m, "Zh");
  const zhName = supportZh ? await promptForOptionalName(m, "Zh") : undefined;
  const zhDescription = supportZh
    ? await promptForOptionalDescription(m, "Zh")
    : undefined;

  const supportEs = await promptForSupportLang(m, "Es");
  const esName = supportEs ? await promptForOptionalName(m, "Es") : undefined;
  const esDescription = supportEs
    ? await promptForOptionalDescription(m, "Es")
    : undefined;

  const enHomepage = await promptForHomepage(m, "En");
  const jaHomepage = supportJa ? await promptForHomepage(m, "Ja") : undefined;
  const zhHomepage = supportZh ? await promptForHomepage(m, "Zh") : undefined;
  const esHomepage = supportEs ? await promptForHomepage(m, "Es") : undefined;

  const supportMobile = await promptForSupportMobile(m);
  const enablePluginUploader = await promptForEnablePluginUploader(m);

  const result = {
    name: {
      en: enName,
      ja: jaName,
      zh: zhName,
      es: esName,
    },
    description: {
      en: enDescription,
      ja: jaDescription,
      zh: zhDescription,
      es: esDescription,
    },
    supportMobile: supportMobile,
    enablePluginUploader: enablePluginUploader,
  } as Answers;
  if (enHomepage) {
    result.homepage_url = {
      en: enHomepage,
      ja: jaHomepage,
      zh: zhHomepage,
      es: esHomepage,
    };
  }
  return result;
};
