import path from "path";
import * as yazl from "yazl";
import * as yauzl from "yauzl";
import { promisify } from "util";
import validate from "@kintone/plugin-manifest-validator";
import * as streamBuffers from "stream-buffers";

import { generateErrorMessages } from "./gen-error-msg";
import { sourceList } from "./sourcelist";

type ManifestJson = any;
type Entries = Map<string, any>;

interface PreprocessedContentsZip {
  zipFile: yauzl.ZipFile;
  entries: Entries;
  manifestJson: ManifestJson;
  manifestPath: string;
}

/**
 * Extract, validate and rezip contents.zip
 */
export const rezip = (contentsZip: Buffer): Promise<Buffer> => {
  return preprocessToRezip(contentsZip).then(
    ({ zipFile, entries, manifestJson, manifestPath }) => {
      validateManifest(entries, manifestJson, manifestPath);
      return rezipContents(zipFile, entries, manifestJson, manifestPath);
    }
  );
};

/**
 * Validate a buffer of contents.zip
 */
export const validateContentsZip = (contentsZip: Buffer): Promise<any> => {
  return preprocessToRezip(contentsZip).then(
    ({ entries, manifestJson, manifestPath }) =>
      validateManifest(entries, manifestJson, manifestPath)
  );
};

/**
 * Create an intermediate representation for contents.zip
 */
const preprocessToRezip = (
  contentsZip: Buffer
): Promise<PreprocessedContentsZip> => {
  return zipEntriesFromBuffer(contentsZip).then((result) => {
    const manifestList = Array.from(result.entries.keys()).filter(
      (file) => path.basename(file) === "manifest.json"
    );
    if (manifestList.length === 0) {
      throw new Error("The zip file has no manifest.json");
    } else if (manifestList.length > 1) {
      throw new Error("The zip file has many manifest.json files");
    }
    (result as any).manifestPath = manifestList[0];
    const manifestEntry = result.entries.get((result as any).manifestPath);
    return getManifestJsonFromEntry(result.zipFile, manifestEntry).then(
      (json: any) => Object.assign(result, { manifestJson: json })
    ) as any;
  });
};

const getManifestJsonFromEntry = (
  zipFile: yauzl.ZipFile,
  zipEntry: yauzl.ZipFile
): Promise<string> => {
  return zipEntryToString(zipFile, zipEntry).then((str) => JSON.parse(str));
};

const zipEntriesFromBuffer = (
  contentsZip: Buffer
): Promise<{
  zipFile: yauzl.ZipFile;
  entries: Entries;
}> => {
  return promisify(yauzl.fromBuffer)(contentsZip).then(
    (zipFile) =>
      new Promise((res, rej) => {
        const entries = new Map();
        const result = {
          zipFile,
          entries,
        };
        zipFile?.on("entry", (entry) => {
          entries.set(entry.fileName, entry);
        });
        zipFile?.on("end", () => {
          res(result);
        });
        zipFile?.on("error", rej);
      })
  ) as any;
};

const zipEntryToString = (
  zipFile: yauzl.ZipFile,
  zipEntry: any
): Promise<string> => {
  return new Promise((res, rej) => {
    zipFile.openReadStream(zipEntry, (e, stream) => {
      if (e) {
        rej(e);
      } else {
        const output = new streamBuffers.WritableStreamBuffer();
        output.on("finish", () => {
          res(output.getContents().toString("utf8"));
        });
        stream?.pipe(output);
      }
    });
  });
};

const validateManifest = (
  entries: Entries,
  manifestJson: ManifestJson,
  manifestPath: string
) => {
  // entry.fileName is a relative path separated by posix style(/) so this makes separators always posix style.
  const getEntryKey = (filePath: string) =>
    path
      .join(path.dirname(manifestPath), filePath)
      .replace(new RegExp(`\\${path.sep}`, "g"), "/");
  const result = validate(manifestJson, {
    relativePath: (filePath) => entries.has(getEntryKey(filePath)),
    maxFileSize: (maxBytes, filePath) => {
      const entry = entries.get(getEntryKey(filePath));
      if (entry) {
        return entry.uncompressedSize <= maxBytes;
      }
      return false;
    },
  });
  if (!result.valid) {
    const errors = generateErrorMessages(result.errors!);
    const e: any = new Error(errors.join(", "));
    e.validationErrors = errors;
    throw e;
  }
};

const rezipContents = (
  zipFile: yauzl.ZipFile,
  entries: Entries,
  manifestJson: ManifestJson,
  manifestPath: string
): Promise<Buffer> => {
  const manifestPrefix = path.dirname(manifestPath);

  return new Promise((res, rej) => {
    const newZipFile = new yazl.ZipFile();
    (newZipFile as any).on("error", rej);
    const output = new streamBuffers.WritableStreamBuffer();
    output.on("finish", () => {
      res(output.getContents() as Buffer);
    });
    newZipFile.outputStream.pipe(output);
    const openReadStream = promisify(zipFile.openReadStream.bind(zipFile));
    Promise.all(
      sourceList(manifestJson).map((src) => {
        const entry = entries.get(path.join(manifestPrefix, src));
        return openReadStream(entry).then((stream) => {
          newZipFile.addReadStream(stream!, src, {
            size: entry.uncompressedSize,
          });
        });
      })
    ).then(() => {
      newZipFile.end();
    });
  });
};
