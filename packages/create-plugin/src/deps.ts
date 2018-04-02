'use strict';

import { spawnSync } from 'child_process';
import { printLog } from './logger';
import { getMessage, Lang } from './messages';

/**
 * Install specified dependencies
 * @param deps
 * @param outputDirectory
 */
export function installDependencies(
  deps: {
    dependencies: string[];
    devDependencies: string[];
  },
  outputDirectory: string,
  lang: Lang
): void {
  const { dependencies, devDependencies } = deps;
  if (dependencies.length || devDependencies.length) {
    printLog(getMessage(lang, 'installDependencies'));
  }
  if (dependencies.length) {
    const result = spawnSync('npm', ['install', ...dependencies], {
      cwd: outputDirectory,
      stdio: 'inherit'
    });
    if (result.status !== 0) {
      throw new Error('Installing dependencies were failed');
    }
  }
  if (devDependencies.length) {
    const result = spawnSync(
      'npm',
      ['install', '--save-dev', ...devDependencies],
      {
        cwd: outputDirectory,
        stdio: 'inherit'
      }
    );
    if (result.status !== 0) {
      throw new Error('Installing devDependencies were failed');
    }
  }
}
