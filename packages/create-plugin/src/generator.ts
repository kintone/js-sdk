'use strict';

import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import { installDependencies } from './deps';
import { Manifest } from './manifest';
import { Lang } from './messages';
import { generatePrivateKey } from './privateKey';
import {
  filterTemplateFile,
  getDepsByTemplateType,
  getTemplateType,
  processTemplateFile,
  TemplateType
} from './template';

/**
 * Create a plugin project based on passed manifest and install dependencies
 * @param outputDirectory
 * @param manifest
 */
export function generatePlugin(
  outputDirectory: string,
  manifest: Manifest,
  lang: Lang
): void {
  // copy and build a project into the output diretory
  buildProject(outputDirectory, manifest);
  // npm install
  installDependencies(
    getDepsByTemplateType(getTemplateType(manifest)),
    outputDirectory,
    lang
  );
}

/**
 * Create a plugin project based on passed manifest
 * @param outputDirectory
 * @param manifest
 */
function buildProject(outputDirectory: string, manifest: Manifest): void {
  const templateType = getTemplateType(manifest);
  fs.mkdirSync(outputDirectory);
  glob
    .sync(path.join('templates', templateType, '**', '*'), {
      dot: true
    })
    .filter(filterTemplateFile.bind(null, manifest))
    .forEach((file: string) =>
      processTemplateFile(
        file,
        path.join('templates', templateType),
        outputDirectory,
        manifest
      )
    );
  fs.writeFileSync(
    path.resolve(outputDirectory, 'private.ppk'),
    generatePrivateKey()
  );
  fs.writeFileSync(
    path.resolve(outputDirectory, 'src', 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
}
