import fs from "fs";
import path from "path";
import iconv from "iconv-lite";

export type SupportedImportEncoding = "utf8" | "sjis";

export const readFile: (
  filePath: string,
  encoding?: SupportedImportEncoding
) => Promise<{ content: string; format: string }> = async (
  filePath,
  encoding = "utf8"
) => {
  const format = extractFileFormat(filePath);
  if (format === "json" && encoding !== "utf8") {
    throw new Error("source file is JSON and JSON MUST be encoded with UTF-8");
  }
  const stream = fs
    .createReadStream(filePath)
    .pipe(iconv.decodeStream(encoding));
  const content = await readStream(stream);
  return { content, format };
};

const readStream: (stream: NodeJS.ReadWriteStream) => Promise<string> = async (
  stream
) => {
  let content = "";
  for await (const chunk of stream) {
    content += chunk;
  }
  return content;
};

const extractFileFormat: (filepath: string) => string = (filepath) => {
  // TODO this cannot detect file format without extensions
  return path.extname(filepath).split(".").pop() || "";
};
