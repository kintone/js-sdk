"use strict";

import * as fs from "fs";
import * as glob from "glob";
import * as path from "path";
import { installDependencies } from "./deps";
import { Lang } from "./lang";
import { Manifest } from "./manifest";
import { generatePrivateKey } from "./privateKey";
import {
  filterTemplateFile,
  processTemplateFile,
  TemplateType,
} from "./template";

/**
 * Create a plugin project based on passed manifest and install dependencies
 * @param outputDirectory
 * @param manifest
 */
export function generatePlugin(
  outputDirectory: string,
  manifest: Manifest,
  lang: Lang,
  enablePluginUploader: boolean,
  templateType: TemplateType
): void {
  // copy and build a project into the output diretory
  buildProject(outputDirectory, manifest, enablePluginUploader, templateType);
  // npm install
  installDependencies(outputDirectory, lang);
}

/**
 * Create a plugin project based on passed manifest
 * @param outputDirectory
 * @param manifest
 */
function buildProject(
  outputDirectory: string,
  manifest: Manifest,
  enablePluginUploader: boolean,
  templateType: TemplateType
): void {
  fs.mkdirSync(outputDirectory);
  // This is necessary for unit testing
  // We use src/generator.ts directory instead of dist/src/generator.js when unit testing
  const templatePath =
    __dirname.indexOf("dist") === -1
      ? path.join(__dirname, "..", "templates", templateType)
      : path.join(__dirname, "..", "..", "templates", templateType);
  glob
    .sync(path.resolve(templatePath, "**", "*"), {
      dot: true,
    })
    .filter(filterTemplateFile.bind(null, manifest))
    .forEach((file: string) =>
      processTemplateFile(
        file,
        templatePath,
        outputDirectory,
        manifest,
        enablePluginUploader
      )
    );
  fs.writeFileSync(
    path.resolve(outputDirectory, "private.ppk"),
    generatePrivateKey()
  );
  fs.writeFileSync(
    path.resolve(
      outputDirectory,
      templateType === "modern" ? "plugin" : "src",
      "manifest.json"
    ),
    JSON.stringify(manifest, null, 2)
  );
}
