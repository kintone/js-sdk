import fs from "fs";
import path from "path";

export const readFile: (
  filePath: string
) => Promise<{ content: string; format: string }> = async (filePath) => {
  const stream = fs.createReadStream(filePath);
  const content = await readStream(stream);
  const format = extractFileFormat(filePath);
  return { content, format };
};

const readStream = async (stream: fs.ReadStream, encoding = "utf8") => {
  stream.setEncoding(encoding);
  let content = "";
  for await (const chunk of stream) {
    content += chunk;
  }
  return content;
};

const extractFileFormat = (filepath: string) => {
  // TODO this cannot detect file format without extensions
  return path.extname(filepath).split(".").pop() || "";
};
