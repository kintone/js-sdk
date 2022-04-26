import fs from "fs";
import path from "path";
import iconv from "iconv-lite";

export type ImportEncoding = "utf8" | "sjis";

export const readFile: (
  filePath: string,
  encoding?: ImportEncoding
) => Promise<{ content: string; format: string }> = async (
  filePath,
  encoding
) => {
  const stream = fs
    .createReadStream(filePath)
    .pipe(iconv.decodeStream(encoding || "utf8"));
  const content = await readStream(stream);
  const format = extractFileFormat(filePath);
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
