"use strict";

import type { Answers } from "./qa";
import type { TemplateType } from "./template";

const minimumManifest = {
  $schema:
    "https://raw.githubusercontent.com/kintone/js-sdk/%40kintone/plugin-manifest-validator%4010.2.0/packages/plugin-manifest-validator/manifest-schema.json",
  manifest_version: 1,
  version: 1,
  type: "APP",
  desktop: {
    js: ["js/desktop.js"],
    css: ["css/51-modern-default.css", "css/desktop.css"],
  },
  icon: "image/icon.png",
  config: {
    html: "html/config.html",
    js: ["js/config.js"],
    css: ["css/51-modern-default.css", "css/config.css"],
    required_params: ["message"],
  },
};

const modernManifest = {
  $schema:
    "https://raw.githubusercontent.com/kintone/js-sdk/%40kintone/plugin-manifest-validator%4010.2.0/packages/plugin-manifest-validator/manifest-schema.json",
  manifest_version: 1,
  version: 1,
  type: "APP",
  desktop: {
    js: ["js/desktop.js"],
    css: ["css/desktop.css"],
  },
  icon: "image/icon.png",
  config: {
    html: "html/config.html",
    js: ["js/config.js"],
    css: ["css/51-modern-default.css", "css/config.css"],
    required_params: ["message"],
  },
};

export interface Manifest {
  manifest_version: number;
  version: number;
  type: "APP";
  name: {
    ja?: string;
    en: string;
    zh?: string;
    es?: string;
  };
  description?: {
    ja?: string;
    en: string;
    zh?: string;
    es?: string;
  };
  icon: string;
  homepage_url?: {
    ja?: string;
    en?: string;
    zh?: string;
    es?: string;
  };
  desktop?: {
    js?: string[];
    css?: string[];
  };
  mobile?: {
    js?: string[];
    css?: string[];
  };
  config?: {
    html?: string;
    js?: string[];
    css?: string[];
    required_params?: string[];
  };
}

const answer2Manifest = (answers: Answers): Manifest => {
  const filteredAnswer = Object.keys(answers).reduce((acc, key) => {
    if (typeof answers[key] === "boolean") {
      return acc;
    }
    if (
      typeof answers[key] === "string" &&
      (answers[key] === "" || answers[key] == null)
    ) {
      return acc;
    }
    return { ...acc, ...{ [key]: answers[key] } };
  }, {}) as { [key: string]: string };
  return Object.keys(filteredAnswer).reduce((acc, key) => {
    if (
      typeof filteredAnswer[key] === "object" &&
      !Array.isArray(filteredAnswer[key]) &&
      Object.keys(filteredAnswer[key]).length === 0
    ) {
      return acc;
    }
    return { ...acc, ...{ [key]: filteredAnswer[key] } };
  }, {}) as Manifest;
};

/**
 * Build the manifest setting
 * @param answers
 * @param templateType
 */
export const buildManifest = (
  answers: Answers,
  templateType: TemplateType,
): Manifest => {
  let manifest = {
    ...(templateType === "modern" ? modernManifest : minimumManifest),
    ...answer2Manifest(answers),
  };
  if (answers.supportMobile) {
    manifest = {
      ...manifest,
      ...{
        mobile: {
          js: ["js/mobile.js"],
          css: ["css/mobile.css"],
        },
      },
    };
  }
  return manifest;
};
