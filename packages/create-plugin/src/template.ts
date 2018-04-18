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
      '@teppeis/kintone-plugin-packer',
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
  if (path.basename(filePath).startsWith('_')) {
    const src = fs.readFileSync(filePath, 'utf-8');
    const destPath = filePath
      .replace(/\//g, path.sep) // For windows
      .replace(srcDir, destDir)
      .replace(
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
    const destPath = filePath.replace(srcDir, destDir);
    if (fs.statSync(filePath).isDirectory()) {
      fs.mkdirSync(destPath);
    } else {
      fs.copyFileSync(filePath, destPath);
    }
  }
}
