'use strict';

import * as fs from 'fs';
import * as _ from 'lodash';
import * as path from 'path';
import { Manifest } from './manifest';

export type TemplateType = 'minimum';

const deps = {
  minimum: {
    dependencies: [],
    devDependencies: [
      '@kintone/plugin-packer',
      'eslint',
      'eslint-config-kintone'
    ]
  }
};

/**
 * Return a template type corresponding to the manifest
 * @param manifest
 */
export function getTemplateType(manifest: Manifest): TemplateType {
  // We don't have any other template types
  return 'minimum';
}

/**
 * Return the dependencies and devDependencies correponding to the template type
 * @param templateType
 */
export function getDepsByTemplateType(
  templateType: TemplateType
): { dependencies: string[]; devDependencies: string[] } {
  return deps[templateType];
}

/**
 * Filter unnecessary files from template files
 * @param manifest
 * @param file
 */
export function filterTemplateFile(manifest: Manifest, file: string): boolean {
  if (/mobile\..+/.test(file)) {
    return !!manifest.mobile;
  }
  if (/config\..+/.test(file)) {
    return !!manifest.config;
  }
  return true;
}

/**
 * Process a template file
 * @param filePath
 * @param srcDir
 * @param destDir
 * @param manifest
 */
export function processTemplateFile(
  filePath: string,
  srcDir: string,
  destDir: string,
  manifest: Manifest
): void {
  const destFilePath = filePath
    // For Windows
    .replace(/\//g, path.sep)
    .replace(srcDir, destDir);

  if (path.basename(filePath).startsWith('_')) {
    const src = fs.readFileSync(filePath, 'utf-8');
    const destPath = destFilePath.replace(
      new RegExp(path.basename(filePath) + '$'),
      path.basename(filePath).substring(1)
    );
    fs.writeFileSync(
      destPath,
      _.template(src)(
        Object.assign({}, manifest, {
          // It's a function to remove whitespaces for pacakge.json's name field
          normalizePackageName: (name: string) => name.replace(/\s/g, '-')
        })
      )
    );
  } else {
    if (fs.statSync(filePath).isDirectory()) {
      fs.mkdirSync(destFilePath);
    } else {
      // fs.copyFileSync is only available <= v8.5.0
      // fs.copyFileSync(filePath, destFilePath);
      fs.writeFileSync(destFilePath, fs.readFileSync(filePath));
    }
  }
}
