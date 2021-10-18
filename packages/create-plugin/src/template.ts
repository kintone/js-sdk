"use strict";

import * as fs from "fs";
import * as _ from "lodash";
import * as path from "path";
import { Manifest } from "./manifest";

export const SUPPORT_TEMPLATE_TYPE = ["minimum", "modern"];
export type TemplateType = "minimum" | "modern";

export const isValidTemplateType = (templateType: string) => {
  return SUPPORT_TEMPLATE_TYPE.indexOf(templateType) !== -1;
};

/**
 * Return a template type corresponding to the manifest
 * @param manifest
 */
export const getTemplateType = (manifest: Manifest): TemplateType => {
  // We don't have any other template types
  return "minimum";
};

/**
 * return `true` if `file` is necessary.
 * @param manifest
 * @param file
 */
export const isNecessaryFile = (manifest: Manifest, file: string): boolean => {
  if (/with-plugin-uploader.json/.test(file)) {
    return false;
  }
  if (/mobile\..+/.test(file)) {
    return !!manifest.mobile;
  }
  if (/config\..+/.test(file)) {
    return !!manifest.config;
  }
  return true;
};

/**
 * Process a template file
 * @param filePath
 * @param srcDir
 * @param destDir
 * @param manifest
 * @param enablePluginUploader
 */
export const processTemplateFile = (
  filePath: string,
  srcDir: string,
  destDir: string,
  manifest: Manifest,
  enablePluginUploader: boolean
): void => {
  const destFilePath = filePath
    // For Windows
    .replace(/\//g, path.sep)
    .replace(srcDir, destDir);

  if (path.basename(filePath).endsWith(".tmpl")) {
    const src = fs.readFileSync(filePath, "utf-8");
    const destPath = destFilePath.replace(
      new RegExp(path.basename(filePath) + "$"),
      path.basename(filePath).replace(/\.tmpl$/, "")
    );
    fs.writeFileSync(
      destPath,
      _.template(src)(
        Object.assign({}, manifest, {
          enablePluginUploader,
          // It's a function to remove whitespaces for pacakge.json's name field
          normalizePackageName: (name: string) => name.replace(/\s/g, "-"),
        })
      )
    );
  } else if (filePath === path.join(srcDir, "package.json")) {
    const packageJson: PackageJson = JSON.parse(
      fs.readFileSync(filePath, "utf-8")
    );
    packageJson.name = manifest.name.en.replace(/\s/g, "-");
    if (enablePluginUploader) {
      const withPluginUploaderJson: WithPluginUploaderJson = JSON.parse(
        fs.readFileSync(path.join(srcDir, "with-plugin-uploader.json"), "utf-8")
      );
      if (withPluginUploaderJson.scripts) {
        packageJson.scripts = {
          ...packageJson.scripts,
          ...withPluginUploaderJson.scripts,
        };
      }
      if (withPluginUploaderJson.dependencies) {
        packageJson.dependencies = {
          ...packageJson.dependencies,
          ...withPluginUploaderJson.dependencies,
        };
      }
      if (withPluginUploaderJson.devDependencies) {
        packageJson.devDependencies = {
          ...packageJson.devDependencies,
          ...withPluginUploaderJson.devDependencies,
        };
      }
    }
    fs.writeFileSync(destFilePath, JSON.stringify(packageJson, null, 2));
  } else if (fs.statSync(filePath).isDirectory()) {
    fs.mkdirSync(destFilePath);
  } else {
    // fs.copyFileSync is only available <= v8.5.0
    // fs.copyFileSync(filePath, destFilePath);
    fs.writeFileSync(destFilePath, fs.readFileSync(filePath));
  }
};

type PackageJson = {
  name?: string;
  version?: string;
  scripts?: { [key: string]: string };
  dependencies?: { [key: string]: string };
  devDependencies?: { [key: string]: string };
};

type WithPluginUploaderJson = {
  scripts?: { [key: string]: string };
  dependencies?: { [key: string]: string };
  devDependencies?: { [key: string]: string };
};
