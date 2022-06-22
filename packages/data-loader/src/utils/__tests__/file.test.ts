import { readFile, SupportedImportEncoding } from "../file";
import { expected } from "./fixtures/expected";

import path from "path";

describe("readFile", () => {
  it("can detect file format correctly", async () => {
    const INPUT_FILENAME = path.join(__dirname, "./fixtures/input_utf8.csv");
    const { format } = await readFile(INPUT_FILENAME);
    expect(format).toBe("csv");
  });

  it("throws error if format is JSON and encoding is not 'utf8'", async () => {
    const INPUT_FILENAME = path.join(__dirname, "./fixtures/input_utf8.json");
    await expect(readFile(INPUT_FILENAME, "sjis")).rejects.toThrow(
      "source file is JSON and JSON MUST be encoded with UTF-8"
    );
  });

  const encodings: SupportedImportEncoding[] = ["utf8", "sjis"];
  it.each(encodings)(
    "can read %s encoded csv file correctly",
    async (encoding) => {
      const INPUT_FILENAME = path.join(
        __dirname,
        `./fixtures/input_${encoding}.csv`
      );
      const { content } = await readFile(INPUT_FILENAME, encoding);
      expect(content).toBe(expected);
    }
  );
});
