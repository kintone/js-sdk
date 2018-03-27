'use strict';

import { Answers } from 'inquirer';
import { UserAnswers } from './qa';

const jQueryURL = 'https://js.cybozu.com/jquery/3.3.1/jquery.min.js';

const baseManifest = {
  manifest_version: 1,
  version: 1,
  type: 'APP',
  desktop: {
    js: [jQueryURL, 'js/desktop.js'],
    css: ['css/desktop.css']
  },
  icon: 'image/icon.png'
};

export interface Manifest {
  manifest_version: number;
  version: number;
  type: 'APP';
  name: {
    ja?: string;
    en: string;
    zh?: string;
  };
  description?: {
    ja?: string;
    en: string;
    zh?: string;
  };
  icon: string;
  homepage_url?: {
    ja?: string;
    en?: string;
    zh?: string;
  };
  desktop?: {
    js?: string[];
    css?: string[];
  };
  mobile?: {
    js?: string[];
  };
  config?: {
    html?: string;
    js?: string[];
    css?: string[];
    required_params?: string[];
  };
}

function answer2Manifest(answers: Answers): Manifest {
  const filteredAnswer = Object.keys(answers).reduce((acc, key) => {
    if (typeof answers[key] === 'boolean') {
      return acc;
    }
    if (
      typeof answers[key] === 'string' &&
      (answers[key] === '' || answers[key] == null)
    ) {
      return acc;
    }
    if (typeof answers[key] === 'object' && !Array.isArray(answers[key])) {
      return { ...acc, [key]: answer2Manifest(answers[key]) };
    }
    return { ...acc, ...{ [key]: answers[key] } };
  }, {}) as { [key: string]: string };
  return Object.keys(filteredAnswer).reduce((acc, key) => {
    if (
      typeof filteredAnswer[key] === 'object' &&
      !Array.isArray(filteredAnswer[key]) &&
      Object.keys(filteredAnswer[key]).length === 0
    ) {
      return acc;
    }
    return { ...acc, ...{ [key]: filteredAnswer[key] } };
  }, {}) as Manifest;
}

/**
 * Build the manifest setting
 * @param answers
 */
export function buildManifest(answers: UserAnswers): Manifest {
  let manifest = { ...baseManifest, ...answer2Manifest(answers) };
  if (answers.mobile) {
    manifest = {
      ...manifest,
      ...{
        mobile: {
          js: [jQueryURL, 'js/mobile.js']
        }
      }
    };
  }
  if (answers.config) {
    manifest = {
      ...manifest,
      ...{
        config: {
          html: 'html/config.html',
          js: [jQueryURL, 'js/config.js'],
          css: ['css/config.css'],
          required_params: []
        }
      }
    };
  }
  return manifest;
}
